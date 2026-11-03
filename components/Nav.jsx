'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const INITIALS = 'EG';

const LINKS = [
  ['Proyectos', 'proyectos'],
  ['Sobre mí', 'sobre-mi'],
  ['Sistemas', 'sistemas'],
  ['Habilidades', 'habilidades'],
];

export default function Nav() {
  const [active, setActive] = useState('proyectos');
  const [hover, setHover] = useState(null);

  // Resalta la sección que está en pantalla
  useEffect(() => {
    const ids = [...LINKS.map(([, id]) => id), 'contacto'];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const current = hover ?? active;

  return (
    <header className="fixed inset-x-0 top-3 z-30 flex justify-center px-3 md:top-4 md:px-8">
      <nav className="flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#0b0820]/60 p-1.5 shadow-[0_0_40px_rgba(99,102,241,0.15)] backdrop-blur-xl">
        <a href="#proyectos" aria-label="Inicio" className="group">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 font-mono text-sm font-bold text-[#05010f] shadow-[0_0_24px_rgba(139,92,246,0.6)] transition duration-300 group-hover:rotate-12 group-hover:scale-105">
            {INITIALS}
          </span>
        </a>

        <div className="flex items-center gap-1">
          <ul className="flex items-center gap-0.5" onMouseLeave={() => setHover(null)}>
            {LINKS.map(([label, id], i) => {
              const on = current === id;
              return (
                <li key={id} className={`relative ${i >= 2 ? 'hidden md:block' : ''}`}>
                  <a
                    href={`#${id}`}
                    onMouseEnter={() => setHover(id)}
                    className={`relative z-10 block rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors md:px-4 md:text-[11px] ${
                      on ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </a>
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/10 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <a href="#contacto" className="group relative ml-1 inline-flex overflow-hidden rounded-full p-[1.5px] md:ml-2">
            <span className="absolute -inset-[300%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,#22d3ee,#a78bfa,#f472b6,#22d3ee)]" />
            <span className="relative flex items-center gap-2 rounded-full bg-[#090620] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition group-hover:bg-[#090620]/60 md:px-5 md:text-[11px]">
              Contacto
              <span className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}