'use strict';

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createApp } = require('../server.js');

function mockTransporter() {
  const sent = [];
  return { sent, sendMail: async (m) => { sent.push(m); return { messageId: 'x' }; } };
}

function start(opts = {}) {
  const transporter = opts.transporter || mockTransporter();
  const server = createApp({ transporter, env: { MAIL_FROM: 'web@weavewp.com', MAIL_TO: 'a@x.com,b@x.com' }, ...opts });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, transporter, port: server.address().port })));
}

function request(port, { method = 'GET', path = '/', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, method, path, headers }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try { json = JSON.parse(text); } catch { /* no es JSON */ }
        resolve({ status: res.statusCode, headers: res.headers, text, json });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

const postJson = (port, url, obj, extra = {}) => request(port, {
  method: 'POST', path: url,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...extra },
  body: JSON.stringify(obj),
});

const homeLead = {
  nombre: 'Ana Pérez', empresa: 'Acme <b>SA</b>', email: 'ana@acme.co', telefono: '+57 300 000',
  proceso: 'Atención al cliente y WhatsApp', equipo: '1 a 10 personas', mensaje: '<script>alert(1)</script>',
  privacidad: true, marketing: false, website: '', pagina: 'https://getweaves.com/', origen: '',
  utm_source: 'g', utm_medium: 'cpc', utm_campaign: 'x', enviado_en: '2026-11-24T10:00:00Z', idioma: 'es',
};

describe('servidor', () => {
  let ctx;
  before(async () => { ctx = await start({ rateLimitMax: 1000 }); });
  after(() => ctx.server.close());
  const reset = () => { ctx.transporter.sent.length = 0; };

  test('GET /health', async () => {
    const r = await request(ctx.port, { path: '/health' });
    assert.equal(r.status, 200);
    assert.deepEqual(r.json, { ok: true });
  });

  test('estáticos: / y contacto son HTML', async () => {
    for (const p of ['/', '/pages/contacto.html']) {
      const r = await request(ctx.port, { path: p });
      assert.equal(r.status, 200, p);
      assert.match(r.headers['content-type'], /^text\/html/);
    }
  });

  test('bloquea ficheros sensibles y path traversal', async () => {
    for (const p of ['/server.js', '/package.json', '/package-lock.json', '/../etc/passwd', '/%2e%2e/etc/passwd',
      '/..%2f..%2fetc/passwd', '/.gitignore', '/.env.example', '/node_modules/nodemailer/package.json',
      '/test/server.test.js', '/extract_css.py', '/index.html.old']) {
      const r = await request(ctx.port, { path: p });
      assert.ok([403, 404].includes(r.status), `${p} -> ${r.status}`);
    }
  });

  test('contacto inválido o sin privacidad -> 400', async () => {
    reset();
    for (const body of [{}, { ...homeLead, privacidad: false }, { ...homeLead, email: 'no-es-email' },
      { ...homeLead, nombre: 'A' }, { ...homeLead, empresa: '' }]) {
      const r = await postJson(ctx.port, '/api/contacto', body);
      assert.equal(r.status, 400);
      assert.equal(r.json.ok, false);
      assert.ok(r.json.error);
    }
    assert.equal(ctx.transporter.sent.length, 0);
  });

  test('English contact validation and acknowledgment', async () => {
    reset();
    for (const [body, message] of [
      [{}, 'Enter your name.'],
      [{ ...homeLead, empresa: '' }, 'Enter your company name.'],
      [{ ...homeLead, email: 'bad' }, 'Enter a valid email address.'],
      [{ ...homeLead, privacidad: false }, 'We need your privacy consent to respond.'],
    ]) {
      const response = await postJson(ctx.port, '/api/contacto', { ...body, lang: 'en' });
      assert.equal(response.status, 400);
      assert.equal(response.json.error, message);
    }
    const response = await postJson(ctx.port, '/api/contacto', { ...homeLead, lang: 'en' });
    assert.equal(response.status, 200);
    assert.match(ctx.transporter.sent[0].subject, /Nuevo contacto/);
    assert.match(ctx.transporter.sent[1].text, /24 business hours/);
    assert.match(ctx.transporter.sent[1].html, /<html lang="en"/);
  });

  test('honeypot -> 200 ok sin correos', async () => {
    reset();
    const r = await postJson(ctx.port, '/api/contacto', { ...homeLead, website: 'http://spam' });
    assert.equal(r.status, 200);
    assert.deepEqual(r.json, { ok: true });
    assert.equal(ctx.transporter.sent.length, 0);
  });

  test('POST directo al API sin marcas del navegador -> marcado y sin acuse', async () => {
    reset();
    const { pagina, origen, enviado_en, idioma, ...directo } = homeLead;
    const r = await postJson(ctx.port, '/api/contacto', directo);
    assert.equal(r.status, 200);
    assert.deepEqual(r.json, { ok: true });
    assert.equal(ctx.transporter.sent.length, 1, 'solo el aviso interno: el acuse no se manda');
    const [internal] = ctx.transporter.sent;
    assert.match(internal.subject, /^\[POSIBLE SPAM\] Nuevo contacto web/);
    assert.ok(internal.text.includes('sin marcas del formulario'));
  });

  test('lead del navegador (con pagina/idioma/enviado_en) -> aviso limpio y acuse', async () => {
    reset();
    const r = await postJson(ctx.port, '/api/contacto', homeLead, { 'x-forwarded-for': '203.0.113.7' });
    assert.equal(r.status, 200);
    assert.equal(ctx.transporter.sent.length, 2);
    assert.doesNotMatch(ctx.transporter.sent[0].subject, /POSIBLE SPAM/);
  });

  test('contacto válido (home) envía 2 correos y escapa XSS', async () => {
    reset();
    const r = await postJson(ctx.port, '/api/contacto', homeLead, { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' });
    assert.equal(r.status, 200);
    assert.deepEqual(r.json, { ok: true });
    const [internal, thanks] = ctx.transporter.sent;
    assert.equal(ctx.transporter.sent.length, 2);
    assert.equal(internal.to, 'a@x.com,b@x.com');
    assert.equal(internal.replyTo, 'ana@acme.co');
    assert.ok(!internal.html.includes('<script>'));
    assert.ok(internal.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(internal.html.includes('Acme &lt;b&gt;SA&lt;/b&gt;'));
    assert.ok(internal.html.includes('203.0.113.7'));
    assert.ok(internal.text.includes('utm_campaign: x'));
    assert.equal(thanks.to, 'ana@acme.co');
    assert.equal(thanks.replyTo, 'web@weavewp.com');
    assert.match(thanks.html, /24 h hábiles/);
  });

  test('contacto válido (contacto.html, campos equivalentes)', async () => {
    reset();
    const r = await postJson(ctx.port, '/api/contacto', {
      name: 'Luis Gómez', company: 'Beta', email: 'luis@beta.co', phone: '3000000', sector: 'Inmobiliaria',
      message: 'hola', 'team-size': '6-15', 'contact-preference': 'email', privacidad: true, marketing: true, website: '',
      // js/forms.js añade estas cuatro al enviar; sin ellas el aviso sale marcado.
      pagina: 'https://getweaves.com/pages/contacto.html', origen: '', enviado_en: '2026-11-24T10:00:00Z', idioma: 'es',
    });
    assert.equal(r.status, 200);
    assert.deepEqual(r.json, { ok: true });
    assert.equal(ctx.transporter.sent.length, 2);
    assert.ok(ctx.transporter.sent[0].text.includes('Inmobiliaria'));
    assert.ok(ctx.transporter.sent[0].text.includes('6-15'));
  });

  test('contacto form-urlencoded sin JS: HTML de gracias y aviso marcado (sin acuse)', async () => {
    reset();
    const body = new URLSearchParams({
      nombre: 'Eva <i>R</i>', empresa: 'Gamma', email: 'eva@gamma.co', privacidad: 'si', website: '',
    }).toString();
    const r = await request(ctx.port, {
      method: 'POST', path: '/api/contacto',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' }, body,
    });
    assert.equal(r.status, 200);
    assert.match(r.headers['content-type'], /text\/html/);
    assert.match(r.text, /Recibido/);
    // Sin JS no hay marcas del navegador: el aviso llega marcado y no se manda acuse.
    assert.equal(ctx.transporter.sent.length, 1);
    assert.match(ctx.transporter.sent[0].subject, /POSIBLE SPAM/);
    assert.ok(ctx.transporter.sent[0].html.includes('Eva &lt;i&gt;R&lt;/i&gt;'));

    const bad = await request(ctx.port, {
      method: 'POST', path: '/api/contacto',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' }, body: 'nombre=x',
    });
    assert.equal(bad.status, 400);
    assert.match(bad.text, /No pudimos enviar/);
  });

  test('si falla solo el agradecimiento, sigue 200; si falla el interno, 500', async () => {
    const onlyThanksFails = { sent: [], sendMail: async (m) => { if (m.to === 'ana@acme.co') throw new Error('x'); } };
    const a = await start({ transporter: onlyThanksFails });
    const ok = await postJson(a.port, '/api/contacto', homeLead);
    assert.equal(ok.status, 200);
    a.server.close();

    const internalFails = { sendMail: async (m) => { if (m.to !== 'ana@acme.co') throw new Error('x'); } };
    const b = await start({ transporter: internalFails });
    const bad = await postJson(b.port, '/api/contacto', homeLead);
    assert.equal(bad.status, 500);
    assert.equal(bad.json.ok, false);
    b.server.close();
  });

  test('diagnóstico válido -> 200 y 2 correos; inválido -> 400', async () => {
    reset();
    const good = await postJson(ctx.port, '/api/diagnostico', {
      diagnostic_id: 'd1', timestamp: '2026-11-24T10:00:00Z',
      answers: { name: 'Marta <x>', email: 'marta@z.co', company: 'Z', role: 'founder', tools: ['crm', 'wa'] },
    });
    assert.equal(good.status, 200);
    assert.deepEqual(good.json, { ok: true });
    assert.equal(ctx.transporter.sent.length, 2);
    assert.ok(ctx.transporter.sent[0].html.includes('Marta &lt;x&gt;'));
    assert.ok(ctx.transporter.sent[0].html.includes('crm, wa'));
    assert.equal(ctx.transporter.sent[1].to, 'marta@z.co');

    reset();
    for (const body of [{}, { answers: {} }, { answers: { name: 'A' } }, { answers: { name: 'A', email: 'bad' } },
      { answers: { email: 'a@b.co' } }]) {
      const r = await postJson(ctx.port, '/api/diagnostico', body);
      assert.equal(r.status, 400);
      assert.equal(r.json.ok, false);
    }
    assert.equal(ctx.transporter.sent.length, 0);
  });

  test('reenvío a n8n no bloquea ni rompe la respuesta', async () => {
    const calls = [];
    const c = await start({
      env: { N8N_FORWARD_WEBHOOK_URL: 'http://n8n.invalid/hook', MAIL_FROM: 'w@w.co' },
      fetch: async (url, init) => { calls.push([url, init]); throw new Error('caído'); },
    });
    const r = await postJson(c.port, '/api/contacto', homeLead);
    assert.equal(r.status, 200);
    await new Promise((res) => setTimeout(res, 20));
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], 'http://n8n.invalid/hook');
    c.server.close();
  });

  test('plantilla de agradecimiento: sin @import, sin enlaces 404 conocidos, con referencia', async () => {
    reset();
    const r = await postJson(ctx.port, '/api/contacto', homeLead);
    assert.equal(r.status, 200);
    const thanks = ctx.transporter.sent[1];
    assert.ok(!thanks.html.includes('@import'));
    assert.ok(!thanks.html.includes('https://weavewp.com/casos'));
    assert.ok(!thanks.html.includes('https://weavewp.com/blog'));
    assert.ok(thanks.html.includes('https://getweaves.com/pages/casos-exito.html'));
    assert.match(thanks.html, /#WV-\d{6}-[0-9A-F]{4}/);
    assert.match(thanks.text, /Referencia: #WV-\d{6}-[0-9A-F]{4}/);
  });

  test('diagnóstico con la forma real del chat (contact_info anidado)', async () => {
    reset();
    const r = await postJson(ctx.port, '/api/diagnostico', {
      diagnostic_id: 'diag_1_abc', timestamp: '2026-11-24T10:00:00Z',
      answers: {
        role: 'founder', sector: 'tech', company_size: '6-20',
        communication_tools: ['whatsapp_business', 'email'], internal_tools: ['crm'],
        preferred_contact: 'whatsapp',
        contact_info: { name: 'Marta Ruiz', email: 'marta@z.co', phone: '', company: 'Zeta SA' },
      },
    });
    assert.equal(r.status, 200);
    assert.deepEqual(r.json, { ok: true });
    assert.equal(ctx.transporter.sent.length, 2);
    const [internal, thanks] = ctx.transporter.sent;
    assert.equal(thanks.to, 'marta@z.co');
    assert.equal(internal.replyTo, 'marta@z.co');
    assert.match(internal.subject, /Zeta SA/);
    assert.ok(internal.html.includes('Zeta SA'));
    assert.ok(internal.text.includes('whatsapp_business, email'));
    assert.ok(thanks.html.includes('Gracias, Marta.'));
    assert.ok(thanks.html.includes('Zeta SA'));
    assert.match(thanks.html, /#WV-\d{6}-[0-9A-F]{4}/);

    const bad = await postJson(ctx.port, '/api/diagnostico', { answers: { contact_info: { email: 'a@b.co' } } });
    assert.equal(bad.status, 400);
    assert.equal(bad.json.error, 'Falta el nombre.');
  });

  test('rate limit -> 429', async () => {
    const c = await start({ rateLimitMax: 2 });
    for (let i = 0; i < 2; i++) assert.equal((await postJson(c.port, '/api/contacto', {})).status, 400);
    const r = await postJson(c.port, '/api/contacto', {});
    assert.equal(r.status, 429);
    assert.equal(r.json.ok, false);
    c.server.close();
  });

  test('IP en lista negra -> 403 y ningún correo', async () => {
    const c = await start({ rateLimitMax: 1000 });
    const r = await postJson(c.port, '/api/contacto', homeLead, { 'cf-connecting-ip': '80.94.95.202' });
    assert.equal(r.status, 403);
    assert.equal(r.json.ok, false);
    assert.equal(c.transporter.sent.length, 0, 'no debe enviar ni aviso ni acuse');

    const d = await postJson(c.port, '/api/diagnostico', {
      diagnostic_id: 'x', timestamp: '2026-11-28T12:00:00Z',
      answers: { contact_info: { name: 'Bot', email: 'bot@x.co' } },
    }, { 'cf-connecting-ip': '80.94.95.202' });
    assert.equal(d.status, 403);
    assert.equal(c.transporter.sent.length, 0);
    c.server.close();
  });

  test('BLOCKED_IPS define la lista y vacío la desactiva', async () => {
    const base = { MAIL_FROM: 'web@weavewp.com', MAIL_TO: 'a@x.com' };
    const c = await start({ rateLimitMax: 1000, env: { ...base, BLOCKED_IPS: '198.51.100.9' } });
    assert.equal((await postJson(c.port, '/api/contacto', homeLead, { 'cf-connecting-ip': '198.51.100.9' })).status, 403);
    assert.equal(c.transporter.sent.length, 0);
    // La IP por defecto deja de estar bloqueada en cuanto BLOCKED_IPS la sustituye.
    assert.equal((await postJson(c.port, '/api/contacto', homeLead, { 'cf-connecting-ip': '80.94.95.202' })).status, 200);
    c.server.close();

    const off = await start({ rateLimitMax: 1000, env: { ...base, BLOCKED_IPS: '' } });
    assert.equal((await postJson(off.port, '/api/contacto', homeLead, { 'cf-connecting-ip': '80.94.95.202' })).status, 200);
    off.server.close();
  });
});
