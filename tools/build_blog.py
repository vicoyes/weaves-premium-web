#!/usr/bin/env python3
"""Construye el blog estático. Frontmatter: claves escalares o listas/objetos JSON.

Edite content/blog/*.md y ejecute python3 tools/build_blog.py; después ejecute
WEAVES_DOMAIN=https://getweaves.com python3 tools/seo_aplicar.py.
Las imágenes y los enlaces de CTA son rutas absolutas desde la raíz del sitio.
"""
import sys
sys.dont_write_bytecode = True
from pathlib import Path
from datetime import date
import html
import json
import math
import re
import unicodedata
import markdown

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content/blog'
DOMAIN = 'https://getweaves.com'
E = lambda x: html.escape(str(x), quote=True)


def slugify(text, separator='-'):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', separator, text).strip(separator)


def parse(path):
    text = path.read_text(encoding='utf-8')
    match = re.match(r'\A---\s*\n(.*?)\n---\s*\n', text, re.S)
    if not match:
        raise ValueError(f'{path}: falta frontmatter')
    meta = {}
    for line in match.group(1).splitlines():
        if not line.strip() or line.startswith('#'):
            continue
        key, sep, value = line.partition(':')
        if not sep or not re.fullmatch(r'[a-z_]+', key) or key in meta:
            raise ValueError(f'{path}: línea inválida o clave duplicada: {line}')
        value = value.strip()
        meta[key] = json.loads(value) if value.startswith(('[', '{', '"')) else value
    required = ('title', 'slug', 'description', 'category', 'tags', 'date', 'updated', 'author', 'image', 'image_alt', 'summary', 'cta', 'related')
    if any(not meta.get(k) for k in required):
        raise ValueError(f'{path}: falta algún campo obligatorio')
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', meta['slug']):
        raise ValueError(f'{path}: slug inválido')
    if len(meta['title'] + ' | Weaves') > 60 or not 120 <= len(meta['description']) <= 165:
        raise ValueError(f'{path}: longitudes SEO inválidas ({len(meta["title"] + " | Weaves")}, {len(meta["description"])})')
    for key in ('date', 'updated'):
        date.fromisoformat(meta[key])
    if meta['updated'] < meta['date']:
        raise ValueError(f'{path}: actualización anterior a publicación')
    if not meta['image'].startswith('/') or not (ROOT / meta['image'].lstrip('/')).is_file():
        raise ValueError(f'{path}: imagen inexistente')
    for key in ('tags', 'summary', 'related'):
        if not isinstance(meta[key], list) or not all(isinstance(x, str) and x for x in meta[key]):
            raise ValueError(f'{path}: {key} debe ser una lista de textos')
    if not isinstance(meta.get('faq', []), list) or any(not isinstance(q, dict) or not q.get('question') or not q.get('answer') for q in meta.get('faq', [])):
        raise ValueError(f'{path}: FAQ inválida')
    meta['body'] = text[match.end():].strip()
    meta['reading_time'] = int(meta.get('reading_time') or max(1, math.ceil(len(re.findall(r'\b\w+\b', meta['body'])) / 200)))
    return meta


def load_posts():
    posts = [parse(p) for p in sorted(CONTENT.glob('*.md'))]
    if not posts:
        raise ValueError('No hay artículos en content/blog')
    slugs = {p['slug'] for p in posts}
    if len(slugs) != len(posts):
        raise ValueError('Hay slugs duplicados')
    for p in posts:
        if set(p['related']) - slugs or p['slug'] in p['related']:
            raise ValueError(f"{p['slug']}: relacionados inexistentes o autorreferentes")
    return sorted(posts, key=lambda p: (p['date'], p['slug']), reverse=True)


def seo_entries(posts):
    return {f"pages/blog/{p['slug']}.html": (p['title'] + ' | Weaves', p['description'], 'Blog · ' + p['category'], p['title'], '0.7', None) for p in posts}


def render_card(p, prefix='blog/'):
    return f'''<article class="blog-card" data-category="{E(slugify(p['category']))}" data-search="{E(' '.join([p['title'], p['description'], p['category'], *p['tags']]).lower())}">
<a class="blog-card-link" href="{prefix}{E(p['slug'])}.html"><img src="{E(p['image'])}" alt="{E(p['image_alt'])}" loading="lazy"><div class="blog-card-content"><p class="blog-label">{E(p['category'])} · {p['reading_time']} min</p><h2>{E(p['title'])}</h2><p>{E(p['description'])}</p><span class="blog-more">Leer artículo <span aria-hidden="true">→</span></span></div></a></article>'''


def article(p, posts, nav, footer):
    # El mismo bloque que aplica SEO garantiza metadatos también tras solo construir.
    import seo_aplicar
    path = f"pages/blog/{p['slug']}.html"
    seo_aplicar.DOM = DOMAIN
    seo = seo_aplicar.bloque_seo(path, seo_entries([p])[path])
    md = markdown.Markdown(extensions=['toc', 'tables', 'fenced_code'], extension_configs={'toc': {'slugify': slugify}})
    body = md.convert(p['body'])
    headings = [(x['id'], x['name']) for x in md.toc_tokens if x['level'] == 2]
    faq = p.get('faq', [])
    if faq:
        headings.append(('preguntas-frecuentes', 'Preguntas frecuentes'))
        body += '<h2 id="preguntas-frecuentes">Preguntas frecuentes</h2><div class="blog-faq">' + ''.join(f'<details><summary>{E(q["question"])}</summary><p>{E(q["answer"])}</p></details>' for q in faq) + '</div>'
    toc = ''.join(f'<li><a href="#{E(i)}">{E(re.sub("<[^>]+>", "", name))}</a></li>' for i, name in headings)
    url = f"{DOMAIN}/pages/blog/{p['slug']}.html"
    ogfile = ROOT / 'images/og' / f"pages-blog-{p['slug']}.jpg"
    og = f"{DOMAIN}/" + (str(ogfile.relative_to(ROOT)) if ogfile.is_file() else 'images/og/default.jpg')
    graph = [{'@type': 'BlogPosting', 'headline': p['title'], 'description': p['description'], 'image': og, 'datePublished': p['date'], 'dateModified': p['updated'], 'author': {'@type': 'Organization', 'name': p['author']}, 'publisher': {'@type': 'Organization', 'name': 'Weaves', 'url': DOMAIN}, 'mainEntityOfPage': url, 'inLanguage': 'es'}, {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': DOMAIN + '/'}, {'@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': DOMAIN + '/pages/blog.html'}, {'@type': 'ListItem', 'position': 3, 'name': p['title'], 'item': url}]}]
    if faq:
        graph.append({'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q['question'], 'acceptedAnswer': {'@type': 'Answer', 'text': q['answer']}} for q in faq]})
    structured = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False).replace('<', '\\u003c')
    summary = ''.join(f'<li>{E(x)}</li>' for x in p['summary'])
    tags = ''.join(f'<span>#{E(x)}</span>' for x in p['tags'])
    related = ''.join(render_card(next(x for x in posts if x['slug'] == s), '') for s in p['related'])
    return f'''<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
{seo}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(p['title'])} | Weaves</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../css/styles.css?v=20261124-1">
<script id="cookieyes" src="https://cdn-cookieyes.com/client_data/dc631879d65242ce24a26ab58c89d599/script.js"></script>
<script defer src="https://analytics.weavewp.com/script.js" data-website-id="e6709a17-7e16-4762-8fa7-0f1dd75b4264" data-domains="getweaves.com,www.getweaves.com"></script>
<script defer src="../../js/analytics-events.js?v=20261124-2"></script>
<script type="application/ld+json">{structured}</script>
</head><body>{nav}
<main><header class="blog-single-hero"><div class="blog-hero-inner"><p class="blog-crumbs"><a href="../../index.html">Inicio</a> / <a href="../blog.html">Blog</a> / {E(p['category'])}</p><p class="blog-label">{E(p['category'])}</p><h1>{E(p['title'])}</h1><p class="blog-lead">{E(p['description'])}</p><p class="blog-byline"><strong>{E(p['author'])}</strong> · <time datetime="{p['date']}">{p['date']}</time> · {p['reading_time']} min de lectura · Actualizado <time datetime="{p['updated']}">{p['updated']}</time></p></div></header>
<div class="blog-cover"><img src="{E(p['image'])}" alt="{E(p['image_alt'])}"></div>
<div class="blog-layout"><aside class="blog-toc"><p class="blog-label">En este artículo</p><div role="navigation" aria-label="Índice del artículo"><ol>{toc}</ol></div></aside><article class="blog-prose"><div class="blog-summary"><p class="blog-label">Resumen rápido</p><ul>{summary}</ul></div>{body}<div class="blog-author"><strong>{E(p['author'])}</strong><p>Ideas prácticas para ordenar operaciones con automatización y supervisión humana.</p></div><div class="blog-tags">{tags}</div></article></div>
<section class="blog-cta"><div><p class="blog-label">¿Lo revisamos?</p><h2>{E(p['cta'])}</h2></div><a href="../contacto.html">Contacto <span aria-hidden="true">→</span></a></section>
<section class="blog-related"><div class="blog-related-heading"><h2>Sigue leyendo</h2><a href="../blog.html">Ver el blog →</a></div><div class="blog-grid">{related}</div></section></main>
{footer}<script src="../../js/components-loader.js"></script></body></html>\n'''


def main():
    posts = load_posts()
    index = ROOT / 'pages/blog.html'
    source = index.read_text(encoding='utf-8')
    nav = re.search(r'<div id="header-placeholder">.*?</nav>\s*</div>', source, re.S).group()
    footer = re.search(r'<div id="footer-placeholder">.*?</footer>\s*</div>', source, re.S).group()
    # El índice se actualiza entre marcadores; se conserva el formulario compartido.
    start, end = '<!-- BLOG CONTENT START -->', '<!-- BLOG CONTENT END -->'
    categories = sorted({p['category'] for p in posts})
    buttons = '<button class="blog-filter active" data-category="all" aria-pressed="true">Todos</button>' + ''.join(f'<button class="blog-filter" data-category="{E(slugify(c))}" aria-pressed="false">{E(c)}</button>' for c in categories)
    area = f'''{start}
<main><section class="blog-index-hero"><div class="blog-hero-inner"><p class="blog-label">Blog y recursos</p><h1>Inteligencia artificial aplicada</h1><p class="blog-lead">Guías prácticas y automatizaciones para ordenar la operación de tu empresa.</p></div></section>
<section class="blog-index"><div class="blog-index-controls"><div class="blog-filters" aria-label="Filtrar por categoría">{buttons}</div><label class="blog-search">Buscar artículos<input type="search" id="blog-search" placeholder="Buscar por tema o palabra"></label></div><div id="blog-posts" class="blog-grid">{''.join(render_card(p) for p in posts)}</div><p id="blog-empty" class="blog-empty" hidden>No hay artículos que coincidan con la búsqueda.</p></section></main>
{end}'''
    if start in source and end in source:
        source = source[:source.index(start)] + area + source[source.index(end) + len(end):]
    else:
        source = source[:source.index('<!-- HERO -->')] + area + '\n' + source[source.index('<!-- NEWSLETTER / BIG CTA -->'):]
    source = re.sub(r'<style>.*?</style>\s*', '', source, flags=re.S)
    source = source.replace('../css/styles.css?v=20261123-8', '../css/styles.css?v=20261124-1')
    source = source.replace('../css/styles.css?v=20261124-blog1', '../css/styles.css?v=20261124-1')
    source = source.replace('family=JetBrains+Mono:wght@400;500', 'family=Space+Mono:wght@400;700')
    source = source.replace('<script src="../js/main.js"></script>\n', '')
    source = re.sub(r'<script>\s*// reveal animations.*?</script>', '', source, flags=re.S)
    index.write_text(source, encoding='utf-8')
    out = ROOT / 'pages/blog'
    out.mkdir(parents=True, exist_ok=True)
    for p in posts:
        path = out / (p['slug'] + '.html')
        path.write_text(article(p, posts, nav, footer), encoding='utf-8')
        print('escrito', path.relative_to(ROOT))
    print(f'índice actualizado: {len(posts)} artículos')


if __name__ == '__main__':
    main()
