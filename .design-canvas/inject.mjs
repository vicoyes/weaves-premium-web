import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const TECH = '../images/tech/';
const map = {};
for (const f of readdirSync(TECH).filter(f => f.endsWith('.svg'))) {
  let s = readFileSync(TECH + f, 'utf8');
  s = s.replace(/<title>[\s\S]*?<\/title>/g, '')
       .replace(/\srole="img"/g, '')
       .replace(/<svg /, '<svg fill="currentColor" aria-hidden="true" ');
  map[f.replace('.svg','')] = s.trim();
}
const file = process.argv[2];
let html = readFileSync(file, 'utf8');
html = html.replace(/<!--SVG:([a-z0-9-]+)-->/g, (m, k) => {
  if (!map[k]) { console.error('FALTA logo:', k); return m; }
  return map[k];
});
writeFileSync(file, html);
console.log('logos inyectados en', file, '->', Object.keys(map).length, 'disponibles');
