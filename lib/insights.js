// Logica sin red: clasifica repos, detecta tecnologias y busca GIFs en el README.
const L = 'Lenguajes';
const B = 'Backend y bases de datos';
const W = 'Web y móvil';
const AI = 'Inteligencia artificial';
const N = 'Redes y seguridad';
const H = 'Herramientas';

// [expresion, etiqueta, grupo]. Se agrega si aparece en nombre/topics/descripcion o 2+ veces en el README.
const TECH = [
  [/\bquarkus\b/g, 'Quarkus', B],
  [/spring[\s-]?boot/g, 'Spring Boot', B],
  [/hexagonal/g, 'Arquitectura hexagonal', B],
  [/\bmysql\b/g, 'MySQL', B],
  [/postgres/g, 'PostgreSQL', B],
  [/sqlite/g, 'SQLite', B],
  [/mongodb/g, 'MongoDB', B],
  [/react[\s-]native/g, 'React Native', W],
  [/\breact\b(?![\s-]native)/g, 'React', W],
  [/next\.?js/g, 'Next.js', W],
  [/three\.?js|react[\s-]three/g, 'Three.js', W],
  [/tailwind/g, 'Tailwind CSS', W],
  [/\bexpo\b/g, 'Expo', W],
  [/webrtc/g, 'WebRTC', W],
  [/\bollama\b/g, 'Ollama', AI],
  [/\brag\b/g, 'RAG', AI],
  [/stable[\s-]?diffusion/g, 'Stable Diffusion', AI],
  [/\bllm\b/g, 'LLM', AI],
  [/gemini/g, 'Gemini API', AI],
  [/wireshark/g, 'Wireshark', N],
  [/\bkali\b/g, 'Kali Linux', N],
  [/\bnist\b/g, 'NIST', N],
  [/mitre/g, 'MITRE ATT&CK', N],
  [/owasp/g, 'OWASP', N],
  [/\bjwt\b/g, 'JWT y hashing', N],
  [/docker/g, 'Docker', H],
  [/github[\s-]actions/g, 'GitHub Actions', H],
  [/sonar(cloud|qube)/g, 'SonarCloud', H],
  [/\bunity\b/g, 'Unity', H],
  [/\blinux\b/g, 'Linux', H],
];

const LANG_MAP = {
  Java: ['Java', L], Python: ['Python', L], JavaScript: ['JavaScript', L], TypeScript: ['TypeScript', L],
  C: ['C/C++', L], 'C++': ['C/C++', L], 'C#': ['C#', L], Kotlin: ['Kotlin', L], Go: ['Go', L],
  Rust: ['Rust', L], PHP: ['PHP', L], HTML: ['HTML', W], Dockerfile: ['Docker', H],
};

// Tipo de proyecto -> dibujo de la seccion 02. En empate gana el primero.
const CATS = [
  { art: 'network', kind: 'Ciberseguridad', rx: /ciberseguridad|cybersecurity|security|seguridad|forens|pentest|owasp|mitre|wireshark|nmap|kali|infosec/g },
  { art: 'neural', kind: 'Inteligencia artificial', rx: /\b(ia|ai)\b|\bllm\b|ollama|\brag\b|machine learning|neural|inteligencia artificial|gemini|diffusion|chatbot|algoritm|hill climbing/g },
  { art: 'game', kind: 'Videojuego', rx: /\bunity\b|\bgame\b|juego|videojuego|godot|phaser|unreal/g },
  { art: 'mobile', kind: 'App móvil', rx: /react[\s-]native|\bexpo\b|android|kotlin|\bios\b|flutter|\bapk\b/g },
  { art: 'cube', kind: 'Web 3D', rx: /three\.?js|webgl|\b3d\b|blender|gemelo|modelado/g },
  { art: 'data', kind: 'Datos', rx: /mysql|postgres|sqlite|database|base de datos|\bsql\b|mongodb/g },
  { art: 'layers', kind: 'Backend', rx: /spring|quarkus|backend|\brest\b|hexagonal|microservic|\bjava\b|\bapi\b/g },
  { art: 'web', kind: 'Web', rx: /\bhtml\b|\bcss\b|\breact\b|next\.?js|frontend|website|tailwind|portafolio|javascript|typescript/g },
];

const count = (rx, text) => (text.match(rx) || []).length;
const key = (s) => s.toLowerCase().replace(/[^a-z0-9+#]/g, '');

export function classify(meta, readme) {
  let best = { art: 'graph', kind: 'Proyecto' };
  let top = 0;
  for (const c of CATS) {
    const score = 3 * Math.min(count(c.rx, meta), 3) + Math.min(count(c.rx, readme), 5);
    if (score > top) { top = score; best = { art: c.art, kind: c.kind }; }
  }
  return best;
}

export function detectTech(meta, readme, langs) {
  const out = new Map();
  for (const [rx, label, group] of TECH) {
    if (count(rx, meta) > 0 || count(rx, readme) >= 2) out.set(label, group);
  }
  for (const l of langs) {
    const m = l.pct >= 5 && LANG_MAP[l.name];
    if (m) out.set(m[0], m[1]);
  }
  return [...out];
}

export function mergeSkills(base, found) {
  const groups = base.map((g) => ({ group: g.group, items: [...g.items] }));
  const have = new Set(groups.flatMap((g) => g.items.map(key)));
  for (const [label, group] of found) {
    if (have.has(key(label))) continue;
    let g = groups.find((x) => x.group === group);
    if (!g) { g = { group, items: [] }; groups.push(g); }
    g.items.push(label);
    have.add(key(label));
  }
  return groups;
}

// Primer GIF del README (markdown o <img>), en el orden en que aparece.
export function findGif(readme, user, repo, branch) {
  if (!readme) return null;
  const text = readme.slice(0, 80000);
  const found = [];
  for (const m of text.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/g)) found.push({ i: m.index, u: m[1] });
  for (const m of text.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)) found.push({ i: m.index, u: m[1] });
  found.sort((a, b) => a.i - b.i);
  const hit = found.find((f) => /\.gif$/i.test(f.u.split('#')[0].split('?')[0]));
  if (!hit) return null;
  const u = hit.u;
  if (/^https?:\/\//i.test(u)) return u.replace(/^http:\/\//i, 'https://');
  if (u.startsWith('//')) return 'https:' + u;
  let path = u.replace(/^\.?\//, '');
  try { path = encodeURI(decodeURI(path)); } catch {}
  return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
}

const SMALL = new Set(['y', 'de', 'del', 'la', 'el', 'en', 'a', 'the', 'of', 'and']);
const ACR = { ai: 'AI', ia: 'IA', api: 'API', ui: 'UI', '3d': '3D' };
export function prettyTitle(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_.]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w, i) => {
      const l = w.toLowerCase();
      if (ACR[l]) return ACR[l];
      if (i && SMALL.has(l)) return l;
      return w[0].toUpperCase() + w.slice(1);
    })
    .join(' ');
}