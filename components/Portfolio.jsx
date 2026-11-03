'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import '@/app/extra.css';
import Nav from './Nav';
import ProjectPanel from './ProjectPanel';
import Sections from './Sections';
import { PROFILE } from '@/lib/profile';
import { shapeFor } from '@/lib/shape';

function SceneLoader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="loader-cube" />
      <p className="font-mono text-xs tracking-[0.35em] text-cyan-300/80">CARGANDO CUBO 3D…</p>
    </div>
  );
}

const Scene = dynamic(() => import('./Scene'), { ssr: false, loading: () => <SceneLoader /> });

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp - 1}px)`);
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [bp]);
  return mobile;
}

const ROLES = [
  'Ingeniería de Sistemas, octavo semestre',
  'Backend con Quarkus y Spring Boot',
  'Inteligencia artificial y modelos locales',
  'Redes y ciberseguridad',
  'Web en 3D con Three.js',
];

function RoleTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-8 items-center overflow-hidden font-mono text-sm text-cyan-200 md:h-9 md:text-lg">
      <span className="mr-2 text-fuchsia-400">{'>'}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -22, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-block"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
      <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-cyan-300" />
    </div>
  );
}

const TICKER = ['JAVA', 'QUARKUS', 'SPRING BOOT', 'PYTHON', 'IA LOCAL', 'REDES', 'CIBERSEGURIDAD', 'NEXT.JS', 'REACT NATIVE', 'THREE.JS', 'MYSQL', 'POSTGRESQL', 'DOCKER', 'GIT'];

export default function Portfolio({ projects, source }) {
  const [selected, setSelected] = useState(null);
  const isMobile = useIsMobile();
  const total = projects.length;
  const real = projects.filter((p) => !p.placeholder).length;
  const shape = shapeFor(total);

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(() => setSelected((s) => (s === null ? null : (s - 1 + total) % total)), [total]);
  const next = useCallback(() => setSelected((s) => (s === null ? null : (s + 1) % total)), [total]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, next, prev]);

  return (
    <main>
      <Nav />

      <section id="proyectos" className="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute inset-0">
          <Scene projects={projects} selected={selected} onSelect={setSelected} isMobile={isMobile} />
        </div>
        <div className="aurora" />

        {/* El texto se desvanece cuando hay un proyecto abierto para no encimarse con el cubo */}
        <div
          className={`pointer-events-none absolute left-0 top-0 z-10 max-w-3xl px-6 pt-24 transition-opacity duration-500 md:px-12 md:pt-32 ${
            selected !== null ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/80 md:text-xs"
          >
            {PROFILE.location} · {PROFILE.university}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
            className="title-glow mt-3 text-5xl font-bold leading-[0.95] md:text-7xl lg:text-8xl"
          >
            <span className="block">Hola, soy</span>
            <span className="gradient-text block">{PROFILE.short}</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-5">
            <RoleTicker />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-3 max-w-md text-sm text-slate-300 md:text-lg"
          >
            {PROFILE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="mt-5 flex flex-wrap gap-2"
          >
            <span className="chip font-mono text-[10px] text-slate-200 md:text-xs">
              <span className={`h-2 w-2 rounded-full ${source === 'github' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {source === 'github' ? 'En vivo desde GitHub' : 'Modo respaldo'}
            </span>
            <span className="chip font-mono text-[10px] text-fuchsia-200 md:text-xs">
              {real} {real === 1 ? 'proyecto' : 'proyectos'} · {shape.label}
            </span>
          </motion.div>
          <p className="mt-3 hidden max-w-sm font-mono text-[10px] leading-relaxed text-slate-500 md:block">
            Cada repo nuevo suma una cara: el cubo evoluciona a octaedro, dodecaedro e icosaedro.
          </p>
        </div>

        <ProjectPanel
          project={selected !== null ? projects[selected] : null}
          index={selected ?? 0}
          total={total}
          isMobile={isMobile}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />

        {selected === null && (
          <div className="floaty pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center font-mono text-[10px] tracking-[0.25em] text-slate-400 md:text-xs">
            {isMobile ? 'DESLIZA PARA GIRAR · TOCA UNA CARA' : 'ARRASTRA PARA GIRAR · CLIC EN UNA CARA'}
          </div>
        )}
      </section>

      <div className="marquee border-y border-white/10 bg-white/[0.02] py-4">
        <div className="marquee-track font-mono text-sm tracking-[0.3em] text-slate-400">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-12">
              {t} <span className="text-fuchsia-400">/</span>
            </span>
          ))}
        </div>
      </div>

      <Sections projects={projects} source={source} />
    </main>
  );
}