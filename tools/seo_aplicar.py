#!/usr/bin/env python3
"""Aplica metadatos SEO y tarjetas de compartir a las páginas de weavewp.com.

Fuente única de verdad de title/description/OG por página. Idempotente: se puede
ejecutar tantas veces como haga falta; reescribe el bloque seo entre marcadores.

    python3 tools/seo_aplicar.py            # aplica y regenera sitemap
    python3 tools/seo_aplicar.py --og       # además genera las imágenes 1200x630
"""
import os, re, sys, html, datetime
sys.dont_write_bytecode = True

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOM = os.environ.get("WEAVES_DOMAIN", "https://weavewp.com")
HOY = datetime.date.today().isoformat()
OG_DIR = "images/og"

# path -> (title, description, kicker OG, titular OG, prioridad, imagen OG)
P = {
 "index.html": (
   "Weaves | Automatización con IA y operaciones gestionadas",
   "Gestionamos la atención al cliente, el seguimiento comercial y la administración repetitiva con IA. Tu equipo recupera capacidad sin ampliar plantilla.",
   "Operaciones gestionadas con IA", "Más capacidad para tu equipo, y menos carga.", "1.0", None),

 "servicios/index.html": (
   "Servicios de automatización con IA para empresas | Weaves",
   "Atención al cliente, seguimiento comercial, administración e integraciones. Qué gestionamos, cómo se implanta y qué se mide antes de escalar.",
   "Servicios", "Automatización de procesos con IA para empresas.", "0.9", None),

 "sectores/index.html": (
   "Sectores: automatización por tipo de negocio | Weaves",
   "Tiendas online, clínicas, academias, despachos, restaurantes y proyectos digitales. Los problemas que se repiten y qué se puede automatizar.",
   "Sectores", "Sectores en los que trabajamos.", "0.9", None),

 "sectores/ecommerce.html": (
   "Automatización con IA para tiendas online | Weaves",
   "Automatización para tiendas online: consultas de pedidos, incidencias, devoluciones y comunicación con clientes conectadas a tu web y a tu gestión.",
   "Sector · Comercio electrónico", "Automatización e IA para vender más sin saturar al equipo.", "0.8", None),

 "sectores/educacion.html": (
   "Automatización con IA para academias y formación | Weaves",
   "Automatización para academias y centros de formación: inscripciones, pagos, recordatorios y comunicación con alumnos sin trabajo manual.",
   "Sector · Formación", "Más orden en alumnos, pagos y comunicación.", "0.8", None),

 "sectores/salud.html": (
   "Automatización con IA para clínicas y salud | Weaves",
   "Automatización para clínicas y centros de salud: citas, recordatorios, confirmaciones y seguimiento de pacientes sin saturar la recepción.",
   "Sector · Salud", "Menos carga administrativa en la consulta y en la recepción.", "0.8", None),

 "sectores/restauracion-turismo.html": (
   "Automatización con IA para restaurantes y turismo | Weaves",
   "Automatización para restaurantes, hoteles y turismo: reservas, consultas repetidas y coordinación con proveedores sin depender del teléfono.",
   "Sector · Restauración y turismo", "Reservas y consultas atendidas sin colapsar el servicio.", "0.8", None),

 "sectores/servicios-profesionales.html": (
   "Automatización con IA para despachos y consultoras | Weaves",
   "Automatización para despachos, asesorías y consultoras: expedientes, seguimiento de clientes y documentación sin tareas manuales repetidas.",
   "Sector · Servicios profesionales", "Menos carga operativa, sin crecer en estructura.", "0.8", None),

 "sectores/startups.html": (
   "Automatización con IA para startups digitales | Weaves",
   "Automatización para startups y proyectos digitales: menos operación manual desde el primer cliente, con procesos que aguantan el crecimiento.",
   "Sector · Startups", "Crecer sin montar un equipo de operaciones.", "0.8", None),

 "pages/casos-exito.html": (
   "Casos de éxito: proyectos entregados y estado real | Weaves",
   "Siete proyectos entregados: de dónde partía cada cliente, qué se construyó y en qué estado está hoy. Si un dato no está medido, lo decimos.",
   "Casos", "Proyectos entregados, con su estado real.", "0.9", None),

 "pages/quienes-somos.html": (
   "Quiénes somos: operaciones gestionadas con IA | Weaves",
   "Cómo trabajamos: procesos de atención, ventas y administración gestionados con IA, con trazabilidad y personas al mando de las excepciones.",
   "Quiénes somos", "Operaciones gestionadas con IA para ampliar tu capacidad.", "0.7", None),

 "pages/planes-precios.html": (
   "Planes e inversión en operaciones gestionadas | Weaves",
   "Qué incluye cada fase, cómo se calcula la inversión mensual y qué se puede añadir después. Sin paquetes cerrados ni tareas ilimitadas.",
   "Planos y precios", "Cómo se estructura la inversión.", "0.7", None),

 "pages/diagnostico-gratuito.html": (
   "Diagnóstico gratuito de un proceso de tu equipo | Weaves",
   "Revisamos volumen, fricción, sistemas y excepciones de un proceso y te decimos si tiene sentido automatizarlo. Gratuito y sin compromiso.",
   "Diagnóstico gratuito", "¿Qué proceso está quitando capacidad a tu equipo?", "0.7", None),

 "pages/contacto.html": (
   "Contacto: analizamos tu proceso operativo | Weaves",
   "Cuéntanos qué proceso frena a tu equipo. Respondemos con un diagnóstico concreto, sin propuestas genéricas ni presentaciones de producto.",
   "Contacto", "Hablemos de tus procesos, no de IA en abstracto.", "0.6", None),

 "pages/blog.html": (
   "Blog de automatización con IA para empresas | Weaves",
   "Guías prácticas, casos reales y automatizaciones explicadas paso a paso para empresas que quieren ordenar su operación sin sumar herramientas.",
   "Blog", "Inteligencia artificial aplicada.", "0.6", None),

 "pages/caso-spazio-bodywork.html": (
   "Spazio Bodywork: reservas propias para formación | Weaves",
   "Escuela de masaje con formación en Barcelona, Madrid y Mallorca. Web por curso y fecha, plugin propio de reservas y modo evergreen.",
   "Caso · Formación", "Reservas propias para formación en tres ciudades.", "0.8", "assets/cases/card-formacion.webp"),

 "pages/caso-chusa.html": (
   "Chusa Fernández: web nueva y venta directa | Weaves",
   "Marca personal de una formadora: identidad, ocho páginas en Payload, pago con Stripe, agenda en Calendly y diagnóstico de diez preguntas.",
   "Caso · Marca personal", "Web nueva, diagnóstico automatizado y cobro directo.", "0.8", "assets/cases/card-marca.webp"),

 "pages/caso-empieza-de-cero.html": (
   "Empieza de Cero: captación, contratos y recobro | Weaves",
   "Empresa de formación con más de 300 fichas en cobro: embudo en HubSpot con cuatro canales, contratos en Documenso y recobro por WhatsApp.",
   "Caso · Formación y cobros", "Captación multicanal, contratos y recobro ordenado.", "0.8", "assets/cases/card-cobros.webp"),

 "pages/caso-iswift.html": (
   "iSwift Solutions: blog integrado en WordPress | Weaves",
   "Blog integrado en un WordPress existente: listado, artículo, comentarios unificados, antispam y publicación desde el propio editor.",
   "Caso · Web y contenido", "Blog integrado en WordPress y publicación sin fricción.", "0.8", "assets/cases/card-iswift.webp"),

 "pages/caso-divine-light.html": (
   "Divine Light: marca, web bilingüe y plataforma | Weaves",
   "Marca personal antes de su primera formación: identidad, sistema de diseño y nueve páginas en español e inglés sobre el CMS del sitio.",
   "Caso · Marca y web", "Marca, web bilingüe y una plataforma en camino.", "0.8", "assets/cases/card-divine.webp"),

 "pages/caso-ananta.html": (
   "Ananta: Chatwoot propio y notificaciones | Weaves",
   "Empresa de seguridad privada: Chatwoot propio para atender por WhatsApp y una capa de avisos automáticos sobre los eventos que importan.",
   "Caso · Seguridad", "Chatwoot propio y notificaciones para una empresa de seguridad.", "0.8", "assets/cases/card-ananta.webp"),

 "pages/caso-stellamia.html": (
   "Stellamia: libro impreso por pedido, sin maquetar | Weaves",
   "Cada pedido genera un PDF de 55 páginas con los datos de nacimiento y la carta natal dentro, listo para imprenta y en alemán.",
   "Caso · Editorial", "Un libro impreso por pedido, sin que nadie lo maquete.", "0.8", "assets/cases/card-stellamia.webp"),

 "legal/aviso-legal.html": (
   "Aviso legal y datos del titular | Weaves",
   "Titularidad, condiciones de uso y responsabilidad del sitio getweaves.com. Datos del titular y vía de contacto para cualquier consulta legal.",
   "Legal", "Aviso legal.", "0.3", None),

 "legal/politica-privacidad.html": (
   "Política de privacidad y datos tratados | Weaves",
   "Qué datos tratamos, con qué base legal, durante cuánto tiempo y cómo ejercer tus derechos sobre ellos. Responsable y vías de contacto.",
   "Legal", "Política de privacidad.", "0.3", None),

 "legal/politica-cookies.html": (
   "Política de cookies de getweaves.com | Weaves",
   "Sin cookies de analítica ni de publicidad: medimos con una herramienta propia, sin identificadores. Qué se guarda y cómo cambiar tu decisión.",
   "Legal", "Política de cookies.", "0.3", None),
}

# El frontmatter del blog es la fuente de sus metadatos y del sitemap.
from build_blog import load_posts, seo_entries
P.update(seo_entries(load_posts()))

# páginas que no deben indexarse: plantillas con parámetros y stubs de redirección
NOINDEX = ["servicios/servicio.html", "sectores/sector.html"]
STUBS = ["servicios/bot.html"]

OG_DEFAULT = "images/og/default.jpg"


JSONLD_HOME_TMPL = """<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
 {"@type":"Organization","@id":"__DOM__/#org","name":"Weaves","url":"__DOM__/","logo":"__DOM__/images/logo-weaves-on-dark.png","email":"info@weavewp.com","areaServed":["ES","MX","CO","AR","CL"],"description":"Operaciones gestionadas con IA: atención al cliente, seguimiento comercial y administración."},
 {"@type":"WebSite","@id":"__DOM__/#site","url":"__DOM__/","name":"Weaves","inLanguage":"es","publisher":{"@id":"__DOM__/#org"}}
]}
</script>"""


def bloque_seo(path, meta):
    title, desc, kicker, ogt, _, _ = meta
    url = f"{DOM}/{path.replace('index.html', '')}"
    img = f"{DOM}/{OG_DEFAULT}" if path != "index.html" else f"{DOM}/{OG_DEFAULT}"
    og_slug = path.replace("/", "-").replace(".html", "")
    if os.path.exists(os.path.join(ROOT, OG_DIR, og_slug + ".jpg")):
        img = f"{DOM}/{OG_DIR}/{og_slug}.jpg"
    bloque = "\n".join([
        "<!-- seo -->",
        f'<meta name="description" content="{html.escape(desc, quote=True)}">',
        f'<link rel="canonical" href="{url}">',
        '<meta property="og:type" content="{}">'.format('article' if path.startswith('pages/blog/') else 'website'),
        f'<meta property="og:site_name" content="Weaves">',
        f'<meta property="og:locale" content="es_ES">',
        f'<meta property="og:title" content="{html.escape(title, quote=True)}">',
        f'<meta property="og:description" content="{html.escape(desc, quote=True)}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{img}">',
        f'<meta property="og:image:width" content="1200">',
        f'<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{html.escape(ogt, quote=True)}">',
        f'<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{html.escape(title, quote=True)}">',
        f'<meta name="twitter:description" content="{html.escape(desc, quote=True)}">',
        f'<meta name="twitter:image" content="{img}">',
    ])
    if path == "index.html":
        bloque += "\n" + JSONLD_HOME_TMPL.replace("__DOM__", DOM)
    return bloque + "\n<!-- /seo -->"


def limpiar_head(h):
    h = re.sub(r"<!-- seo -->.*?<!-- /seo -->\s*", "", h, flags=re.S)
    h = re.sub(r'<meta name="description"[^>]*>\s*', "", h)
    h = re.sub(r'<meta property="og:[^"]*"[^>]*>\s*', "", h)
    h = re.sub(r'<meta name="twitter:[^"]*"[^>]*>\s*', "", h)
    h = re.sub(r'<link rel="canonical"[^>]*>\s*', "", h)
    h = re.sub(r'<meta name="robots"[^>]*>\s*', "", h)
    return h


def aplicar(dry=False):
    tocadas = []
    for path, meta in P.items():
        fp = os.path.join(ROOT, path)
        if not os.path.exists(fp):
            print("  FALTA", path); continue
        h = open(fp, encoding="utf-8").read()
        nuevo = limpiar_head(h)
        nuevo = re.sub(r"<title>.*?</title>", "<title>" + html.escape(meta[0]) + "</title>",
                       nuevo, count=1, flags=re.S)
        m = re.search(r'<meta charset="[^"]*">', nuevo)
        bloque = bloque_seo(path, meta)
        if m:
            nuevo = nuevo[:m.end()] + "\n" + bloque + nuevo[m.end():]
        else:
            nuevo = nuevo.replace("</title>", "</title>\n" + bloque, 1)
        if not dry and nuevo != h:
            open(fp, "w", encoding="utf-8").write(nuevo)
        tocadas.append(path)

    # plantillas con parámetro: noindex
    for path in NOINDEX:
        fp = os.path.join(ROOT, path)
        if not os.path.exists(fp): continue
        h = open(fp, encoding="utf-8").read()
        h = limpiar_head(h)
        h = re.sub(r"(<title>.*?</title>)", r'\1\n<meta name="robots" content="noindex,follow">', h, count=1, flags=re.S)
        if not dry:
            open(fp, "w", encoding="utf-8").write(h)
        tocadas.append(path + " (noindex)")

    # stubs de redirección: noindex
    for fp in sorted(__import__("glob").glob(os.path.join(ROOT, "servicios", "*.html"))):
        txt = open(fp, encoding="utf-8").read()
        if "window.location.replace" in txt and len(txt) < 400:
            nuevo = txt.replace("<head>", '<head><meta name="robots" content="noindex,follow">', 1) \
                        if 'name="robots"' not in txt else txt
            if nuevo != txt and not dry:
                open(fp, "w", encoding="utf-8").write(nuevo)
            tocadas.append(os.path.relpath(fp, ROOT) + " (stub noindex)")
    return tocadas


def sitemap(dry=False):
    orden = sorted(P.items(), key=lambda kv: (-float(kv[1][4]), kv[0]))
    filas = []
    for path, meta in orden:
        url = f"{DOM}/{path.replace('index.html', '')}"
        filas.append(f"""    <url>
        <loc>{url}</loc>
        <lastmod>{HOY}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>{meta[4]}</priority>
    </url>""")
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(filas) + "\n</urlset>\n")
    if not dry:
        open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(xml)
    return len(filas)


def og_images():
    sys.path.insert(0, "/home/nexus/.hermes/cache/scratch")
    import importlib.util
    spec = importlib.util.spec_from_file_location("oggen", "/home/nexus/.hermes/cache/scratch/og-gen2.py")
    if spec is None or spec.loader is None:
        raise RuntimeError("no se pudo cargar og-gen2.py")
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    destino = os.path.join(ROOT, OG_DIR)
    os.makedirs(destino, exist_ok=True)
    hechas = 0
    for path, meta in P.items():
        slug = path.replace("/", "-").replace(".html", "")
        out = os.path.join(destino, slug + ".jpg")
        m.og(meta[3], meta[2], out)
        hechas += 1
    m.og("Más capacidad para tu equipo, y menos carga.", "Operaciones gestionadas con IA",
         os.path.join(destino, "default.jpg"))
    return hechas + 1


if __name__ == "__main__":
    print("aplicando metadatos…")
    t = aplicar()
    n = sitemap()
    print(f"  {len(t)} páginas tocadas · sitemap con {n} URLs")
    if "--og" in sys.argv:
        print("generando tarjetas 1200×630…")
        print("  imágenes:", og_images())
    faltan = [p for p, m in P.items() if not (120 <= len(m[1]) <= 165)]
    for p in faltan:
        print(f"  AVISO longitud desc {p}: {len(dict(P)[p][1])} chars")
