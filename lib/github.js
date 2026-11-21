import { GITHUB_USER, FALLBACK_PROJECTS, FEATURED, EXCLUDE, TOP_PROJECTS, SKILLS } from './profile';
import { MAX_PROJECTS, shapeFor } from './shape';
import { SYSTEMS } from './systems';
import { classify, detectTech, findGif, mergeSkills, prettyTitle } from './insights';
import LOCAL_GIFS from './local-gifs.json';

const REVALIDATE = 3600;
const MAX_SYSTEMS = 11;

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const destacados = FEATURED.map(norm);
const excluidos = EXCLUDE.map(norm);
const posicion = (name) => destacados.indexOf(norm(name));

const placeholder = (i) => ({
  id: `soon-${i}`,
  name: 'Próximamente',
  description: 'Un nuevo proyecto está en camino. Mientras tanto, mira mi perfil completo en GitHub.',
  language: 'Soon',
  topics: [],
  url: `https://github.com/${GITHUB_USER}`,
  stars: 0,
  placeholder: true,
});

// Primero los destacados (en el orden de FEATURED); después los repos más grandes.
function ordenar(list) {
  return list.sort((a, b) => {
    const pa = posicion(a.name);
    const pb = posicion(b.name);
    if (pa !== -1 || pb !== -1) {
      if (pa === -1) return 1;
      if (pb === -1) return -1;
      return pa - pb;
    }
    return (b.size || 0) - (a.size || 0);
  });
}

async function pedir(url, tipo = 'text') {
  try {
    const headers = {};
    if (url.startsWith('https://api.github.com')) {
      headers.Accept = 'application/vnd.github+json';
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(url, { headers, next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return tipo === 'json' ? await res.json() : await res.text();
  } catch {
    return null;
  }
}

// README + lenguajes de un repo (en paralelo y con caché de 1 hora)
async function enriquecer(r) {
  const branch = r.default_branch || 'HEAD';
  const raw = `https://raw.githubusercontent.com/${GITHUB_USER}/${r.name}/${branch}`;
  const [md, bytes] = await Promise.all([
    pedir(`${raw}/README.md`),
    pedir(`https://api.github.com/repos/${GITHUB_USER}/${r.name}/languages`, 'json'),
  ]);
  let readme = md;
  for (const n of ['Readme.md', 'readme.md', 'README.MD', 'README']) {
    if (readme != null) break;
    readme = await pedir(`${raw}/${n}`);
  }
  readme = readme ?? '';
  const total = Object.values(bytes || {}).reduce((a, b) => a + b, 0) || 1;
  const langs = Object.entries(bytes || {})
    .map(([name, n]) => ({ name, pct: (n / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);
  return { readme, langs, gif: findGif(readme, GITHUB_USER, r.name, branch) };
}

function armar(base, x) {
  const topics = base.topics || [];
  const langNames = x.langs.map((l) => l.name);
  const meta = [base.name, base.description, topics.join(' ')].join(' ').toLowerCase();
  const readme = x.readme.toLowerCase();
  const { art, kind } = classify(`${meta} ${langNames.join(' ').toLowerCase()}`, readme);
  const top = x.langs.filter((l) => l.pct >= 5).slice(0, 2).map((l) => l.name);
  const tags = [...new Set([...(top.length ? top : [base.language]), ...topics])]
    .filter((t) => t && t !== 'Code' && t !== 'Soon')
    .slice(0, 4);
  return { p: { ...base, gif: LOCAL_GIFS[norm(base.name)] || x.gif, art, kind, tags }, tech: detectTech(meta, readme, x.langs) };
}

const paraCubo = ({ id, name, description, language, topics, url, homepage, stars, featured, gif }) => ({
  id, name, description, language, topics, url, homepage, stars, featured, gif,
});

// Tarjetas manuales (lib/systems.js) + una tarjeta automática por cada repo que no esté ya cubierto
function armarSistemas(all) {
  const usados = new Set();
  const manuales = SYSTEMS.map((s) => {
    const k = s.repo ? norm(s.repo.split('/').pop()) : null;
    const p = k && all.find((x) => norm(x.name) === k);
    if (p) usados.add(k);
    return { ...s, gif: s.gif || LOCAL_GIFS[norm(s.title)] || p?.gif || null };
  });
  const auto = all
    .filter((p) => !usados.has(norm(p.name)))
    .map((p) => ({
      title: prettyTitle(p.name),
      kind: p.kind,
      description: p.description,
      tags: p.tags,
      image: null,
      art: p.art,
      repo: p.url,
      gif: p.gif || null,
    }));
  return [...manuales, ...auto].slice(0, MAX_SYSTEMS);
}

export async function getPortfolioData() {
  let items = [];
  let source = 'github';

  try {
    const data = await pedir(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`, 'json');
    if (!Array.isArray(data)) throw new Error('GitHub no devolvió la lista de repos');

    const repos = data.filter(
      (r) =>
        !r.private &&
        !r.fork &&
        r.description &&
        r.name.toLowerCase() !== GITHUB_USER.toLowerCase() &&
        !excluidos.includes(norm(r.name))
    );

    items = await Promise.all(
      repos.map(async (r) => {
        const base = {
          id: String(r.id),
          name: r.name,
          description: r.description,
          language: r.language || 'Code',
          topics: r.topics || [],
          url: r.html_url,
          homepage: r.homepage || null,
          stars: r.stargazers_count || 0,
          size: r.size || 0,
          featured: posicion(r.name) !== -1,
        };
        const x = await enriquecer(r).catch(() => ({ readme: '', langs: [], gif: null }));
        return armar(base, x);
      })
    );
  } catch (err) {
    console.error('[getPortfolioData] falló la API de GitHub:', err.message);
  }

  if (items.length === 0) {
    source = 'fallback';
    items = FALLBACK_PROJECTS.map((p) =>
      armar({ ...p, featured: posicion(p.name) !== -1 }, { readme: '', langs: [], gif: null })
    );
  }

  const all = ordenar(items.map((i) => i.p));
  const projects = all.slice(0, Math.min(TOP_PROJECTS, MAX_PROJECTS)).map(paraCubo);

  // Completa hasta las caras de la forma que toca (6, 8, 12 o 20)
  const faces = shapeFor(projects.length).faces;
  let i = 0;
  while (projects.length < faces) projects.push(placeholder(i++));

  const found = new Map(items.flatMap((it) => it.tech));
  const skills = source === 'github' ? mergeSkills(SKILLS, found) : SKILLS;

  return { projects, source, systems: armarSistemas(all), skills };
}