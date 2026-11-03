'use client';

import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import GithubIcon from './GithubIcon';

const LANG_COLORS = {
  Java: '#f89820', JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3776ab',
  HTML: '#e34c26', CSS: '#a78bfa', PHP: '#777bb4', 'C#': '#68b723', 'C++': '#f34b7d',
  Kotlin: '#a97bff', Go: '#00add8', Rust: '#dea584', Shell: '#89e051',
};
const pad = (n) => String(n).padStart(2, '0');

function Body({ project, index, total, onClose, onPrev, onNext }) {
  const color = LANG_COLORS[project.language] || '#22d3ee';
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] tracking-[0.25em] text-cyan-300">
          PROYECTO {pad(index + 1)} / {pad(total)}
        </span>
        <button
          onClick={onClose}
          aria-label="Cerrar panel"
          className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:border-cyan-300 hover:text-cyan-300"
        >
          ✕
        </button>
      </div>

      <h2 className="mt-3 break-words text-2xl font-bold leading-tight md:text-3xl">{project.name}</h2>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-200">
        {project.featured && <span className="chip text-fuchsia-200">Más trabajado</span>}
        <span className="chip">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
          {project.language}
        </span>
        {project.stars > 0 && <span className="chip">★ {project.stars}</span>}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-[15px]">{project.description}</p>

      {project.topics?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.topics.slice(0, 6).map((t) => (
            <span key={t} className="chip font-mono text-[11px] text-cyan-200">#{t}</span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-neon">
          <GithubIcon /> {project.placeholder ? 'Ver mi perfil' : 'Ver en GitHub'}
        </a>
        {project.homepage && (
          <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Demo en vivo ↗
          </a>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-slate-400">
        <button onClick={onPrev} className="transition hover:text-cyan-300">← Anterior</button>
        <button onClick={onNext} className="transition hover:text-cyan-300">Siguiente →</button>
      </div>
    </motion.div>
  );
}

function Sheet(props) {
  const controls = useDragControls();
  return (
    <motion.aside
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 90 || info.velocity.y > 500) props.onClose();
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      className="glass absolute inset-x-0 bottom-0 z-20 max-h-[50svh] overflow-y-auto rounded-t-3xl px-5 pb-8 pt-2"
    >
      <div onPointerDown={(e) => controls.start(e)} className="touch-none cursor-grab py-2">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-white/30" />
      </div>
      <Body {...props} />
    </motion.aside>
  );
}

function Floating(props) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-6 z-20 flex items-center lg:right-12">
      <motion.aside
        initial={{ opacity: 0, x: 70, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 70, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 140, damping: 20 }}
        className="glass pointer-events-auto w-[420px] max-w-[42vw] rounded-3xl p-7"
      >
        <Body {...props} />
      </motion.aside>
    </div>
  );
}

export default function ProjectPanel({ project, isMobile, ...rest }) {
  return (
    <AnimatePresence>
      {project && (isMobile
        ? <Sheet key="sheet" project={project} {...rest} />
        : <Floating key="floating" project={project} {...rest} />)}
    </AnimatePresence>
  );
}