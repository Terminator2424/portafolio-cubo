import { GITHUB_USER, FALLBACK_PROJECTS, FEATURED, EXCLUDE, TOP_PROJECTS } from './profile';
import { MAX_PROJECTS, shapeFor } from './shape';

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

export async function getProjects() {
  let list = [];
  let source = 'github';

  try {
    const headers = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
      { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(7000) }
    );
    if (!res.ok) throw new Error(`GitHub respondió ${res.status}`);

    const data = await res.json();
    list = data
      .filter(
        (r) =>
          !r.private &&
          !r.fork &&
          r.description &&
          r.name.toLowerCase() !== GITHUB_USER.toLowerCase() &&
          !excluidos.includes(norm(r.name))
      )
      .map((r) => ({
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
      }));
  } catch (err) {
    console.error('[getProjects] falló la API de GitHub:', err.message);
  }

  if (list.length === 0) {
    source = 'fallback';
    list = FALLBACK_PROJECTS.map((p) => ({ ...p, featured: posicion(p.name) !== -1 }));
  }

  list = ordenar(list).slice(0, Math.min(TOP_PROJECTS, MAX_PROJECTS));

  // Completa hasta las caras de la forma que toca (6, 8, 12 o 20)
  const faces = shapeFor(list.length).faces;
  let i = 0;
  while (list.length < faces) list.push(placeholder(i++));

  return { projects: list, source };
}