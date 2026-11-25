#!/usr/bin/env python3
"""Check English pages and their Spanish counterparts without external dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
BASE = 'https://getweaves.com'
# Pages that arrive in phases 2-3: their absence is a warning unless --strict.
PENDING = ('en/services/', 'en/industries/', 'en/cases/', 'en/blog/', 'en/legal/')
STRICT = '--strict' in sys.argv
PAIRS = {'en/index.html': 'index.html', 'en/about.html': 'pages/quienes-somos.html', 'en/contact.html': 'pages/contacto.html', 'en/services/index.html': 'servicios/index.html', 'en/services/service.html': 'servicios/servicio.html', 'en/industries/index.html': 'sectores/index.html', 'en/industries/industry.html': 'sectores/sector.html', 'en/industries/ecommerce.html': 'sectores/ecommerce.html', 'en/industries/education.html': 'sectores/educacion.html', 'en/industries/restaurants-tourism.html': 'sectores/restauracion-turismo.html', 'en/industries/healthcare.html': 'sectores/salud.html', 'en/industries/professional-services.html': 'sectores/servicios-profesionales.html', 'en/industries/startups.html': 'sectores/startups.html', 'en/cases/index.html': 'pages/casos-exito.html', 'en/blog/index.html': 'pages/blog.html', 'en/blog/whatsapp-and-human-support.html': 'pages/blog/whatsapp-atencion-humana.html', 'en/blog/fixed-rules-vs-ai-in-processes.html': 'pages/blog/reglas-fijas-o-ia-en-procesos.html', 'en/blog/choosing-your-first-process-to-automate.html': 'pages/blog/elegir-primer-proceso-automatizar.html', 'en/legal/privacy-policy.html': 'legal/politica-privacidad.html', 'en/legal/legal-notice.html': 'legal/aviso-legal.html', 'en/legal/cookie-policy.html': 'legal/politica-cookies.html'}
WORDS = re.compile(r'\b(?:el|la|los|las|de|del|que|para|con|sin|tu|tus|su|sus|más|cómo|qué|quién|nosotros|equipo|proceso|empresa|servicios|casos|contacto|hacemos|somos|reservas|facturación)\b|[áéíóúñ¿¡]', re.I)
ALLOW = ['Héctor Luis Del Valle Muñoz Farías', 'Chusa Fernández', 'Empieza de Cero', 'Acuña', 'Julián', 'Alarcón', 'Chusa', 'Weaves', 'getweaves.com', 'info@weavewp.com', 'Héctor Muñoz', 'Spa...', 'Bogotá', 'Tunjuelito', 'Calle 19 Sur', 'San Carlos']
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
class Page(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True); self.tags=[]; self.urls=[]; self.text=[]; self.metas={}; self.links=[]; self.switch=[]; self.lang=None; self.stack=[]; self.skip_switch=0; self.skip_text=0; self.es_links=[]
 def handle_startendtag(self, tag, attrs): self.handle_starttag(tag, attrs); self.handle_endtag(tag)
 def handle_starttag(self, tag, attrs):
  d=dict(attrs); classes=d.get('class','').split()
  if 'lang-switch' in classes: self.skip_switch+=1
  elif self.skip_switch and tag not in VOID: self.skip_switch+=1
  if self.skip_switch and tag=='a': self.switch.append((d.get('lang'),d.get('href')))
  if tag=='a' and not self.skip_switch and (d.get('href') or '').startswith(('/pages/','/sectores/','/servicios/','/legal/')):
   self.es_links.append(d['href'])
  if not self.skip_switch and tag not in ('link','meta','script','input'): self.tags.append(tag)
  if tag=='html': self.lang=d.get('lang')
  if tag=='meta': self.metas[d.get('property') or d.get('name')]=d.get('content')
  if tag=='link': self.links.append(d)
  for key in ('href','src','poster','data-src'):
   if key in d: self.urls.append((key,d[key]))
  if 'srcset' in d:
   for candidate in d['srcset'].split(','): self.urls.append(('srcset',candidate.strip().split()[0] if candidate.strip() else ''))
  if 'style' in d:
   for u in re.findall(r'url\(\s*[\'\"]?(.*?)[\'\"]?\s*\)', d['style'], re.I): self.urls.append(('style',u))
  if tag in ('script','style'): self.skip_text+=1
  if not self.skip_text:
   for key in ('alt','aria-label','title','placeholder'):
    if d.get(key): self.text.append(d[key])
   if tag=='input' and d.get('type','').lower()=='submit' and d.get('value'): self.text.append(d['value'])
 def handle_endtag(self,tag):
  if tag in ('script','style') and self.skip_text: self.skip_text-=1
  if self.skip_switch and tag not in VOID: self.skip_switch-=1
 def handle_data(self,data):
  if not self.skip_text and data.strip(): self.text.append(data.strip())

def parse(path):
 p=Page(); p.feed(path.read_text(encoding='utf-8')); return p

def counterpart(rel):
 if rel in PAIRS: return PAIRS[rel]
 if rel.startswith('en/cases/') and rel.endswith('.html'): return 'pages/caso-'+Path(rel).name
 return None

def main():
 errors=links=leftovers=pairs=warns=0; cache={}
 def get(rel):
  if rel not in cache: cache[rel]=parse(ROOT/rel)
  return cache[rel]
 def error(message):
  nonlocal errors
  errors+=1; print('ERROR:',message)
 def pending(target_rel):
  return (not STRICT) and str(target_rel).startswith(PENDING)
 for path in sorted((ROOT/'en').rglob('*.html')):
  rel=path.relative_to(ROOT).as_posix(); p=get(rel); other=counterpart(rel); enurl=BASE+'/'+rel
  if p.lang!='en': error(f'{rel}: lang={p.lang!r}, expected en')
  for href in p.es_links: error(f'{rel}: link to Spanish page outside the switcher: {href}')
  if p.metas.get('og:locale')!='en_US': error(f'{rel}: incorrect og:locale')
  canon=[x.get('href') for x in p.links if 'canonical' in x.get('rel','').split()]
  noindex = 'noindex' in (p.metas.get('robots') or '').lower()
  if not noindex and canon!=[enurl]: error(f'{rel}: canonical {canon!r}, expected {enurl}')
  if other and not noindex:
   expected={'es': BASE+'/'+other,'en':enurl,'x-default':BASE+'/'+other}
   for lang,url in expected.items():
    found=[x.get('href') for x in p.links if 'alternate' in x.get('rel','').split() and x.get('hreflang')==lang]
    if found!=[url]: error(f'{rel}: hreflang {lang} {found!r}, expected {url}')
  elif not other: print(f'WARN: {rel}: counterpart mapping unknown')
  for attr,value in p.urls:
   u=urlsplit(value)
   if not value or value.startswith(('#','//')) or u.scheme.lower() in ('http','https','mailto','tel','data'): continue
   target=(ROOT/unquote(u.path.lstrip('/'))) if u.path.startswith('/') else (path.parent/unquote(u.path))
   if not u.path: continue
   links+=1
   if target.is_dir(): target=target/'index.html'
   if not target.is_file():
    reltarget=target.relative_to(ROOT).as_posix() if str(target).startswith(str(ROOT)) else ''
    if pending(reltarget):
     warns+=1; continue
    error(f'{rel}: {attr}={value!r} does not resolve')
  for string in p.text:
   scrub=string
   for name in ALLOW: scrub=re.sub(re.escape(name),'',scrub,flags=re.I)
   if WORDS.search(scrub): leftovers+=1; error(f'{rel}: Spanish leftover: {string!r}')
  if not other or not (ROOT/other).is_file(): print(f'WARN: {rel}: Spanish counterpart missing'); continue
  pairs+=1; sp=get(other)
  for i in range(max(len(p.tags),len(sp.tags))):
   a=p.tags[i] if i<len(p.tags) else '<end>'; b=sp.tags[i] if i<len(sp.tags) else '<end>'
   if a!=b: error(f'{rel} vs {other}: tag divergence at {i}: {a} != {b}'); break
  if not any(lang=='es' and urlsplit(href or '').path=='/'+other for lang,href in p.switch): error(f'{rel}: switcher missing Spanish link to /{other}')
  if not any(lang=='en' and urlsplit(href or '').path=='/'+rel for lang,href in sp.switch): error(f'{other}: switcher missing English link to /{rel}')
 # Check all Spanish switchers in both directions, including future pages.
 for path in ROOT.rglob('*.html'):
  rel=path.relative_to(ROOT).as_posix()
  if rel.startswith(('en/','.git/','node_modules/')): continue
  sp=get(rel)
  if sp.lang!='es' or not sp.switch: continue
  for lang,href in sp.switch:
   if lang!='en' or not href: continue
   target=urlsplit(href).path.lstrip('/')
   if not (ROOT/target).is_file(): print(f'WARN: {rel}: switcher target {href} missing'); continue
   if not any(l=='es' and urlsplit(h or '').path=='/'+rel for l,h in get(target).switch): error(f'{rel}: {href} does not link back')
 print(f'Summary: {pairs} pairs checked, {links} links checked, {leftovers} leftovers, {errors} errors, {warns} pending-links (phases 2-3)')
 return 1 if errors else 0
if __name__=='__main__': raise SystemExit(main())
