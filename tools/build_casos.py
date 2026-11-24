# -*- coding: utf-8 -*-
"""Genera las páginas de detalle de proyecto (single page) con el estilo de Weaves.

Salida: /home/nexus/workspace/weaves-premium-web/pages/caso-<slug>.html
Contenido: solo hechos del material de Multica ya revisado. Sin cifras inventadas.
"""
import io
import os

ROOT = "/home/nexus/workspace/weaves-premium-web"

NAV = """<div id="header-placeholder">
<nav id="nav">
  <div class="nav-left">
    <a href="/" class="nav-logo">
      <img class="nav-logo-image" src="/images/logo-weaves-on-dark.png?v=20260825-3" alt="Weaves">
    </a>
    <ul class="nav-links">
      <li><a href="/index.html">Inicio</a></li>
      <li><a href="/servicios/index.html">Qué hacemos</a></li>
      <li><a href="/sectores/index.html">Sectores</a></li>
      <li><a href="/pages/casos-exito.html" class="active" aria-current="page">Casos</a></li>
      <li><a href="/pages/quienes-somos.html">Quiénes Somos</a></li>
      <li><a href="/pages/blog.html">Blog</a></li>
      <li><a href="/pages/contacto.html">Contacto</a></li>
      <li class="nav-mobile-only"><a href="/pages/diagnostico-gratuito.html">Analizar mi proceso</a></li>
    </ul>
  </div>
  <div class="nav-right">
    <a href="/pages/diagnostico-gratuito.html" class="nav-cta">Analizar mi proceso</a>
    <button class="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
</div>"""

FOOTER = """<div id="footer-placeholder">
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand-block">
        <div class="footer-logo-row"><img class="footer-logo-image" src="/images/logo-weaves-on-dark.png?v=20260825-3" alt="Weaves"></div>
        <p class="footer-blurb">Ampliamos la capacidad de tu equipo reduciendo la carga repetitiva, con IA, automatización y supervisión humana.</p>
      </div>
      <div><div class="footer-col-title">Por qué Weaves</div><ul class="footer-links"><li><a href="/pages/quienes-somos.html">Sobre nosotros</a></li><li><a href="/pages/casos-exito.html">Nuestros clientes</a></li><li><a href="/pages/contacto.html">Contacto</a></li></ul></div>
      <div><div class="footer-col-title">Operaciones</div><ul class="footer-links"><li><a href="/servicios/servicio.html?id=chatbot">Atención y comunicación</a></li><li><a href="/servicios/servicio.html?id=embudo">Crecimiento y seguimiento</a></li><li><a href="/servicios/servicio.html?id=procesos">Administración y documentos</a></li><li><a href="/servicios/servicio.html?id=consultoria">Assessment y diseño</a></li><li><a href="/servicios/servicio.html?id=mantenimiento">Mejora continua</a></li></ul></div>
      <div><div class="footer-col-title">Recursos</div><ul class="footer-links"><li><a href="/pages/blog.html">Blog</a></li><li><a href="/pages/casos-exito.html">Casos de éxito</a></li><li><a href="/index.html#tecnologia">Tecnología</a></li></ul></div>
      <div><div class="footer-col-title">Legal</div><ul class="footer-links"><li><a href="/legal/politica-privacidad.html">Privacidad</a></li><li><a href="/legal/aviso-legal.html">Aviso legal</a></li><li><a href="/legal/politica-cookies.html">Cookies</a></li></ul></div>
    </div>
    <div class="footer-bottom"><div class="footer-copy">Weaves &copy; 2026 &middot; Todos los derechos reservados</div><div class="footer-legal-row"><a href="/">weavewp.com</a><span>España &middot; LatAm</span><span>ES</span></div></div>
  </div>
</footer>
</div>"""

CSS = """
/* ═══════════ FICHA DE PROYECTO ═══════════ */
.caso-hero { position: relative; background: var(--dark); color: #fff; padding: 150px 0 0; overflow: hidden; }
.caso-hero::before { content:''; position:absolute; inset:0;
  background: radial-gradient(ellipse 55% 60% at 80% 0%, rgba(0,180,166,0.16) 0%, transparent 62%),
              radial-gradient(ellipse 45% 55% at 10% 100%, rgba(124,92,255,0.13) 0%, transparent 60%); }
.caso-hero .inner { position: relative; z-index: 1; max-width: 1240px; margin: 0 auto; padding: 0 48px; }
.crumbs { font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.5); margin-bottom: 26px; }
.crumbs a { color: rgba(255,255,255,.65); text-decoration: none; }
.crumbs a:hover { color: var(--teal); }
.caso-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.caso-tag { font-family:'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase;
  padding: 7px 13px; border-radius: 999px; background: rgba(0,180,166,.14); color: #7FE7DC; border: 1px solid rgba(0,180,166,.28); }
.caso-hero h1 { font-family:'Space Grotesk', sans-serif; font-weight: 400; font-size: clamp(34px, 5.2vw, 68px);
  line-height: 1.05; letter-spacing: -.01em; max-width: 980px; }
.caso-hero h1 em { font-style: normal; color: var(--teal); }
.caso-hero .lead { margin-top: 26px; font-size: 18px; line-height: 1.6; color: rgba(255,255,255,.72); max-width: 700px; }
.caso-stack { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 34px; }
.caso-cliente { font-family: 'Space Grotesk', sans-serif; font-size: 15px; letter-spacing: .02em; color: #fff; }
.caso-cliente small { display:block; font-family:'JetBrains Mono', monospace; font-size: 9px; letter-spacing:.16em;
  text-transform: uppercase; color: rgba(255,255,255,.45); margin-bottom: 3px; }
.stack-sep { width: 1px; height: 26px; background: rgba(255,255,255,.18); }
.caso-techs { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; }
.caso-techs img { height: 20px; width: auto; opacity: .9; }
.caso-chip { font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .08em; text-transform: uppercase;
  color: rgba(255,255,255,.55); border: 1px solid rgba(255,255,255,.16); border-radius: 999px; padding: 5px 10px; }
.caso-cover { position: relative; z-index: 1; max-width: 1240px; margin: 52px auto 0; padding: 0 48px; }
.caso-cover img { width: 100%; height: 380px; object-fit: cover; border-radius: 18px 18px 0 0; display: block; }

.caso-body { max-width: 1240px; margin: 0 auto; padding: 0 48px 40px; }
.caso-ficha { display: grid; grid-template-columns: 1.05fr 1fr; gap: 28px; align-items: start; padding: 52px 0 0; }
.caso-dl { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 26px; background:#fff; border:1px solid var(--border);
  border-radius: 16px; padding: 28px; }
.caso-dl dt { font-family:'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing:.12em; text-transform: uppercase; color: #6B7280; }
.caso-dl dd { margin: 6px 0 0; font-size: 15px; font-weight: 500; color: var(--indigo); }
.caso-dl .wide { grid-column: span 2; }
.caso-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.caso-kpi { background:#fff; border:1px solid var(--border); border-radius: 16px; padding: 24px; }
.caso-kpi .n { font-family:'Space Grotesk', sans-serif; font-size: 40px; line-height: 1; color: var(--indigo); }
.caso-kpi .n small { font-size: 16px; color: var(--muted); margin-left: 4px; }
.caso-kpi p { margin: 10px 0 0; font-size: 13.5px; line-height: 1.5; color: var(--muted); }

.caso-sec { display: grid; grid-template-columns: 300px 1fr; gap: 48px; padding: 84px 0; border-top: 1px solid var(--border); }
.caso-sec:first-of-type { border-top: none; }
.caso-sec .label { font-family:'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing:.14em; text-transform: uppercase; color: var(--teal); }
.caso-sec h2 { font-family:'Space Grotesk', sans-serif; font-weight: 400; font-size: clamp(26px, 2.6vw, 38px); line-height: 1.12; color: var(--indigo); margin: 12px 0 0; }
.caso-sec h2 em { font-style: normal; color: var(--teal); }
.caso-sec .body p { font-size: 16px; line-height: 1.78; color: var(--muted); margin: 0 0 18px; }
.caso-sec ul { margin: 0; padding-left: 18px; color: var(--muted); font-size: 15.5px; line-height: 1.75; }

.caso-mods { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 22px; margin-top: 6px; }
.caso-mod { border-top: 2px solid var(--teal); padding-top: 14px; }
.caso-mod h3 { font-family:'Space Grotesk', sans-serif; font-size: 16px; font-weight: 500; color: var(--indigo); margin: 0 0 6px; }
.caso-mod p { font-size: 14.5px; line-height: 1.6; color: var(--muted); margin: 0; }

.caso-flow { display: flex; flex-wrap: wrap; align-items: stretch; gap: 10px; margin-top: 34px; }
.caso-flow .step { flex: 1 1 150px; background: var(--offwhite); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; font-size: 13.5px; color: var(--muted); }
.caso-flow .step b { display: block; font-family:'Space Grotesk', sans-serif; font-weight: 500; color: var(--indigo); font-size: 14px; margin-bottom: 3px; }
.caso-flow .arrow { align-self: center; color: var(--teal); font-size: 20px; margin: 0 4px; }
.caso-flow .step { min-width: 140px; }

.caso-table { width: 100%; border-collapse: collapse; font-size: 15px; margin-top: 8px; }
.caso-table th, .caso-table td { text-align: left; padding: 14px 16px; border-bottom: 1px solid var(--border); }
.caso-table th { font-family:'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing:.12em; text-transform: uppercase; color: #6B7280; }
.caso-table td:first-child { color: var(--indigo); font-weight: 500; }
.caso-nota { margin-top: 22px; font-size: 13.5px; line-height: 1.6; color: var(--muted); border-left: 2px solid var(--amber); padding-left: 14px; }

.caso-rel { padding: 72px 0 96px; border-top: 1px solid var(--border); }
.caso-rel h2 { font-family:'Space Grotesk', sans-serif; font-weight: 400; font-size: 28px; color: var(--indigo); margin: 0 0 24px; }
.caso-rel-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 20px; }
.caso-rel a { display: block; text-decoration: none; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; background:#fff; transition: transform .3s, box-shadow .3s; }
.caso-rel a:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(21,30,55,.10); }
.caso-rel img { width: 100%; height: 150px; object-fit: cover; display: block; }
.caso-rel .txt { padding: 18px 20px; }
.caso-rel .sector { font-family:'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing:.12em; text-transform: uppercase; color: #0B6B63; }
.caso-rel .q { font-family:'Space Grotesk', sans-serif; font-size: 16px; line-height: 1.35; color: var(--indigo); margin-top: 8px; }

@media (max-width: 980px) {
  .caso-hero { padding-top: 120px; }
  .caso-hero .inner, .caso-cover, .caso-body { padding: 0 24px; }
  .caso-cover img { height: 220px; }
  .caso-ficha, .caso-kpis, .caso-sec, .caso-mods, .caso-rel-grid { grid-template-columns: 1fr; }
  .caso-sec { gap: 20px; padding: 56px 0; }
  .caso-dl { grid-template-columns: 1fr; }
  .caso-dl .wide { grid-column: span 1; }
}
</style>"""


def page(c):
    tags = "".join(f'<span class="caso-tag">{t}</span>' for t in c["tags"])
    piezas = []
    for t in c.get("tech", []):
        if t.startswith("label:"):
            piezas.append(f'<span class="caso-chip">{t[6:]}</span>')
        else:
            piezas.append(f'<img src="/assets/logos/{t}.svg" alt="{t}" width="24" height="24">')
    stack = "".join(piezas)
    ficha = "".join(
        f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in c["ficha"] if not k.startswith("_wide")
    )
    anchos = [v for k, v in c["ficha"] if k.startswith("_wide")]
    if anchos:
        ficha += "".join(f'<div class="wide"><dt>{v[0]}</dt><dd>{v[1]}</dd></div>' for v in anchos)
    kpis = "".join(
        f'<div class="caso-kpi"><div class="n">{n}<small>{u}</small></div><p>{d}</p></div>'
        for n, u, d in c["kpis"]
    )
    reto = "".join(f"<p>{p}</p>" for p in c["reto_p"])
    reto_li = "".join(f"<li>{x}</li>" for x in c["reto_li"])
    mods = "".join(f'<div class="caso-mod"><h3>{t}</h3><p>{d}</p></div>' for t, d in c["mods"])
    flow = ""
    for i, (t, d) in enumerate(c["flow"]):
        if i:
            flow += '<span class="arrow" aria-hidden="true">→</span>'
        flow += f'<div class="step"><b>{t}</b>{d}</div>'
    filas = "".join(
        f"<tr><td>{a}</td><td>{b}</td><td>{d}</td></tr>" for a, b, d in c["tabla"]
    )
    rel = "".join(
        f'<a href="{href}"><img src="{img}" alt="" loading="lazy"><div class="txt">'
        f'<div class="sector">{sector}</div><div class="q">{q}</div></div></a>'
        for href, img, sector, q in c["rel"]
    )

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{c['title']} | Weaves</title>
<meta name="description" content="{c['desc']}">
<meta property="og:title" content="{c['title']} | Weaves">
<meta property="og:description" content="{c['desc']}">
<meta property="og:type" content="article">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/styles.css?v=20261123-8">
<!-- Start cookieyes banner --> <script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/dc631879d65242ce24a26ab58c89d599/script.js"></script> <!-- End cookieyes banner -->
<style>{CSS}
</head>
<body>
{NAV}

<section class="caso-hero">
  <div class="inner">
    <div class="crumbs"><a href="/pages/casos-exito.html">Casos</a> / {c['crumbs']}</div>
    <div class="caso-tags">{tags}</div>
    <h1>{c['h1']}</h1>
    <p class="lead">{c['lead']}</p>
    <div class="caso-stack">
      <div class="caso-cliente"><small>Cliente</small>{c.get('client', c['ficha'][0][1])}</div>
      <span class="stack-sep"></span>
      <div class="caso-techs">{stack}</div>
    </div>
  </div>
  <div class="caso-cover"><img src="{c['cover']}" alt=""></div>
</section>

<div class="caso-body">
  <div class="caso-ficha">
    <dl class="caso-dl">{ficha}</dl>
    <div class="caso-kpis">{kpis}</div>
  </div>

  <section class="caso-sec">
    <div><div class="label">01 · El reto</div><h2>{c['reto_h']}</h2></div>
    <div class="body">{reto}{f'<ul>{reto_li}</ul>' if reto_li else ''}</div>
  </section>

  <section class="caso-sec">
    <div><div class="label">02 · Lo que montamos</div><h2>{c['sol_h']}</h2></div>
    <div class="body">
      <div class="caso-mods">{mods}</div>
      <div class="caso-flow">{flow}</div>
    </div>
  </section>

  <section class="caso-sec">
    <div><div class="label">03 · Estado y resultados</div><h2>{c['res_h']}</h2></div>
    <div class="body">
      <table class="caso-table">
        <thead><tr><th>Qué</th><th>Antes</th><th>Ahora</th></tr></thead>
        <tbody>{filas}</tbody>
      </table>
      <p class="caso-nota">{c['nota']}</p>
    </div>
  </section>

  <section class="caso-rel">
    <h2>Otros proyectos</h2>
    <div class="caso-rel-grid">{rel}</div>
  </section>
</div>

<!-- CONTACTO — CTA compartido -->
<div data-contact-form></div>
<script src="../js/contact-form.js?v=20261123-7"></script>
<script src="../js/contact-form-loader.js?v=20261123-7"></script>

{FOOTER}

<script src="../js/components-loader.js"></script>
<script>
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {{
  entries.forEach(e => {{ if (e.isIntersecting) {{ e.target.classList.add('visible'); obs.unobserve(e.target); }} }});
}}, {{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }});
reveals.forEach(el => obs.observe(el));
</script>
</body>
</html>
"""


CASOS = [
    {
        "slug": "spazio-bodywork",
        "title": "Spazio Bodywork: reservas propias para formación en tres ciudades",
        "desc": "Rediseño web, landings por curso y Spazio Booking, el plugin propio de reservas con cupos, recordatorios y modo evergreen.",
        "client": "Spazio Bodywork", "tech": ["n8n", "label:Web propia", "label:Spazio Booking"],
        "crumbs": "Formación y reservas",
        "tags": ["Web", "Reservas", "Automatización", "CRM"],
        "h1": "Reservas propias para formación<br>en <em>tres ciudades</em>.",
        "lead": "Una escuela de masaje californiano con convocatorias en Barcelona, Madrid y Mallorca necesitaba dejar de sostener cada curso a mano. Construimos su propio sistema de reservas.",
        "cover": "/assets/cases/card-formacion.webp",
        "ficha": [
            ("Cliente", "Spazio Bodywork"),
            ("Sector", "Formación y terapias"),
            ("Dónde", "Barcelona · Madrid · Mallorca"),
            ("Estado", "En producción, proyecto vivo"),
            ("_wide", ("Stack", "Web propia · Spazio Booking · n8n · CRM · email marketing")),
            ("_wide", ("Sitio", '<a href="https://spaziobodywork.com" target="_blank" rel="noopener">spaziobodywork.com</a>')),
        ],
        "kpis": [
            ("3", "", "ciudades con convocatorias activas sobre una misma base"),
            ("44", "de 52", "tareas del proyecto cerradas"),
            ("1", "", "plugin propio de reservas, en lugar de una herramienta alquilada"),
            ("20", "años", "de historia recogidos en su página de aniversario"),
        ],
        "reto_h": "Cada convocatoria se sostenía a mano",
        "reto_p": [
            "La escuela crecía por cursos y por fechas, no por un catálogo fijo: cada taller abría inscripción con su hora, su sala y su instructora. La web no estaba pensada para eso, y cada apertura obligaba a tocar páginas, revisar cupos y responder avisos uno a uno.",
            "A la vez, los formularios se habían multiplicado y el seguimiento vivía en el correo. La pregunta no era qué herramienta añadir, sino quién llevaba el control cuando había tres cursos abiertos en tres ciudades.",
        ],
        "reto_li": [
            "Web rígida para un negocio que cambia de fechas cada mes.",
            "Cupos y recordatorios gestionados a mano.",
            "Formularios duplicados y avisos dispersos.",
        ],
        "sol_h": "Una base común para todas las convocatorias",
        "mods": [
            ("Web por curso y por fecha", "Landings específicas para cada taller y cada ciudad, más la página del 20.º aniversario."),
            ("Spazio Booking", "Plugin propio de reservas: cupos, recordatorios, correos transaccionales y modo evergreen para vender cursos sin fecha."),
            ("Formularios y CRM", "Formularios simplificados conectados a un CRM, para que cada inscripción llegue etiquetada y con su origen."),
            ("Automatización y email", "Automatizaciones con n8n y campañas de email marketing sobre la misma base de contactos."),
        ],
        "flow": [
            ("Entrada", "Web o landing del curso"),
            ("Reserva", "Spazio Booking con cupo real"),
            ("Confirmación", "Correo transaccional"),
            ("Recordatorio", "Aviso automático antes de la fecha"),
            ("Seguimiento", "CRM y campañas de email"),
        ],
        "res_h": "Qué cambió y qué falta por medir",
        "tabla": [
            ("Publicar un curso", "Página a mano por convocatoria", "Landing por curso y fecha sobre una base común"),
            ("Cupos", "Control manual", "Gestionados por Spazio Booking"),
            ("Recordatorios", "Avisos uno a uno", "Automáticos, con correo transaccional"),
            ("Cursos sin fecha", "No se podían vender", "Modo evergreen activo"),
            ("Reservas, alumnos e ingresos", "Sin medir", "Sin medir todavía"),
        ],
        "nota": "Los volúmenes de operación no son resultados de negocio. Lo que no podemos medir, no lo publicamos.",
        "rel": [
            ("/pages/caso-chusa.html", "/assets/cases/card-marca.webp", "Marca personal · Venta directa",
             "¿Cómo convertir una marca personal en un recorrido que vende sin intervención manual?"),
            ("/pages/caso-empieza-de-cero.html", "/assets/cases/card-cobros.webp", "Formación · Cobros",
             "¿Cómo perseguir 300 cobros al mes sin que se coma la operación del equipo?"),
        ],
    },
    {
        "slug": "chusa",
        "title": "Chusa Fernández: web nueva, diagnóstico automatizado y cobro directo",
        "desc": "Proyecto cerrado de punta a punta: análisis, identidad, ocho páginas, pago con Stripe, captura de correo y agenda.",
        "client": "Chusa Fernández", "tech": ["stripe", "calendly", "label:Payload"],
        "crumbs": "Marca personal",
        "tags": ["Web", "Identidad", "E-commerce", "Automatización"],
        "h1": "Web nueva, diagnóstico automatizado<br>y <em>cobro directo</em>.",
        "lead": "Una formadora con método propio necesitaba ordenar su oferta y que el recorrido desde el primer clic hasta la compra no dependiera de ella.",
        "cover": "/assets/cases/card-marca.webp",
        "ficha": [
            ("Cliente", "Chusa Fernández"),
            ("Sector", "Formación y mentorías"),
            ("Dónde", "España"),
            ("Estado", "Proyecto cerrado y entregado"),
            ("_wide", ("Stack", "Payload CMS · Stripe · Calendly · captura de correo")),
            ("_wide", ("Sitio", '<a href="https://chusafernandez.com" target="_blank" rel="noopener">chusafernandez.com</a>')),
        ],
        "kpis": [
            ("33", "de 33", "tareas del proyecto cerradas"),
            ("8", "páginas", "de copy redactado y maquetado"),
            ("10", "preguntas", "tiene el diagnóstico que abre el recorrido"),
            ("1", "", "recorrido: diagnóstico, correo, compra o cita"),
        ],
        "reto_h": "Una web que no acompañaba a la oferta",
        "reto_p": [
            "La web anterior no explicaba bien lo que se vende: método propio, formación y mentorías convivían sin jerarquía, y el visitante tenía que escribir para entender el siguiente paso.",
            "Todo el recorrido dependía de ella: responder, enviar precios, agendar y cobrar. El objetivo no era tener una web bonita, sino que el sistema atendiera la primera parte sola.",
        ],
        "reto_li": [
            "Oferta desordenada en la web anterior.",
            "Sin camino claro del interés a la compra.",
            "Cada paso, gestionado a mano.",
        ],
        "sol_h": "Del brief a la venta, en un solo recorrido",
        "mods": [
            ("Análisis y brief", "Auditoría de la web anterior, sitemap y brief antes de escribir una línea."),
            ("Identidad y copy", "Identidad visual y copy de 8 páginas alineados con el método."),
            ("Web y CMS", "Sitio sobre Payload, editable sin tocar código."),
            ("Pago y agenda", "Stripe para el infoproducto, Calendly para mentorías y captura de correo."),
        ],
        "flow": [
            ("Diagnóstico", "10 preguntas como puerta de entrada"),
            ("Correo", "Captura y entrega del resultado"),
            ("Decisión", "Infoproducto o mentoría"),
            ("Compra", "Stripe, pago directo"),
            ("Cita", "Calendly, sin gestión manual"),
        ],
        "res_h": "Qué cambió y qué falta por medir",
        "tabla": [
            ("Recorrido de entrada", "Formulario genérico", "Diagnóstico de 10 preguntas"),
            ("Compra del infoproducto", "Gestión manual", "Stripe, pago directo"),
            ("Agenda de mentorías", "Por correo", "Calendly conectado"),
            ("Edición del sitio", "Dependía del estudio", "CMS Payload"),
            ("Ventas, leads y conversión", "Sin medir", "Sin medir todavía"),
        ],
        "nota": "El proyecto se cerró completo; los números de negocio son del cliente y no nos constan. Lo que no podemos medir, no lo publicamos.",
        "rel": [
            ("/pages/caso-spazio-bodywork.html", "/assets/cases/card-formacion.webp", "Formación · Reservas",
             "¿Cómo vender formación en tres ciudades sin perder el control de los cupos?"),
            ("/pages/caso-empieza-de-cero.html", "/assets/cases/card-cobros.webp", "Formación · Cobros",
             "¿Cómo perseguir 300 cobros al mes sin que se coma la operación del equipo?"),
        ],
    },
    {
        "slug": "empieza-de-cero",
        "title": "Empieza de Cero: captación multicanal, contratos y recobro ordenado",
        "desc": "Embudo en HubSpot para cuatro canales, email en Mautic, firma en Documenso y recobro por WhatsApp sobre 301 fichas.",
        "client": "Empieza de Cero", "tech": ["hubspot", "mautic", "whatsapp", "label:Documenso", "label:Kommo"],
        "crumbs": "Formación con pagos por cuotas",
        "tags": ["Captación", "CRM", "Contratos", "Recobro"],
        "h1": "Captación multicanal, contratos<br>y <em>recobro ordenado</em>.",
        "lead": "Empieza de Cero es una empresa de formación con alumnos que pagan por cuotas. Más de 300 fichas en gestión de cobro, y el seguimiento y el recobro llevados a mano.",
        "cover": "/assets/cases/card-cobros.webp",
        "ficha": [
            ("Cliente", "Empieza de Cero"),
            ("Sector", "Formación con pagos por cuotas"),
            ("Dónde", "España"),
            ("Estado", "Sistemas desplegados y operación ejecutada"),
            ("_wide", ("Stack", "HubSpot · Mautic · Documenso · Kommo · WhatsApp")),
            ("_wide", ("Sitio", "Sin web pública: la operación vive en el CRM y en el panel interno")),
        ],
        "kpis": [
            ("4", "canales", "unificados en un solo embudo con SLA"),
            ("301", "fichas", "en la primera tanda de recobro por WhatsApp"),
            ("123", "fichas", "en la segunda pasada, sobre las que no respondieron"),
            ("5", "difusiones", "ejecutadas dentro del protocolo de recobro"),
        ],
        "reto_h": "Cuatro canales, ninguna trazabilidad",
        "reto_p": [
            "La captación se repartía entre WhatsApp, correo, redes y el formulario de la web. Cada canal tenía su ritmo y nadie podía decir cuánto tardaba en responderse un lead ni cuál acababa en matrícula.",
            "En paralelo, el alta del alumno y el recobro dependían de personas concretas: contratos firmados por correo, cuotas perseguidas una a una y sin un protocolo escrito que aguantara vacaciones.",
        ],
        "reto_li": [
            "Sin SLA por canal ni alertas de respuesta.",
            "Contratos fuera del flujo de alta.",
            "Recobro sin protocolo ni panel de seguimiento.",
        ],
        "sol_h": "Un embudo, una firma y un protocolo",
        "mods": [
            ("Embudo en HubSpot", "Los cuatro canales en un solo flujo, con SLA por canal y alertas cuando un lead se enfría."),
            ("Email en Mautic", "Secuencias documentadas: dos envíos ejecutados y un tercero preparado."),
            ("Documenso", "Contratos y firma integrados en el alta del alumno, con marca propia del cliente."),
            ("Recobro en Kommo", "Protocolo, panel operativo y difusiones por WhatsApp sobre las fichas pendientes."),
        ],
        "flow": [
            ("Entrada", "WhatsApp · email · redes · formulario"),
            ("SLA", "Alerta si no hay respuesta"),
            ("Alta", "Contrato firmado en Documenso"),
            ("Cuota", "Seguimiento en el panel"),
            ("Recobro", "Difusión por WhatsApp con protocolo"),
        ],
        "res_h": "Qué cambió y qué falta por medir",
        "tabla": [
            ("Seguimiento de leads", "Manual, por canal", "Embudo único con SLA y alertas"),
            ("Contratos", "Correo suelto", "Firma integrada en el alta"),
            ("Recobro", "Caso a caso", "Protocolo con panel y 5 difusiones"),
            ("Volumen gestionado", "Sin registro", "301 fichas y 123 en la segunda pasada"),
            ("Importe recuperado", "Sin medir", "Sin medir todavía"),
        ],
        "nota": "Los volúmenes son de operación, no de resultado económico. Lo que no podemos medir, no lo publicamos.",
        "rel": [
            ("/pages/caso-spazio-bodywork.html", "/assets/cases/card-formacion.webp", "Formación · Reservas",
             "¿Cómo vender formación en tres ciudades sin perder el control de los cupos?"),
            ("/pages/caso-chusa.html", "/assets/cases/card-marca.webp", "Marca personal · Venta directa",
             "¿Cómo convertir una marca personal en un recorrido que vende sin intervención manual?"),
        ],
    },
    {
        "slug": "iswift",
        "title": "iSwift Solutions: blog integrado en WordPress y publicación sin fricción",
        "desc": "Blog dentro del sitio, comentarios unificados, antispam y publicación asistida desde el editor.",
        "client": "iSwift Solutions", "tech": ["wordpress", "label:MCP de Claude"],
        "crumbs": "Servicios B2B",
        "tags": ["Web", "WordPress", "Blog", "Antispam"],
        "h1": "Blog integrado en WordPress<br>y <em>publicación sin fricción</em>.",
        "lead": "La web ya existía. El trabajo fue que el blog dejara de ser un añadido: listado, artículo, comentarios y publicación desde el propio editor.",
        "cover": "/assets/cases/card-iswift.webp",
        "ficha": [
            ("Cliente", "iSwift Solutions"),
            ("Sector", "Servicios B2B"),
            ("Dónde", "España"),
            ("Estado", "En producción"),
            ("_wide", ("Stack", "WordPress · MCP de Claude · antispam")),
            ("_wide", ("Sitio", '<a href="https://iswiftsolutions.com" target="_blank" rel="noopener">iswiftsolutions.com</a>')),
        ],
        "kpis": [
            ("8", "de 8", "tareas del encargo cerradas"),
            ("4", "piezas", "listado, artículo, comentarios y entrada en el menú"),
            ("1", "", "componente único de comentarios en todo el sitio"),
            ("0", "plantillas", "duplicadas para el mismo bloque"),
        ],
        "reto_h": "Un blog que vivía fuera del sitio",
        "reto_p": [
            "El blog no formaba parte del recorrido: no estaba en el menú, el listado y el artículo se maquetaban aparte y los comentarios se repetían en varias plantillas. Cada ajuste había que hacerlo dos veces.",
            "A eso se sumaba el spam en los formularios y la dependencia de alguien con acceso al código para publicar o cambiar una sección.",
        ],
        "reto_li": [
            "Blog ausente del menú y del diseño general.",
            "Comentarios duplicados por plantilla.",
            "Publicación y ajustes atados al código.",
        ],
        "sol_h": "El blog como parte del sitio, no como un parche",
        "mods": [
            ("Listado y artículo", "Página principal del blog y ficha de artículo con el mismo lenguaje visual del resto."),
            ("Comentarios", "Un único componente reutilizado en todo el sitio."),
            ("Antispam", "Revisión de captcha y honeypots en los formularios."),
            ("Publicación asistida", "Conexión de Claude a WordPress por MCP para trabajar desde el editor."),
        ],
        "flow": [
            ("Editor", "Claude con MCP"),
            ("WordPress", "Contenido publicado"),
            ("Listado", "Blog en el menú"),
            ("Artículo", "Ficha con comentarios"),
        ],
        "res_h": "Qué cambió y qué falta por medir",
        "tabla": [
            ("Blog en el sitio", "Fuera del menú", "Integrado en el recorrido"),
            ("Comentarios", "Repetidos por plantilla", "Un solo componente"),
            ("Formularios", "Spam sin control", "Captcha y honeypots revisados"),
            ("Publicar", "Dependía del código", "Desde el editor, con MCP"),
            ("Tráfico y leads", "Sin medir", "Sin medir todavía"),
        ],
        "nota": "Los volúmenes de operación no son resultados de negocio. Lo que no podemos medir, no lo publicamos.",
        "rel": [
            ("/pages/caso-chusa.html", "/assets/cases/card-marca.webp", "Marca personal · Venta directa",
             "¿Cómo convertir una marca personal en un recorrido que vende sin intervención manual?"),
            ("/pages/caso-spazio-bodywork.html", "/assets/cases/card-formacion.webp", "Formación · Reservas",
             "¿Cómo vender formación en tres ciudades sin perder el control de los cupos?"),
        ],
    },
    {
        "slug": "divine-light",
        "title": "Divine Light: marca, web bilingüe y una plataforma en camino",
        "desc": "Identidad, sistema de diseño y nueve páginas en español e inglés antes de vender la primera formación.",
        "client": "Divine Light", "tech": ["label:Sistema de diseño", "label:Web bilingüe ES/EN"],
        "crumbs": "Formación y bienestar",
        "tags": ["Marca", "Web bilingüe", "Diseño", "Producto digital"],
        "h1": "Marca, web bilingüe<br>y una <em>plataforma en camino</em>.",
        "lead": "Un proyecto de marca personal que necesitaba identidad, sistema de diseño y una web en dos idiomas antes de vender su primera formación.",
        "cover": "/assets/cases/card-divine.webp",
        "ficha": [
            ("Cliente", "Divine Light"),
            ("Sector", "Formación y bienestar"),
            ("Dónde", "España · online"),
            ("Estado", "Web en producción, plataforma en construcción"),
            ("_wide", ("Stack", "Web bilingüe ES/EN · sistema de diseño · CMS")),
            ("_wide", ("Sitio", '<a href="https://zuzelamelia.com" target="_blank" rel="noopener">zuzelamelia.com</a>')),
        ],
        "kpis": [
            ("9", "páginas", "en español e inglés con la paleta nueva"),
            ("19", "de 21", "tareas de la web cerradas"),
            ("2", "idiomas", "sobre el mismo sistema de diseño"),
            ("1", "", "sistema de tokens como base de todo lo que venga"),
        ],
        "reto_h": "Una marca sin sistema y dos idiomas por delante",
        "reto_p": [
            "Antes de vender nada había que decidir cómo se ve la marca: logotipo, paleta, tipografía y el tono de cada página. Sin eso, cada pieza nueva se inventaba desde cero.",
            "La web tenía que salir en español e inglés a la vez, y dejar preparado el terreno para una plataforma de cursos que venía después.",
        ],
        "reto_li": [
            "Identidad sin definir.",
            "Dos idiomas sobre el mismo contenido.",
            "Plataforma de cursos aún por construir.",
        ],
        "sol_h": "Primero el sistema, después las páginas",
        "mods": [
            ("Identidad", "Logotipo minimalista y paleta cálida: papel, calipso y arena."),
            ("Sistema de diseño", "Tokens y reglas tipográficas documentadas como base de todo el producto."),
            ("Web bilingüe", "Nueve páginas en español e inglés con el mismo esqueleto."),
            ("Plataforma de cursos", "MVP en construcción: brief de producto, arquitectura, componentes y backend."),
        ],
        "flow": [
            ("Marca", "Logotipo y paleta"),
            ("Sistema", "Tokens y tipografía"),
            ("Web", "9 páginas ES/EN"),
            ("Contenido", "Cursos y eventos"),
            ("Plataforma", "MVP en construcción"),
        ],
        "res_h": "Qué cambió y qué falta por medir",
        "tabla": [
            ("Marca", "Sin definir", "Logotipo y paleta aplicados"),
            ("Diseño", "Cada página a mano", "Sistema de tokens"),
            ("Idiomas", "Solo español", "Español e inglés en paralelo"),
            ("Plataforma", "No existía", "MVP en construcción (8 de 18)"),
            ("Ventas y alumnos", "Sin medir", "Sin medir todavía"),
        ],
        "nota": "La web está en producción; la plataforma sigue en construcción y se publicará cuando esté cerrada. Lo que no podemos medir, no lo publicamos.",
        "rel": [
            ("/pages/caso-chusa.html", "/assets/cases/card-marca.webp", "Marca personal · Venta directa",
             "¿Cómo convertir una marca personal en un recorrido que vende sin intervención manual?"),
            ("/pages/caso-iswift.html", "/assets/cases/card-iswift.webp", "Servicios B2B",
             "¿Cómo integrar un blog en el sitio sin depender de nadie para publicar?"),
        ],
    },
    {
        "slug": "ananta",
        "title": "Ananta: Chatwoot propio y sistema de notificaciones",
        "desc": "Implentación de Chatwoot y un sistema de notificaciones para una empresa de seguridad privada.",
        "client": "Ananta Seguridad",
        "tech": ["chatwoot", "whatsapp", "label:Supabase"],
        "crumbs": "Seguridad privada",
        "tags": ["Infraestructura", "Atención", "Notificaciones"],
        "h1": "Chatwoot propio y notificaciones<br>para una empresa de <em>seguridad</em>.",
        "lead": "Ananta necesitaba atender por WhatsApp con un sistema propio y avisar de lo que importa sin depender de que alguien se acuerde.",
        "cover": "/assets/cases/card-ananta.webp",
        "ficha": [
            ("Cliente", "Ananta Seguridad"),
            ("Sector", "Seguridad privada"),
            ("Dónde", "Alicante, España"),
            ("Estado", "Entregado"),
            ("_wide", ("Stack", "Chatwoot · WhatsApp · Supabase · notificaciones")),
            ("_wide", ("Alcance", "Infraestructura de atención y capa de avisos sobre la base de datos")),
        ],
        "kpis": [
            ("1", "", "instancia de Chatwoot propia, no un plan compartido"),
            ("2", "fases", "Chatwoot entregado; capa de IA en definición"),
            ("3", "canales", "de aviso sobre la misma base de datos"),
            ("0", "", "tareas de atención que dependen de la memoria de alguien"),
        ],
        "reto_h": "Atender y avisar sin sistema propio",
        "reto_p": [
            "La conversación con clientes vivía en WhatsApp sin bandeja común: cada persona veía su parte y nadie tenía la conversación completa cuando hacía falta.",
            "Los avisos dependían de que alguien se acordara o de hilos de correo. En una empresa de seguridad, un aviso que no llega no es una molestia: es un riesgo.",
        ],
        "reto_li": [
            "WhatsApp sin bandeja compartida.",
            "Avisos manuales y sin registro.",
            "Sin base de datos propia sobre la que automatizar.",
        ],
        "sol_h": "Una bandeja propia y una capa de avisos",
        "mods": [
            ("Chatwoot desplegado", "Instancia propia para todo el equipo, con la conversación completa en un solo sitio."),
            ("WhatsApp conectado", "El canal que ya usaban, dentro de la bandeja."),
            ("Base de datos", "Supabase como base sobre la que viven contactos, conversaciones y avisos."),
            ("Sistema de notificaciones", "Avisos automáticos a partir de eventos, sin depender de que alguien lo recuerde."),
        ],
        "flow": [
            ("Cliente", "Escribe por WhatsApp"),
            ("Chatwoot", "Bandeja compartida"),
            ("Equipo", "Responde con contexto"),
            ("Evento", "Se registra en la base"),
            ("Aviso", "Notificación automática"),
        ],
        "res_h": "Qué cambió y qué falta por medir",
        "tabla": [
            ("Conversaciones", "Repartidas por teléfonos", "Una bandeja compartida"),
            ("Contexto", "Dependía de quién atendiera", "Historial completo en Chatwoot"),
            ("Avisos", "Manuales", "Disparados por eventos"),
            ("Datos", "En el móvil de cada uno", "Base propia en Supabase"),
            ("Tiempos de respuesta", "Sin medir", "Sin medir todavía"),
        ],
        "nota": "Los volúmenes de operación no son resultados de negocio. Lo que no podemos medir, no lo publicamos.",
        "rel": [
            ("/pages/caso-empieza-de-cero.html", "/assets/cases/card-cobros.webp", "Formación · Cobros",
             "¿Cómo perseguir 300 cobros al mes sin que se coma la operación del equipo?"),
            ("/pages/caso-spazio-bodywork.html", "/assets/cases/card-formacion.webp", "Formación · Reservas",
             "¿Cómo vender formación en tres ciudades sin perder el control de los cupos?"),
        ],
    },
    {
        "slug": "stellamia",
        "title": "Stellamia: un libro impreso por pedido, generado sin intervención manual",
        "desc": "Automatización completa del libro personalizado: de los datos del nacimiento al PDF de 55 páginas listo para imprenta, en alemán.",
        "client": "Stellamia",
        "tech": ["n8n", "label:Gotenberg", "label:MinIO", "label:Impresión en Alemania"],
        "crumbs": "Editorial personalizada",
        "tags": ["Automatización", "PDF", "Impresión", "Producto digital"],
        "h1": "Un libro impreso por pedido,<br><em>sin que nadie lo maquete</em>.",
        "lead": "Stellamia vende libros personalizados en Alemania. Cada pedido genera su propio PDF de 55 páginas, con los datos del niño y la carta natal ya dentro, listo para imprenta.",
        "cover": "/assets/cases/card-stellamia.webp",
        "ficha": [
            ("Cliente", "Stellamia"),
            ("Sector", "Editorial personalizada · regalo de nacimiento"),
            ("Dónde", "Alemania"),
            ("Estado", "En producción, más de 290 libros generados"),
            ("_wide", ("Stack", "n8n · Gotenberg · MinIO · plantillas HTML")),
            ("_wide", ("Sitio", '<a href="https://stellamia.eu" target="_blank" rel="noopener">stellamia.eu</a>')),
        ],
        "kpis": [
            ("55", "páginas", "por libro, A5 con sangrado de 3 mm"),
            ("290+", "", "libros generados con el flujo actual"),
            ("10", "plantillas", "HTML cubren todo el interior, página a página"),
            ("0", "minutos", "de maquetación manual por pedido"),
        ],
        "reto_h": "Cada libro es distinto y la imprenta no espera",
        "reto_p": [
            "Un libro personalizado cambia en cada pedido: nombre, fecha, hora y ciudad de nacimiento, y con ellos la carta natal, los textos y hasta el lomo de la cubierta. Maquetar eso a mano no escala más allá de unos pocos libros a la semana.",
            "La imprenta, además, no acepta un borrador: pide un PDF con sangrado, fuentes incrustadas y la cubierta montada con su lomo. El trabajo no era escribir mejor, sino que el archivo saliera bien la primera vez.",
        ],
        "reto_li": [
            "Contenido distinto en cada pedido.",
            "Maquetación manual imposible de escalar.",
            "Requisitos de imprenta estrictos: sangrado, fuentes, lomo.",
        ],
        "sol_h": "Del dato del nacimiento al archivo de imprenta",
        "mods": [
            ("Flujo en n8n", "Un flujo de 58 nodos recibe el pedido y encadena texto, maquetación y montaje del PDF."),
            ("Plantillas HTML", "Diez plantillas cubren el interior página a página; los datos del niño entran como variables."),
            ("Gotenberg y MinIO", "El HTML se convierte en PDF y las partes se guardan y se unen en el almacenamiento del proyecto."),
            ("Cubierta y cierre", "La cubierta se genera con su lomo y las últimas páginas viven en un estático que se reutiliza en todos los pedidos."),
        ],
        "flow": [
            ("Pedido", "Datos del nacimiento"),
            ("Texto", "Contenido del libro"),
            ("Maqueta", "Plantillas HTML"),
            ("PDF", "Gotenberg, A5 + sangrado"),
            ("Imprenta", "Archivo final por pedido"),
        ],
        "res_h": "Qué cambió y qué falta por medir",
        "tabla": [
            ("Maquetar un libro", "A mano, uno a uno", "Automático por pedido"),
            ("Contenido", "Se escribía por libro", "Se compone desde los datos"),
            ("Cubierta", "Se montaba aparte", "Generada con lomo incluido"),
            ("Campañas", "Libro nuevo desde cero", "Flujo duplicado y adaptado"),
            ("Ventas y devoluciones", "Sin medir", "Sin medir todavía"),
        ],
        "nota": "Lo que publicamos es el volumen de producción y que el archivo sale listo para imprenta. Los números de venta son del cliente y no nos constan.",
        "rel": [
            ("/pages/caso-divine-light.html", "/assets/cases/card-divine.webp", "Marca · Web bilingüe",
             "¿Cómo construir una marca que funcione en dos idiomas desde el primer día?"),
            ("/pages/caso-ananta.html", "/assets/cases/card-ananta.webp", "Seguridad · Atención",
             "¿Cómo atender por WhatsApp sin que la conversación viva en el móvil de cada uno?"),
        ],
    },
]

for c in CASOS:
    out = os.path.join(ROOT, "pages", f"caso-{c['slug']}.html")
    io.open(out, "w", encoding="utf-8").write(page(c))
    print("escrito", out, os.path.getsize(out), "bytes")
