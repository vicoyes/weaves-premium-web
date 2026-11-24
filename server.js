'use strict';

// Mini-backend de Weaves: sirve el sitio estático y gestiona los formularios
// de contacto y diagnóstico por SMTP (Google Workspace). Configuración por
// variables de entorno (ver .env.example).

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const MAX_BODY = 200 * 1024;
const MAX_FIELD = 4000;
const BRAND_DARK = '#1E2A4A';
const BRAND_TEAL = '#00B4A6';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const BLOCKED_NAMES = new Set(['server.js', 'package.json', 'package-lock.json', 'node_modules', 'test', 'tests']);

const EMAIL_RE = /^[^\s@,;<>"']+@[^\s@,;<>"']+\.[a-z]{2,}$/i;

// ---------- utilidades ----------

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function oneLine(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim();
}

function clean(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value).slice(0, MAX_FIELD);
  return String(value).slice(0, MAX_FIELD).trim();
}

function isTrue(value) {
  if (value === true) return true;
  return ['true', 'si', 'sí', 'on', '1'].includes(String(value ?? '').trim().toLowerCase());
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket.remoteAddress || 'desconocida';
}

function wantsJson(req) {
  return String(req.headers.accept || '').includes('application/json');
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

function pageHtml(title, message, ok) {
  const color = ok ? BRAND_TEAL : '#b42318';
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(title)} · Weaves</title></head>
<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;color:${BRAND_DARK};">
<main style="max-width:520px;margin:12vh auto;padding:32px;background:#fff;border-radius:12px;border-top:4px solid ${color};">
<h1 style="font-size:22px;margin:0 0 12px;">${escapeHtml(title)}</h1>
<p style="line-height:1.6;margin:0 0 20px;">${escapeHtml(message)}</p>
<a href="/" style="color:${BRAND_TEAL};font-weight:bold;">Volver al sitio</a>
</main></body></html>`;
}

function sendResult(req, res, status, ok, message) {
  if (wantsJson(req)) {
    return sendJson(res, status, ok ? { ok: true } : { ok: false, error: message });
  }
  const html = ok
    ? pageHtml('Recibido', 'Hemos recibido tu solicitud. Te responderemos en menos de 24 h hábiles.', true)
    : pageHtml('No pudimos enviar el formulario', message, false);
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(html);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('Solicitud demasiado grande.'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function parseBody(req) {
  const raw = await readBody(req);
  const type = String(req.headers['content-type'] || '').toLowerCase();
  if (type.includes('application/json')) {
    try {
      const parsed = JSON.parse(raw || '{}');
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch { /* cae al error de abajo */ }
    throw Object.assign(new Error('JSON no válido.'), { status: 400 });
  }
  if (type.includes('application/x-www-form-urlencoded')) {
    const out = {};
    for (const [k, v] of new URLSearchParams(raw)) out[k] = v;
    return out;
  }
  throw Object.assign(new Error('Tipo de contenido no admitido.'), { status: 415 });
}

// ---------- configuración y correo ----------

function loadConfig(env) {
  const port = Number(env.SMTP_PORT || 465);
  return {
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
    from: env.MAIL_FROM || env.SMTP_USER || '',
    to: env.MAIL_TO || 'thevikoyes@gmail.com,info@weavewp.com',
    forwardUrl: env.N8N_FORWARD_WEBHOOK_URL || '',
  };
}

function buildTransporter(config) {
  const nodemailer = require('nodemailer');
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
  });
}

function tableHtml(rows) {
  const body = rows
    .filter(([, v]) => v !== '' && v !== undefined)
    .map(([k, v]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e9f0;color:#5b6784;white-space:nowrap;vertical-align:top;">${escapeHtml(k)}</td>` +
      `<td style="padding:8px 12px;border-bottom:1px solid #e5e9f0;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`)
    .join('');
  return `<table style="border-collapse:collapse;width:100%;font-size:14px;">${body}</table>`;
}

function tableText(rows) {
  return rows.filter(([, v]) => v !== '' && v !== undefined).map(([k, v]) => `${k}: ${v}`).join('\n');
}

function layout(title, inner) {
  return `<!DOCTYPE html><html lang="es"><body style="margin:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;color:${BRAND_DARK};">
<div style="max-width:620px;margin:0 auto;padding:24px;">
<div style="background:${BRAND_DARK};color:#fff;padding:18px 24px;border-radius:10px 10px 0 0;font-size:18px;font-weight:bold;">Weaves</div>
<div style="background:#fff;padding:24px;border-radius:0 0 10px 10px;border-bottom:4px solid ${BRAND_TEAL};">
<h1 style="font-size:20px;margin:0 0 16px;color:${BRAND_DARK};">${escapeHtml(title)}</h1>
${inner}
</div></div></body></html>`;
}

function thanksMail(name, intro) {
  const first = oneLine(name).split(/\s+/)[0] || '';
  const greeting = first ? `Hola ${first},` : 'Hola,';
  const text = `${greeting}\n\n${intro} Te responderemos en menos de 24 h hábiles.\n\nSi necesitas añadir algo, responde a este correo.\n\nUn saludo,\nEl equipo de Weaves\nhttps://getweaves.com`;
  const html = layout('Hemos recibido tu solicitud',
    `<p style="line-height:1.6;">${escapeHtml(greeting)}</p>` +
    `<p style="line-height:1.6;">${escapeHtml(intro)} Te responderemos en <strong style="color:${BRAND_TEAL};">menos de 24 h hábiles</strong>.</p>` +
    `<p style="line-height:1.6;">Si necesitas añadir algo, responde a este correo.</p>` +
    `<p style="line-height:1.6;margin-bottom:0;">Un saludo,<br>El equipo de Weaves</p>`);
  return { text, html };
}

function formatDate(date) {
  return date.toISOString();
}

// ---------- aplicación ----------

function createApp(options = {}) {
  const env = options.env || process.env;
  const config = loadConfig(env);
  const fetchImpl = options.fetch || globalThis.fetch;
  const rateMax = options.rateLimitMax ?? 10;
  const rateWindow = options.rateLimitWindowMs ?? 15 * 60 * 1000;
  const now = options.now || (() => new Date());
  let transporter = options.transporter || null;
  const hits = new Map();

  function getTransporter() {
    if (!transporter) {
      if (!config.user || !config.pass) throw new Error('SMTP no configurado (SMTP_USER/SMTP_PASS).');
      transporter = buildTransporter(config);
    }
    return transporter;
  }

  function rateLimited(ip) {
    const t = Date.now();
    const recent = (hits.get(ip) || []).filter((ts) => t - ts < rateWindow);
    if (recent.length >= rateMax) {
      hits.set(ip, recent);
      return true;
    }
    recent.push(t);
    hits.set(ip, recent);
    if (hits.size > 5000) {
      for (const [key, list] of hits) if (!list.some((ts) => t - ts < rateWindow)) hits.delete(key);
    }
    return false;
  }

  function forward(kind, data) {
    if (!config.forwardUrl || typeof fetchImpl !== 'function') return;
    Promise.resolve()
      .then(() => fetchImpl(config.forwardUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: kind, ...data }),
        signal: AbortSignal.timeout(10000),
      }))
      .catch((err) => console.error(`[forward] ${kind}:`, err.message));
  }

  async function sendPair(internal, thanks) {
    const tx = getTransporter();
    const from = config.from;
    const [a, b] = await Promise.allSettled([
      tx.sendMail({ from, to: config.to, ...internal }),
      tx.sendMail({ from, replyTo: from, ...thanks }),
    ]);
    if (a.status === 'rejected') {
      console.error('[mail] fallo del aviso interno:', a.reason && a.reason.message);
      throw a.reason || new Error('Fallo del aviso interno');
    }
    if (b.status === 'rejected') {
      console.error('[mail] fallo del correo de agradecimiento:', b.reason && b.reason.message);
    }
  }

  function normalizeContact(body) {
    const pick = (...keys) => {
      for (const k of keys) if (body[k] !== undefined && clean(body[k]) !== '') return clean(body[k]);
      return '';
    };
    return {
      nombre: pick('nombre', 'name'),
      empresa: pick('empresa', 'company'),
      email: pick('email'),
      telefono: pick('telefono', 'phone'),
      proceso: pick('proceso', 'sector'),
      equipo: pick('equipo', 'team-size'),
      mensaje: pick('mensaje', 'message'),
      preferencia: pick('contact-preference'),
      privacidad: isTrue(body.privacidad),
      marketing: isTrue(body.marketing),
      pagina: pick('pagina'),
      origen: pick('origen'),
      utm_source: pick('utm_source'),
      utm_medium: pick('utm_medium'),
      utm_campaign: pick('utm_campaign'),
      enviado_en: pick('enviado_en'),
      idioma: pick('idioma'),
    };
  }

  async function handleContacto(req, res) {
    let body;
    try {
      body = await parseBody(req);
    } catch (err) {
      return sendResult(req, res, err.status || 400, false, err.message);
    }

    if (clean(body.website) !== '') return sendResult(req, res, 200, true);

    const d = normalizeContact(body);
    if (d.nombre.length < 2) return sendResult(req, res, 400, false, 'Escribe tu nombre.');
    if (d.empresa.length < 2) return sendResult(req, res, 400, false, 'Escribe el nombre de tu empresa.');
    if (!EMAIL_RE.test(d.email)) return sendResult(req, res, 400, false, 'Escribe un correo válido.');
    if (!d.privacidad) return sendResult(req, res, 400, false, 'Necesitamos tu autorización de privacidad para poder responderte.');

    const ip = clientIp(req);
    const fecha = formatDate(now());
    const rows = [
      ['Nombre', d.nombre], ['Empresa', d.empresa], ['Email', d.email], ['Teléfono', d.telefono],
      ['Proceso / sector', d.proceso], ['Tamaño del equipo', d.equipo], ['Mensaje', d.mensaje],
      ['Contacto preferido', d.preferencia],
      ['Página', d.pagina], ['Origen', d.origen],
      ['utm_source', d.utm_source], ['utm_medium', d.utm_medium], ['utm_campaign', d.utm_campaign],
      ['Acepta privacidad', 'Sí'], ['Acepta comunicaciones comerciales', d.marketing ? 'Sí' : 'No'],
      ['Idioma', d.idioma], ['Enviado en (navegador)', d.enviado_en], ['Recibido', fecha], ['IP', ip],
    ];
    const subject = `Nuevo contacto web: ${oneLine(d.nombre)} (${oneLine(d.empresa)})`;
    const internal = {
      replyTo: d.email,
      subject,
      text: `Nueva solicitud de contacto\n\n${tableText(rows)}`,
      html: layout('Nueva solicitud de contacto', tableHtml(rows)),
    };
    const thanks = {
      to: d.email,
      subject: 'Hemos recibido tu solicitud · Weaves',
      ...thanksMail(d.nombre, 'Gracias por escribirnos: hemos recibido tu solicitud.'),
    };

    try {
      await sendPair(internal, thanks);
    } catch (err) {
      console.error('[contacto] error de envío:', err && err.message);
      return sendResult(req, res, 500, false, 'No pudimos enviar el formulario. Inténtalo de nuevo o escríbenos a info@weavewp.com.');
    }
    forward('contacto', { ...d, ip, recibido: fecha });
    return sendResult(req, res, 200, true);
  }

  async function handleDiagnostico(req, res) {
    let body;
    try {
      body = await parseBody(req);
    } catch (err) {
      return sendJson(res, err.status || 400, { ok: false, error: err.message });
    }
    const answers = body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers) ? body.answers : null;
    const name = answers ? clean(answers.name) : '';
    const email = answers ? clean(answers.email) : '';
    if (!name) return sendJson(res, 400, { ok: false, error: 'Falta el nombre.' });
    if (!EMAIL_RE.test(email)) return sendJson(res, 400, { ok: false, error: 'Escribe un correo válido.' });

    const ip = clientIp(req);
    const fecha = formatDate(now());
    const answerRows = Object.entries(answers).map(([k, v]) => [
      k, Array.isArray(v) ? v.map(clean).join(', ') : clean(v),
    ]);
    const rows = [
      ['ID del diagnóstico', clean(body.diagnostic_id)],
      ['Enviado en (navegador)', clean(body.timestamp)],
      ['Recibido', fecha], ['IP', ip],
      ...answerRows,
    ];
    const company = clean(answers.company);
    const internal = {
      replyTo: email,
      subject: `Nuevo diagnóstico gratuito: ${oneLine(name)}${company ? ` (${oneLine(company)})` : ''}`,
      text: `Nuevo diagnóstico completado\n\n${tableText(rows)}`,
      html: layout('Nuevo diagnóstico completado', tableHtml(rows)),
    };
    const thanks = {
      to: email,
      subject: 'Hemos recibido tu diagnóstico · Weaves',
      ...thanksMail(name, 'Gracias por completar el diagnóstico: hemos recibido tus respuestas y nuestro equipo las revisará.'),
    };
    try {
      await sendPair(internal, thanks);
    } catch (err) {
      console.error('[diagnostico] error de envío:', err && err.message);
      return sendJson(res, 500, { ok: false, error: 'No pudimos enviar el diagnóstico. Inténtalo de nuevo.' });
    }
    forward('diagnostico', { diagnostic_id: clean(body.diagnostic_id), answers, ip, recibido: fecha });
    return sendJson(res, 200, { ok: true });
  }

  function serveStatic(req, res, pathname) {
    let decoded;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      res.writeHead(400); return res.end('Bad request');
    }
    if (decoded.includes('\0') || decoded.includes('\\')) { res.writeHead(403); return res.end('Forbidden'); }

    const segments = decoded.split('/').filter(Boolean);
    for (const seg of segments) {
      const lower = seg.toLowerCase();
      if (seg === '..' || seg.startsWith('.') || BLOCKED_NAMES.has(lower) || lower.startsWith('test')) {
        res.writeHead(403); return res.end('Forbidden');
      }
    }

    let file = path.resolve(ROOT, '.' + path.posix.normalize('/' + segments.join('/')));
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }

    let stat;
    try { stat = fs.statSync(file); } catch { res.writeHead(404); return res.end('Not found'); }
    if (stat.isDirectory()) {
      file = path.join(file, 'index.html');
      try { stat = fs.statSync(file); } catch { res.writeHead(404); return res.end('Not found'); }
    }
    try {
      const real = fs.realpathSync(file);
      if (real !== ROOT && !real.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
    } catch { res.writeHead(404); return res.end('Not found'); }

    const type = MIME[path.extname(file).toLowerCase()];
    if (!type) { res.writeHead(404); return res.end('Not found'); }

    const headers = {
      'Content-Type': type,
      'Content-Length': stat.size,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': type.startsWith('text/html') ? 'no-cache' : 'public, max-age=3600',
    };
    res.writeHead(200, headers);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
  }

  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const pathname = url.pathname;

      if (pathname === '/health') return sendJson(res, 200, { ok: true });

      if (pathname === '/api/contacto' || pathname === '/api/diagnostico') {
        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST');
          return sendJson(res, 405, { ok: false, error: 'Método no permitido.' });
        }
        if (rateLimited(clientIp(req))) {
          const msg = 'Demasiados envíos. Inténtalo de nuevo en unos minutos.';
          return pathname === '/api/diagnostico'
            ? sendJson(res, 429, { ok: false, error: msg })
            : sendResult(req, res, 429, false, msg);
        }
        return pathname === '/api/contacto' ? await handleContacto(req, res) : await handleDiagnostico(req, res);
      }
      if (pathname.startsWith('/api/')) return sendJson(res, 404, { ok: false, error: 'No encontrado.' });

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { Allow: 'GET, HEAD' });
        return res.end('Method not allowed');
      }
      return serveStatic(req, res, pathname);
    } catch (err) {
      console.error('[server] error inesperado:', err);
      if (!res.headersSent) sendJson(res, 500, { ok: false, error: 'Error interno.' });
      else res.destroy();
    }
  });
}

module.exports = { createApp, createServer: createApp, escapeHtml };

if (require.main === module) {
  const PORT = Number(process.env.PORT || 80);
  const HOST = '0.0.0.0';
  createApp().listen(PORT, HOST, () => console.log(`Weaves web escuchando en http://${HOST}:${PORT}`));
}
