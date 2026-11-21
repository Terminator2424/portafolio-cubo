'use client';

import { useState } from 'react';

const stroke = { fill: 'none', stroke: 'url(#sg)', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const mono = { fill: '#cbd5e1', fontSize: 11, fontFamily: 'monospace', textAnchor: 'middle' };

const Pulse = ({ x, y, r = 5, d = 0 }) => (
  <circle cx={x} cy={y} r={r} fill="url(#sg)">
    <animate attributeName="opacity" values="0.35;1;0.35" dur="2.6s" begin={`${d}s`} repeatCount="indefinite" />
  </circle>
);

const ARTS = {
  neural: () => {
    const layers = [3, 5, 5, 3];
    const xs = [45, 125, 205, 285];
    const nodes = layers.map((n, li) => Array.from({ length: n }, (_, i) => ({ x: xs[li], y: 100 + (i - (n - 1) / 2) * 34 })));
    return (
      <>
        <g stroke="url(#sg)" strokeOpacity="0.28" strokeWidth="1">
          {nodes.slice(0, -1).flatMap((layer, li) =>
            layer.flatMap((a, ai) => nodes[li + 1].map((b, bi) => <line key={`${li}-${ai}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />))
          )}
        </g>
        {nodes.flat().map((n, i) => <Pulse key={i} x={n.x} y={n.y} d={(i % 7) * 0.25} />)}
      </>
    );
  },
  layers: () => (
    <>
      <g {...stroke}>
        <rect x="30" y="22" width="260" height="38" rx="10" />
        <rect x="60" y="80" width="200" height="38" rx="10" />
        <rect x="90" y="138" width="140" height="38" rx="10" />
        <path d="M160 60v20M160 118v20" strokeDasharray="4 4" />
      </g>
      <g {...mono}>
        <text x="160" y="46">INTERFAZ</text>
        <text x="160" y="104">DOMINIO</text>
        <text x="160" y="162">INFRAESTRUCTURA</text>
      </g>
    </>
  ),
  cube: () => (
    <>
      <g {...stroke}>
        <path d="M160 40 L214 70 L214 130 L160 160 L106 130 L106 70 Z" />
        <path d="M160 100 L160 160 M160 100 L106 70 M160 100 L214 70" />
        <ellipse cx="160" cy="100" rx="128" ry="34" transform="rotate(-18 160 100)" strokeOpacity="0.55" />
      </g>
      <Pulse x={282} y={60} />
    </>
  ),
  network: () => (
    <>
      <g {...stroke}>
        <path d="M160 34 L220 58 V106 C220 140 190 162 160 174 C130 162 100 140 100 106 V58 Z" />
        <circle cx="160" cy="98" r="13" />
        <path d="M160 111 V130" />
        <path d="M100 70 L50 50 M100 110 L50 130 M220 70 L270 50 M220 110 L270 130" strokeDasharray="4 4" strokeOpacity="0.6" />
      </g>
      {[[44, 48], [44, 132], [276, 48], [276, 132]].map(([x, y], i) => <Pulse key={i} x={x} y={y} d={i * 0.4} />)}
    </>
  ),
  mobile: () => (
    <g {...stroke}>
      <rect x="112" y="18" width="96" height="164" rx="16" />
      <path d="M146 30h28" />
      <rect x="126" y="48" width="68" height="26" rx="6" />
      <path d="M126 90h68M126 104h48" strokeOpacity="0.6" />
      <path d="M134 160v-24M150 160v-34M166 160v-18M182 160v-40" strokeWidth="5" />
      <path d="M60 70h32M228 70h32M60 110h32M228 110h32" strokeDasharray="4 4" strokeOpacity="0.5" />
    </g>
  ),
  web: () => (
    <>
      <g {...stroke}>
        <rect x="30" y="28" width="260" height="144" rx="12" />
        <path d="M30 56h260" />
        <rect x="48" y="74" width="100" height="16" rx="4" />
        <path d="M48 104h130M48 118h104M48 132h120" strokeOpacity="0.6" />
        <rect x="196" y="74" width="76" height="76" rx="8" />
      </g>
      <Pulse x={46} y={42} r={3.5} />
      <Pulse x={60} y={42} r={3.5} d={0.3} />
      <Pulse x={74} y={42} r={3.5} d={0.6} />
    </>
  ),
  game: () => (
    <g {...stroke}>
      <rect x="62" y="64" width="196" height="84" rx="42" />
      <path d="M104 94v28M90 108h28" />
      <circle cx="212" cy="96" r="7" />
      <circle cx="234" cy="114" r="7" />
      <path d="M140 108h12M168 108h12" strokeOpacity="0.6" />
    </g>
  ),
  data: () => (
    <g {...stroke}>
      <ellipse cx="160" cy="52" rx="62" ry="15" />
      <path d="M98 52v96c0 8 28 15 62 15s62-7 62-15V52" />
      <path d="M98 84c0 8 28 15 62 15s62-7 62-15M98 116c0 8 28 15 62 15s62-7 62-15" strokeOpacity="0.7" />
    </g>
  ),
  graph: () => {
    const pts = [[60, 60], [140, 36], [250, 70], [200, 130], [110, 150], [160, 95], [280, 150]];
    const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [3, 6]];
    return (
      <>
        <g stroke="url(#sg)" strokeOpacity="0.45" strokeWidth="1.2">
          {links.map(([a, b], i) => <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />)}
        </g>
        {pts.map(([x, y], i) => <Pulse key={i} x={x} y={y} r={i === 5 ? 7 : 5} d={i * 0.3} />)}
      </>
    );
  },
};

function Drawing({ art }) {
  const draw = ARTS[art] || ARTS.graph;
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full p-4" aria-hidden="true">
      <defs>
        <linearGradient id="sg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="320" y2="200">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      {draw()}
    </svg>
  );
}

// Dibujo por defecto. Si el repo tiene GIF, se pide solo al pasar el mouse o tocar, y se funde sobre el dibujo.
export default function SystemArt({ s }) {
  const [live, setLive] = useState(false);
  const [broken, setBroken] = useState(false);

  if (s.image) {
    return <img src={s.image} alt={s.title} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />;
  }

  const hasGif = s.gif && !broken;
  return (
    <div className="relative h-full w-full" onMouseEnter={() => setLive(true)} onTouchStart={() => setLive(true)}>
      <Drawing art={s.art} />
      {hasGif && (
        <>
          {live && (
            <img
              src={s.gif}
              alt={`Demo de ${s.title}`}
              loading="lazy"
              decoding="async"
              onError={() => setBroken(true)}
              className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition duration-500 group-hover:opacity-100"
            />
          )}
          <span className="chip pointer-events-none absolute bottom-3 right-3 font-mono text-[10px] text-fuchsia-200">▶ DEMO</span>
        </>
      )}
    </div>
  );
}