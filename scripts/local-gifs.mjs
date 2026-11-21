// Lista los GIF de public/systems y guarda un mapa nombre -> ruta en lib/local-gifs.json
import { existsSync, readdirSync, writeFileSync } from 'node:fs';

const dir = 'public/systems';
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const map = {};
if (existsSync(dir)) {
  for (const f of readdirSync(dir)) {
    if (/\.gif$/i.test(f)) map[norm(f.replace(/\.gif$/i, ''))] = `/systems/${f}`;
  }
}
writeFileSync('lib/local-gifs.json', JSON.stringify(map, null, 2));
console.log('GIFs locales:', Object.keys(map).length);