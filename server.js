'use strict';

// Mini-backend de Weaves: sirve el sitio estático y gestiona los formularios
// de contacto y diagnóstico por SMTP (Google Workspace). Configuración por
// variables de entorno (ver .env.example).

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const MAX_BODY = 200 * 1024;
const MAX_FIELD = 4000;
const BRAND_DARK = '#1E2A4A';
const BRAND_TEAL = '#00B4A6';
const BRAND_TEAL_DARK = '#0F766E';
const SITE_URL = 'https://getweaves.com';
const WHATSAPP_URL = 'https://wa.me/573219610765?text=Hola%2C%20acabo%20de%20enviar%20una%20solicitud%20en%20la%20web';

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

function snippet(value, max) {
  const s = oneLine(value);
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
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
  // Cloudflare escribe la IP real del visitante en cf-connecting-ip y la sobrescribe
  // él mismo, así que es la fuente fiable cuando el sitio va proxied. X-Forwarded-For
  // queda de respaldo (y su primer salto puede venir falseado por el cliente).
  const cf = req.headers['cf-connecting-ip'];
  if (cf) return String(cf).split(',')[0].trim();
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket.remoteAddress || 'desconocida';
}

// ---------- antispam ----------

// Los dos formularios del sitio (el componente nuevo y el viejo de contacto.html)
// rellenan con JS las marcas de trazabilidad: pagina, origen, enviado_en, idioma.
// Un POST armado contra el API no las trae, y es como entró el spam de nov-2026:
// payload válido, honeypot vacío y sin una sola marca del navegador.
// No se descarta nada: el aviso interno sale marcado y sin acuse al remitente, así
// que un envío real sin JS (o con el JS roto) llega igual, solo que marcado.
function spamSignals(d) {
  const signals = [];
  if (!d.pagina && !d.idioma && !d.enviado_en) signals.push('sin marcas del formulario (POST directo al API)');
  return signals;
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

function pageHtml(title, message, ok, lang = 'es') {
  const color = ok ? BRAND_TEAL : '#b42318';
  return `<!DOCTYPE html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(title)} · Weaves</title></head>
<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;color:${BRAND_DARK};">
<main style="max-width:520px;margin:12vh auto;padding:32px;background:#fff;border-radius:12px;border-top:4px solid ${color};">
<h1 style="font-size:22px;margin:0 0 12px;">${escapeHtml(title)}</h1>
<p style="line-height:1.6;margin:0 0 20px;">${escapeHtml(message)}</p>
<a href="${lang === 'en' ? '/en/' : '/'}" style="color:${BRAND_TEAL};font-weight:bold;">${lang === 'en' ? 'Back to the site' : 'Volver al sitio'}</a>
</main></body></html>`;
}

function sendResult(req, res, status, ok, message) {
  if (wantsJson(req)) {
    return sendJson(res, status, ok ? { ok: true } : { ok: false, error: message });
  }
  const lang = req.contactLang || 'es';
  const html = ok
    ? pageHtml(lang === 'en' ? 'Received' : 'Recibido', lang === 'en' ? 'We have received your request. We will reply in less than 24 business hours.' : 'Hemos recibido tu solicitud. Te responderemos en menos de 24 h hábiles.', true, lang)
    : pageHtml(lang === 'en' ? 'We could not send the form' : 'No pudimos enviar el formulario', message, false, lang);
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

function summaryRowsHtml(rows) {
  const active = rows.filter(([, v]) => v !== '' && v !== undefined && v !== null);
  if (!active.length) return '';
  const cells = active.map(([k, v], i) => {
    const border = i < active.length - 1 ? 'border-bottom:1px solid #EEF2F6;' : '';
    const valStyle = `color:#1F2937;${i === 0 ? 'font-weight:600;' : ''}`;
    return `<tr>` +
      `<td class="sum-k" width="108" valign="top" style="padding:7px 12px 7px 0;${border}color:#6B7280;font-size:13px;white-space:nowrap;">${escapeHtml(k)}</td>` +
      `<td class="sum-v" valign="top" style="padding:7px 0;${border}${valStyle}font-size:14px;line-height:1.5;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(v)}</td>` +
      `</tr>`;
  }).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${cells}</table>`;
}

function thanksMail(name, intro, opts = {}) {
  const first = oneLine(name).split(/\s+/)[0] || '';
  const en = opts.lang === 'en';
  const greeting = en ? (first ? `Thank you, ${first}.` : 'Thank you for contacting us.') : (first ? `Gracias, ${first}.` : 'Gracias por escribirnos.');
  const eyebrow = opts.eyebrow || (en ? 'REQUEST RECEIVED' : 'SOLICITUD RECIBIDA');
  const subtitle = opts.subtitle || (en ? 'We are on it.' : 'Ya estamos en ello.');
  const summaryTitle = opts.summaryTitle || (en ? 'YOUR REQUEST' : 'RESUMEN DE TU SOLICITUD');
  const rows = Array.isArray(opts.summaryRows) ? opts.summaryRows : [];
  const preheader = opts.preheader || (en ? 'We will reply in less than 24 business hours. Here is a summary of your request.' : 'Te respondemos en menos de 24 h hábiles. Aquí tienes el resumen de tu solicitud.');

  const summaryText = tableText(rows);
  const textParts = [
    first ? `Hola ${first},` : 'Hola,',
    `${intro} Te responderemos en menos de 24 h hábiles.`,
    opts.reference ? `Referencia: #${opts.reference}` : '',
    summaryText ? `${summaryTitle}:\n${summaryText}` : '',
    '¿Quieres añadir algo? Responde a este correo y lo sumamos a tu solicitud.',
    `WhatsApp directo: ${WHATSAPP_URL}`,
    `Casos de éxito: ${SITE_URL}/pages/casos-exito.html`,
    `Un saludo,\nEl equipo de Weaves\n${SITE_URL}`,
  ].filter(Boolean);
  const text = textParts.join('\n\n');

  const summaryHtml = summaryRowsHtml(rows);
  const summaryBlock = summaryHtml
    ? `<tr><td class="px" style="padding:20px 40px 4px;">` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FC;border:1px solid #E5E7EB;border-radius:12px;">` +
      `<tr><td class="box-pad" style="padding:18px 22px;font-family:Arial,Helvetica,sans-serif;">` +
      `<p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:1.4px;color:#6B7280;font-weight:700;">${escapeHtml(summaryTitle)}</p>` +
      summaryHtml +
      `</td></tr></table></td></tr>`
    : '';

  const refBadge = opts.reference
    ? `<td align="right" valign="middle" style="font-family:'Courier New',Courier,monospace;font-size:11px;color:${BRAND_TEAL_DARK};"><span style="display:inline-block;background:#E6F8F6;border:1px solid #99F6E4;color:${BRAND_TEAL_DARK};padding:5px 10px;border-radius:999px;font-weight:700;">#${escapeHtml(opts.reference)}</span></td>`
    : '';

  let html = `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Hemos recibido tu solicitud · Weaves</title>
<!--[if mso]><style>table,td,div,p,a,h1{font-family:Arial,sans-serif !important;}</style><![endif]-->
<style>
body{margin:0;padding:0;background:#F8F9FC;}
a{text-decoration:none;}
@media (max-width:620px){
  .outer-pad{padding:16px 8px !important;}
  .container{width:100% !important;}
  .px{padding-left:20px !important;padding-right:20px !important;}
  .head-pad{padding:24px 20px 22px !important;}
  .foot-pad{padding:24px 20px 28px !important;}
  .box-pad{padding:16px !important;}
  .h1{font-size:25px !important;line-height:1.2 !important;}
  .step{display:block !important;width:100% !important;box-sizing:border-box !important;padding:0 0 10px 0 !important;}
  .step-last{padding-bottom:0 !important;}
  .btn-td{display:block !important;width:100% !important;box-sizing:border-box !important;padding:0 0 10px 0 !important;}
  .btn-a{display:block !important;width:100% !important;box-sizing:border-box !important;text-align:center !important;}
  .sum-k{width:88px !important;}
}
</style>
</head>
<body style="margin:0;padding:0;background:#F8F9FC;color:#1F2937;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F8F9FC;">${escapeHtml(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FC;">
<tr><td class="outer-pad" align="center" style="padding:28px 12px;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
<tr><td style="padding:0 4px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle" style="font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;color:${BRAND_DARK};">
      <a href="${SITE_URL}/" style="color:${BRAND_DARK};text-decoration:none;">
        <img src="${SITE_URL}/images/logo-weaves-on-light.png" width="132" height="54" alt="Weaves" style="display:block;border:0;width:132px;height:auto;font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:${BRAND_DARK};">
      </a>
    </td>
    ${refBadge}
  </tr></table>
</td></tr>
<tr><td style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="height:4px;line-height:4px;font-size:0;background:${BRAND_TEAL};">&nbsp;</td></tr>
    <tr><td class="head-pad" style="padding:32px 40px 24px;border-bottom:1px solid #EEF2F6;background:#FFFFFF;">
      <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:1.8px;color:${BRAND_TEAL_DARK};font-weight:700;">— ${escapeHtml(eyebrow)}</p>
      <h1 class="h1" style="margin:0;font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:30px;line-height:1.18;font-weight:600;color:${BRAND_DARK};">${escapeHtml(greeting)}<br><span style="color:${BRAND_TEAL_DARK};">${escapeHtml(subtitle)}</span></h1>
    </td></tr>
    <tr><td class="px" style="padding:24px 40px 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#1F2937;">
      ${escapeHtml(intro)} Te responderemos en <strong style="color:${BRAND_TEAL_DARK};">menos de 24 h hábiles</strong>.
    </td></tr>
    <tr><td class="px" style="padding:18px 40px 4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="step" width="33%" valign="top" style="padding-right:6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F0FDFA;border:1px solid #99F6E4;border-top:3px solid ${BRAND_TEAL};border-radius:10px;"><tr><td style="padding:11px 12px;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0;font-size:12px;font-weight:700;color:${BRAND_TEAL_DARK};">&#10003; 1. Recibida</p>
            <p style="margin:3px 0 0;font-size:12px;color:#475569;">Ahora</p>
          </td></tr></table>
        </td>
        <td class="step" width="33%" valign="top" style="padding:0 3px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FC;border:1px solid #E5E7EB;border-top:3px solid #99F6E4;border-radius:10px;"><tr><td style="padding:11px 12px;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0;font-size:12px;font-weight:700;color:${BRAND_DARK};">2. En revisión</p>
            <p style="margin:3px 0 0;font-size:12px;color:#6B7280;">Analizamos tu caso</p>
          </td></tr></table>
        </td>
        <td class="step step-last" width="33%" valign="top" style="padding-left:6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FC;border:1px solid #E5E7EB;border-top:3px solid #CBD5E1;border-radius:10px;"><tr><td style="padding:11px 12px;font-family:Arial,Helvetica,sans-serif;">
            <p style="margin:0;font-size:12px;font-weight:700;color:${BRAND_DARK};">3. Respuesta</p>
            <p style="margin:3px 0 0;font-size:12px;color:#6B7280;">&lt; 24 h hábiles</p>
          </td></tr></table>
        </td>
      </tr></table>
    </td></tr>
    ${summaryBlock}
    <tr><td class="px" style="padding:22px 40px 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1F2937;">
      ¿Quieres añadir algo? <strong>Responde a este correo</strong> y lo sumamos a tu solicitud. Si es urgente, escríbenos por WhatsApp.
    </td></tr>
    <tr><td class="px" style="padding:14px 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="btn-td" style="padding-right:10px;">
          <a class="btn-a" href="${WHATSAPP_URL}" style="display:inline-block;background:${BRAND_TEAL_DARK};color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.2;padding:13px 22px;border-radius:999px;border:1px solid ${BRAND_TEAL_DARK};">Escribir por WhatsApp</a>
        </td>
        <td class="btn-td">
          <a class="btn-a" href="${SITE_URL}/pages/casos-exito.html" style="display:inline-block;background:#FFFFFF;color:${BRAND_DARK};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.2;padding:13px 22px;border-radius:999px;border:1px solid #CBD5E1;">Ver casos de éxito</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td class="foot-pad" style="padding:26px 40px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #EEF2F6;">
        <tr><td style="padding-top:20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td width="42" valign="middle" style="width:42px;height:42px;border-radius:21px;background:#E6F8F6;border:1px solid #99F6E4;color:${BRAND_TEAL_DARK};font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:16px;text-align:center;">W</td>
            <td valign="middle" style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;">
              <p style="margin:0;font-weight:700;color:${BRAND_DARK};">El equipo de Weaves</p>
              <p style="margin:2px 0 0;font-size:13px;color:#6B7280;">Web · Automatizaciones · IA</p>
            </td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>
<tr><td align="center" style="padding:20px 16px 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6B7280;">
  <a href="${SITE_URL}/" style="color:${BRAND_TEAL_DARK};font-weight:600;">getweaves.com</a> &nbsp;·&nbsp;
  <a href="${SITE_URL}/pages/blog.html" style="color:#6B7280;">Blog</a> &nbsp;·&nbsp;
  <a href="${SITE_URL}/pages/casos-exito.html" style="color:#6B7280;">Casos de éxito</a> &nbsp;·&nbsp;
  <a href="${SITE_URL}/legal/politica-privacidad.html" style="color:#6B7280;">Privacidad</a><br>
  Recibes este correo porque nos escribiste desde la web de Weaves.<br>
  Weaves · España y Latinoamérica
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  if (en) {
    const translations = [
      ['<html lang="es"', '<html lang="en"'],
      ['Hemos recibido tu solicitud · Weaves', 'We have received your request · Weaves'],
      [`Te responderemos en <strong style="color:${BRAND_TEAL_DARK};">menos de 24 h hábiles</strong>.`, `We will reply in <strong style="color:${BRAND_TEAL_DARK};">less than 24 business hours</strong>.`],
      ['1. Recibida', '1. Received'], ['>Ahora<', '>Now<'], ['2. En revisión', '2. In review'],
      ['Analizamos tu caso', 'We review your situation'], ['3. Respuesta', '3. Reply'], ['24 h hábiles', '24 business hours'],
      ['¿Quieres añadir algo? <strong>Responde a este correo</strong> y lo sumamos a tu solicitud. Si es urgente, escríbenos por WhatsApp.', 'Want to add anything? <strong>Reply to this email</strong> and we will add it to your request. If it is urgent, contact us on WhatsApp.'],
      ['Escribir por WhatsApp', 'Message us on WhatsApp'], ['Ver casos de éxito', 'View case studies'],
      ['El equipo de Weaves', 'The Weaves team'], ['Web · Automatizaciones · IA', 'Web · Automation · AI'],
      ['>Casos de éxito<', '>Case studies<'], ['>Privacidad<', '>Privacy<'],
      ['Recibes este correo porque nos escribiste desde la web de Weaves.', 'You received this email because you contacted us through the Weaves website.'],
      ['Weaves · España y Latinoamérica', 'Weaves · Spain and Latin America']
    ];
    for (const [from, to] of translations) html = html.split(from).join(to);
    return { text: [first ? `Hello ${first},` : 'Hello,', `${intro} We will reply in less than 24 business hours.`, opts.reference ? `Reference: #${opts.reference}` : '', summaryText ? `${summaryTitle}:\n${summaryText}` : '', 'Want to add anything? Reply to this email and we will add it to your request.', `WhatsApp: ${WHATSAPP_URL}`, `The Weaves team\n${SITE_URL}`].filter(Boolean).join('\n\n'), html };
  }
  return { text, html };
}

function formatDate(date) {
  return date.toISOString();
}

function makeRef(date) {
  const day = formatDate(date).slice(2, 10).replace(/-/g, '');
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `WV-${day}-${rand}`;
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
      thanks ? tx.sendMail({ from, replyTo: from, ...thanks }) : Promise.resolve(null),
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

    req.contactLang = body.lang === 'en' || (!body.lang && body.idioma === 'en') ? 'en' : 'es';
    if (clean(body.website) !== '') return sendResult(req, res, 200, true);

    const d = normalizeContact(body);
    const english = body.lang === 'en' || (!body.lang && body.idioma === 'en');
    const errors = english ? {
      name: 'Enter your name.', company: 'Enter your company name.', email: 'Enter a valid email address.',
      privacy: 'We need your privacy consent to respond.', send: 'We could not send the form. Try again or email info@weavewp.com.'
    } : {
      name: 'Escribe tu nombre.', company: 'Escribe el nombre de tu empresa.', email: 'Escribe un correo válido.',
      privacy: 'Necesitamos tu autorización de privacidad para poder responderte.', send: 'No pudimos enviar el formulario. Inténtalo de nuevo o escríbenos a info@weavewp.com.'
    };
    if (d.nombre.length < 2) return sendResult(req, res, 400, false, errors.name);
    if (d.empresa.length < 2) return sendResult(req, res, 400, false, errors.company);
    if (!EMAIL_RE.test(d.email)) return sendResult(req, res, 400, false, errors.email);
    if (!d.privacidad) return sendResult(req, res, 400, false, errors.privacy);

    const ip = clientIp(req);
    const signals = spamSignals(d);
    const current = now();
    const fecha = formatDate(current);
    const ref = makeRef(current);
    const rows = [
      ['Referencia', ref], ['Nombre', d.nombre], ['Empresa', d.empresa], ['Email', d.email], ['Teléfono', d.telefono],
      ['Proceso / sector', d.proceso], ['Tamaño del equipo', d.equipo], ['Mensaje', d.mensaje],
      ['Contacto preferido', d.preferencia],
      ['Página', d.pagina], ['Origen', d.origen],
      ['utm_source', d.utm_source], ['utm_medium', d.utm_medium], ['utm_campaign', d.utm_campaign],
      ['Acepta privacidad', 'Sí'], ['Acepta comunicaciones comerciales', d.marketing ? 'Sí' : 'No'],
      ['Idioma', d.idioma], ['Enviado en (navegador)', d.enviado_en], ['Recibido', fecha], ['IP', ip],
      ...(signals.length ? [['Aviso', `POSIBLE SPAM — ${signals.join('; ')}. No se envió acuse al remitente.`]] : []),
    ];
    const subject = `${signals.length ? '[POSIBLE SPAM] ' : ''}Nuevo contacto web: ${oneLine(d.nombre)} (${oneLine(d.empresa)})`;
    const internal = {
      replyTo: d.email,
      subject,
      text: `Nueva solicitud de contacto\n\n${tableText(rows)}`,
      html: layout('Nueva solicitud de contacto', tableHtml(rows)),
    };
    const thanks = english ? {
      to: d.email,
      subject: 'We have received your request · Weaves',
      ...thanksMail(d.nombre, 'We have received your request and will begin reviewing it.', {
        lang: 'en', reference: ref,
        summaryRows: [['Service', ({ 'Atención al cliente y WhatsApp': 'Customer service and WhatsApp', 'Administración, facturas y documentos': 'Administration, invoices and documents', 'Seguimiento comercial y CRM': 'Sales follow-up and CRM', 'Otro proceso': 'Other process' })[d.proceso] || d.proceso], ['Company', d.empresa], ['Message', snippet(d.mensaje, 400)]],
      }),
    } : {
      to: d.email,
      subject: 'Hemos recibido tu solicitud · Weaves',
      ...thanksMail(d.nombre, 'Hemos recibido tu solicitud y empieza la revisión.', {
        reference: ref,
        summaryRows: [
          ['Servicio', d.proceso],
          ['Empresa', d.empresa],
          ['Mensaje', snippet(d.mensaje, 400)],
        ],
      }),
    };

    try {
      await sendPair(internal, signals.length ? null : thanks);
    } catch (err) {
      console.error('[contacto] error de envío:', err && err.message);
      return sendResult(req, res, 500, false, errors.send);
    }
    if (signals.length) console.warn(`[contacto] posible spam (${signals.join('; ')}): ${oneLine(d.nombre)} <${oneLine(d.email)}> ip=${ip}`);
    forward('contacto', { ...d, ip, recibido: fecha, ...(signals.length ? { posible_spam: signals } : {}) });
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
    // El chat guarda los datos de contacto anidados en answers.contact_info;
    // se aceptan también en plano (answers.name) para no depender de la forma.
    const nested = answers && answers.contact_info && typeof answers.contact_info === 'object' && !Array.isArray(answers.contact_info)
      ? answers.contact_info : {};
    const field = (key) => clean(answers && answers[key] !== undefined ? answers[key] : nested[key]);
    const name = answers ? field('name') : '';
    const email = answers ? field('email') : '';
    if (!name) return sendJson(res, 400, { ok: false, error: 'Falta el nombre.' });
    if (!EMAIL_RE.test(email)) return sendJson(res, 400, { ok: false, error: 'Escribe un correo válido.' });

    const ip = clientIp(req);
    const current = now();
    const fecha = formatDate(current);
    const diagId = clean(body.diagnostic_id);
    const ref = makeRef(current);
    // Tabla interna plana: los datos de contacto anidados suben al mismo nivel.
    const flat = { ...nested, ...(answers || {}) };
    delete flat.contact_info;
    const answerRows = Object.entries(flat).map(([k, v]) => [
      k, Array.isArray(v) ? v.map(clean).join(', ') : clean(v),
    ]);
    const rows = [
      ['Referencia', ref],
      ['ID del diagnóstico', diagId],
      ['Enviado en (navegador)', clean(body.timestamp)],
      ['Recibido', fecha], ['IP', ip],
      ...answerRows,
    ];
    const company = field('company');
    const internal = {
      replyTo: email,
      subject: `Nuevo diagnóstico gratuito: ${oneLine(name)}${company ? ` (${oneLine(company)})` : ''}`,
      text: `Nuevo diagnóstico completado\n\n${tableText(rows)}`,
      html: layout('Nuevo diagnóstico completado', tableHtml(rows)),
    };
    const thanks = {
      to: email,
      subject: 'Hemos recibido tu diagnóstico · Weaves',
      ...thanksMail(name, 'Hemos recibido tus respuestas y empieza la revisión.', {
        eyebrow: 'DIAGNÓSTICO RECIBIDO',
        summaryTitle: 'RESUMEN DE TU DIAGNÓSTICO',
        reference: ref,
        preheader: 'Te respondemos en menos de 24 h hábiles. Aquí tienes el resumen de tu diagnóstico.',
        summaryRows: [['Empresa', company]],
      }),
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

module.exports = { createApp, createServer: createApp, escapeHtml, thanksMail };

if (require.main === module) {
  const PORT = Number(process.env.PORT || 80);
  const HOST = '0.0.0.0';
  createApp().listen(PORT, HOST, () => console.log(`Weaves web escuchando en http://${HOST}:${PORT}`));
}
