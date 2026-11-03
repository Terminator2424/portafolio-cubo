'use client';

import { motion } from 'framer-motion';
import GithubIcon from './GithubIcon';
import { PROFILE, SKILLS } from '@/lib/profile';
import { SYSTEMS } from '@/lib/systems';

const fade = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

function Block({ id, kicker, title, children }) {
  return (
    <motion.section
      id={id}
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="mx-auto max-w-6xl px-6 py-24 md:px-12"
    >
      <p className="font-mono text-xs tracking-[0.3em] text-cyan-300">{kicker}</p>
      <h2 className="mt-2 text-3xl font-bold md:text-5xl">
        <span className="gradient-text">{title}</span>
      </h2>
      <div className="mt-10">{children}</div>
    </motion.section>
  );
}

/* Ilustración: capas de arquitectura */
function LayersArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full p-4">
      <defs>
        <linearGradient id="bp" x1="0" x2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#bp)" strokeWidth="1.5">
        <rect x="30" y="22" width="260" height="38" rx="10" />
        <rect x="60" y="80" width="200" height="38" rx="10" />
        <rect x="90" y="138" width="140" height="38" rx="10" />
        <path d="M160 60v20M160 118v20" strokeDasharray="4 4" />
      </g>
      <g fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle">
        <text x="160" y="46">INTERFAZ</text>
        <text x="160" y="104">DOMINIO</text>
        <text x="160" y="162">INFRAESTRUCTURA</text>
      </g>
    </svg>
  );
}

/* Ilustración: red neuronal (decorativa) */
function NeuralArt() {
  const layers = [3, 5, 5, 3];
  const xs = [45, 125, 205, 285];
  const nodes = layers.map((n, li) =>
    Array.from({ length: n }, (_, i) => ({ x: xs[li], y: 100 + (i - (n - 1) / 2) * 34 }))
  );
  return (
    <svg viewBox="0 0 330 200" className="h-full w-full p-4">
      <defs>
        <linearGradient id="nn" x1="0" x2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <g stroke="url(#nn)" strokeOpacity="0.28" strokeWidth="1">
        {nodes.slice(0, -1).map((layer, li) =>
          layer.flatMap((a, ai) =>
            nodes[li + 1].map((b, bi) => <line key={`${li}-${ai}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />)
          )
        )}
      </g>
      {nodes.flat().map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="5" fill="url(#nn)">
          <animate attributeName="opacity" values="0.35;1;0.35" dur="2.6s" begin={`${(i % 7) * 0.25}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function Art({ s }) {
  if (s.image) {
    return <img src={s.image} alt={s.title} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />;
  }
  return s.art === 'neural' ? <NeuralArt /> : <LayersArt />;
}

function Tags({ tags }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((t) => (
        <span key={t} className="chip font-mono text-[11px] text-cyan-200">{t}</span>
      ))}
    </div>
  );
}

function FeaturedSystem({ s }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="glass group relative overflow-hidden rounded-3xl md:col-span-2">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[90px]" />
      <div className="grid md:grid-cols-5">
        <div className="relative min-h-[220px] bg-gradient-to-br from-indigo-950 via-[#0b0820] to-fuchsia-950 md:col-span-2">
          <Art s={s} />
        </div>
        <div className="relative p-7 md:col-span-3 md:p-9">
          <span className="chip font-mono text-[10px] tracking-[0.2em] text-fuchsia-200">EL MÁS TRABAJADO</span>
          <h3 className="mt-4 text-3xl font-bold md:text-4xl">{s.title}</h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">{s.kind}</p>
          <p className="mt-4 leading-relaxed text-slate-300 md:text-lg">{s.description}</p>
          <Tags tags={s.tags} />
          {s.repo && (
            <a href={s.repo} target="_blank" rel="noopener noreferrer" className="btn-neon mt-6 text-sm">
              <GithubIcon className="h-4 w-4" /> Ver repositorio
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function SystemCard({ s }) {
  return (
    <motion.article whileHover={{ y: -8 }} className="glass group overflow-hidden rounded-3xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-950 via-[#0b0820] to-fuchsia-950">
        <Art s={s} />
        <span className="chip absolute left-3 top-3 font-mono text-[10px] text-cyan-200">{s.kind}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold md:text-2xl">{s.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{s.description}</p>
        <Tags tags={s.tags} />
        {s.repo && (
          <a href={s.repo} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-5 text-sm">
            <GithubIcon className="h-4 w-4" /> Ver repositorio
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function Sections({ projects, source }) {
  const real = projects.filter((p) => !p.placeholder).length;
  const { contact } = PROFILE;

  const stats = [
    [String(real), 'proyectos en el cubo'],
    [source === 'github' ? 'EN VIVO' : 'RESPALDO', 'datos desde GitHub'],
    ['8', 'semestre de Ingeniería de Sistemas'],
  ];

  const links = [
    ['Correo', contact.email, `mailto:${contact.email}`, '@'],
    ['WhatsApp', contact.phone, contact.whatsapp, 'WA'],
    ['GitHub', contact.github.replace('https://', ''), contact.github, null],
    contact.linkedin.includes('TU_USUARIO') ? null : ['LinkedIn', contact.linkedin.replace('https://www.', ''), contact.linkedin, 'in'],
  ].filter(Boolean);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

      <Block id="sobre-mi" kicker="01 · SOBRE MÍ" title="Quién soy">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="space-y-5 text-base leading-relaxed text-slate-300 md:col-span-3 md:text-lg">
            {PROFILE.about.map((p) => <p key={p}>{p}</p>)}
            <p className="font-mono text-sm text-cyan-300/90">
              {PROFILE.university} · {PROFILE.location}
            </p>
          </div>
          <div className="grid gap-4 md:col-span-2">
            {stats.map(([n, label]) => (
              <motion.div key={label} whileHover={{ scale: 1.03, x: 6 }} className="glass flex items-center gap-5 rounded-2xl p-5">
                <span className="gradient-text text-3xl font-bold md:text-4xl">{n}</span>
                <span className="text-sm text-slate-300">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Block>

      <Block id="sistemas" kicker="02 · SISTEMAS" title="Sistemas que he diseñado">
        <div className="grid gap-6 md:grid-cols-2">
          {SYSTEMS.map((s) => (s.featured ? <FeaturedSystem key={s.title} s={s} /> : <SystemCard key={s.title} s={s} />))}
        </div>
      </Block>

      <Block id="habilidades" kicker="03 · HABILIDADES" title="Mi stack">
        <div className="grid gap-6 md:grid-cols-2">
          {SKILLS.map((g) => (
            <motion.div key={g.group} whileHover={{ y: -6 }} className="glass rounded-3xl p-6">
              <h3 className="font-mono text-sm tracking-[0.2em] text-violet-300">{g.group.toUpperCase()}</h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {g.items.map((s) => (
                  <span key={s} className="chip text-sm text-slate-100">{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Block>

      <Block id="contacto" kicker="04 · CONTACTO" title="Hablemos">
        <p className="max-w-xl text-slate-300 md:text-lg">
          ¿Tienes una idea, una práctica o un proyecto en mente? Escríbeme y lo construimos.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {links.map(([label, text, href, icon]) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              
              className="glass group flex min-w-0 items-center gap-4 overflow-hidden rounded-2xl p-5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 font-bold text-[#05010f]">
                {icon ?? <GithubIcon />}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] tracking-[0.2em] text-slate-400">{label.toUpperCase()}</span>
                <span className="block truncate text-sm text-slate-100 group-hover:text-cyan-300">{text}</span>
              </span>
            </motion.a>
          ))}
        </div>
      </Block>

      <footer className="border-t border-white/10 px-6 py-8 text-center font-mono text-xs text-slate-500">
        Hecho con Next.js y React Three Fiber · © {new Date().getFullYear()} {PROFILE.short}
      </footer>
    </div>
  );
}
