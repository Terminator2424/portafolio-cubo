'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { shapeFor } from '@/lib/shape';
import FaceLabel from './FaceLabel';

const V3 = THREE.Vector3;
const Z = new V3(0, 0, 1);
const Y = new V3(0, 1, 0);
const AXES = { x: new V3(1, 0, 0), y: Y, z: Z };
const HALF = Math.PI / 2;
const STEP = 2 / 3;
const CUBIE = 0.62;
const MOVE_TIME = 0.45;
const IDLE_PITCH = 0.32; // inclinación en reposo: deja ver un poco la cara de arriba
const PITCH_LIMIT = 1.45;

const NEON = ['#22d3ee', '#e879f9', '#a3e635', '#fb923c', '#818cf8', '#fb7185', '#2dd4bf', '#facc15', '#60a5fa', '#f472b6'];
const FACE_NORMALS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((a) => new V3(...a));
const ORDER = [4, 0, 5, 1, 2, 3]; // proyecto i -> cara del cubo (el 1.º al frente)
const POLY_SCALE = { octa: 0.72, dodeca: 0.62, icosa: 0.42 };

const noRaycast = () => null;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const randItem = (a) => a[Math.floor(Math.random() * a.length)];

// R lleva la normal hacia la cámara (+Z). L = R^-1 deja el texto derecho al quedar de frente.
function frameFor(n) {
  const R = new THREE.Quaternion().setFromUnitVectors(n, Z);
  return { normal: n.clone(), R, L: R.clone().invert() };
}

/* ---------- movimientos tipo Rubik ---------- */
function randomMove(prev) {
  let m;
  do {
    m = { axis: randItem(['x', 'y', 'z']), layer: randItem([-1, 1]), dir: randItem([-1, 1]) };
  } while (prev && m.axis === prev.axis && m.layer === prev.layer);
  return m;
}
const invert = (m) => ({ ...m, dir: -m.dir });
function buildSequence() {
  const seq = [];
  let prev = null;
  for (let i = 0; i < 3; i++) { prev = randomMove(prev); seq.push(prev); }
  return [...seq, { wait: 1.1 }, ...seq.slice().reverse().map(invert)];
}
function startMove(r, m) {
  const members = [];
  r.pos.forEach((p, i) => { if (Math.round(p[m.axis]) === m.layer) members.push(i); });
  r.move = { ...m, members, t: 0 };
}

/* ---------- poliedros (octaedro / dodecaedro / icosaedro) ---------- */
function buildPoly(kind) {
  const R = 1.5;
  const base =
    kind === 'octa' ? new THREE.OctahedronGeometry(R)
    : kind === 'dodeca' ? new THREE.DodecahedronGeometry(R)
    : new THREE.IcosahedronGeometry(R);

  const pos = base.attributes.position;
  const groups = [];
  const a = new V3(), b = new V3(), c = new V3(), ab = new V3(), ac = new V3(), n = new V3(), cen = new V3();

  for (let t = 0; t < pos.count; t += 3) {
    a.fromBufferAttribute(pos, t);
    b.fromBufferAttribute(pos, t + 1);
    c.fromBufferAttribute(pos, t + 2);
    n.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a)).normalize();
    cen.copy(a).add(b).add(c).divideScalar(3);
    if (n.dot(cen) < 0) n.negate();
    let g = groups.find((x) => x.normal.dot(n) > 0.999);
    if (!g) { g = { normal: n.clone(), tris: [] }; groups.push(g); }
    g.tris.push([a.clone(), b.clone(), c.clone()]);
  }

  const faces = groups.map((g) => {
    const centroid = g.normal.clone().multiplyScalar(g.normal.dot(g.tris[0][0]));
    const arr = [];
    g.tris.forEach((tri) =>
      tri.forEach((v) => {
        const p = v.clone().sub(centroid).multiplyScalar(0.93).add(centroid);
        arr.push(p.x, p.y, p.z);
      })
    );
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    geo.computeVertexNormals();
    return {
      normal: g.normal,
      centroid,
      geo,
      edges: new THREE.EdgesGeometry(geo, 5),
      labelPos: centroid.clone().addScaledVector(g.normal, 0.012).toArray(),
    };
  });

  faces.sort((p, q) => q.normal.dot(Z) - p.normal.dot(Z));
  return { core: base, faces };
}

/* ---------- anillos orbitales ---------- */
function Rings() {
  const a = useRef();
  const b = useRef();
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.35;
    if (b.current) b.current.rotation.z -= dt * 0.25;
  });
  return (
    <>
      <group rotation={[1.25, 0.25, 0]}>
        <group ref={a}>
          <mesh raycast={noRaycast}>
            <torusGeometry args={[2.35, 0.006, 8, 180]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} transparent opacity={0.8} />
          </mesh>
          <mesh position={[2.35, 0, 0]} raycast={noRaycast}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#a5f3fc" toneMapped={false} />
          </mesh>
        </group>
      </group>
      <group rotation={[-0.9, -0.5, 0.4]}>
        <group ref={b}>
          <mesh raycast={noRaycast}>
            <torusGeometry args={[2.1, 0.006, 8, 180]} />
            <meshBasicMaterial color="#e879f9" toneMapped={false} transparent opacity={0.75} />
          </mesh>
          <mesh position={[-2.1, 0, 0]} raycast={noRaycast}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#f5d0fe" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </>
  );
}

/* ---------- componente principal ---------- */
export default function ProjectCube({ projects, selected, onSelect, isMobile }) {
  const [hover, setHover] = useState(null);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  const shape = shapeFor(projects.length).kind;
  const poly = useMemo(() => (shape === 'cube' ? null : buildPoly(shape)), [shape]);
  useEffect(() => () => {
    if (!poly) return;
    poly.core.dispose();
    poly.faces.forEach((f) => { f.geo.dispose(); f.edges.dispose(); });
  }, [poly]);

  const frames = useMemo(
    () => projects.map((_, i) => frameFor(shape === 'cube' ? FACE_NORMALS[ORDER[i]] : poly?.faces[i]?.normal ?? Z)),
    [projects, shape, poly]
  );

  const mats = useMemo(
    () =>
      projects.map((p, i) => {
        const col = new THREE.Color(p.placeholder ? '#475569' : NEON[i % NEON.length]);
        const mk = (color, k) =>
          new THREE.MeshStandardMaterial({ color, emissive: col, emissiveIntensity: k, roughness: 0.35, metalness: 0.1 });
        return {
          side: mk(col, 0.5),
          center: mk(col.clone().lerp(new THREE.Color('#ffffff'), 0.25), 0.7),
        };
      }),
    [projects]
  );
  useEffect(() => () => mats.forEach((m) => { m.side.dispose(); m.center.dispose(); }), [mats]);

  // Piezas del cubo Rubik
  const cubies = useMemo(() => {
    if (shape !== 'cube') return [];
    const out = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          if (!x && !y && !z) continue;
          const stickers = [];
          [[x, 0, 0], [0, y, 0], [0, 0, z]].forEach(([nx, ny, nz]) => {
            if (!nx && !ny && !nz) return;
            const fi = FACE_NORMALS.findIndex((f) => f.x === nx && f.y === ny && f.z === nz);
            const n = FACE_NORMALS[fi];
            stickers.push({
              project: ORDER.indexOf(fi),
              quat: new THREE.Quaternion().setFromUnitVectors(Z, n),
              pos: n.clone().multiplyScalar(CUBIE / 2 + 0.003).toArray(),
              labelPos: n.clone().multiplyScalar(CUBIE / 2 + 0.012).toArray(),
              labelQuat: frameFor(n).L,
            });
          });
          out.push({ ix: x, iy: y, iz: z, pos: [x * STEP, y * STEP, z * STEP], stickers, center: stickers.length === 1 });
        }
    return out;
  }, [shape]);

  const rig = useRef({ objs: [], pos: [], quat: [], move: null, queue: [], wait: 0, idle: 1.4 });
  useEffect(() => {
    const r = rig.current;
    r.pos = cubies.map((c) => new V3(c.ix, c.iy, c.iz));
    r.quat = cubies.map(() => new THREE.Quaternion());
    r.move = null;
    r.queue = [];
  }, [cubies]);

  const group = useRef();
  const tilt = useRef();
  const faceRefs = useRef([]);
  const rot = useRef({
    yaw: 0.5,
    pitch: IDLE_PITCH,
    q0: new THREE.Quaternion(),
    q1: new THREE.Quaternion(),
    animating: false,
  });
  const drag = useRef({ active: false, moved: 0, x: 0, y: 0 });
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, 'YXZ'), []);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const tmpQ = useMemo(() => new THREE.Quaternion(), []);
  const tmpV = useMemo(() => new V3(), []);

  // Arrastrar para girar libremente (ver arriba y abajo del cubo)
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = 'pan-y'; // en móvil el scroll vertical de la página sigue funcionando
    const d = drag.current;
    const down = (e) => {
      if (selectedRef.current !== null) return;
      d.active = true;
      d.moved = 0;
      d.x = e.clientX;
      d.y = e.clientY;
    };
    const move = (e) => {
      if (!d.active) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.x = e.clientX;
      d.y = e.clientY;
      d.moved += Math.abs(dx) + Math.abs(dy);
      if (d.moved > 4) {
        rot.current.yaw += dx * 0.008;
        rot.current.pitch = THREE.MathUtils.clamp(rot.current.pitch + dy * 0.008, -PITCH_LIMIT, PITCH_LIMIT);
        document.body.style.cursor = 'grabbing';
      }
    };
    const up = () => {
      if (d.active && d.moved > 4) document.body.style.cursor = 'auto';
      d.active = false;
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [gl]);

  const wide = !isMobile && size.width >= 1100 && size.width / size.height >= 1.45;
  const layout = useMemo(() => {
    if (isMobile) return { idle: { px: 0, py: -0.95, s: 0.9 }, sel: { px: 0, py: 0.95, s: 0.78 } };
    if (wide) return { idle: { px: 0.8, py: 0, s: 1 }, sel: { px: -1.3, py: 0, s: 1 } };
    return { idle: { px: 0, py: -0.7, s: 0.95 }, sel: { px: -1.2, py: -0.2, s: 0.85 } };
  }, [isMobile, wide]);

  const [spring, api] = useSpring(() => ({
    t: 1, px: 0, py: 0, s: 0.2,
    config: { mass: 1, tension: 120, friction: 22, clamp: true },
  }));

  // Selección -> gira hasta dejar la cara al frente; sin selección vuelve a flotar
  useEffect(() => {
    const g = group.current;
    if (!g) return;
    const r = rot.current;
    r.q0.copy(g.quaternion);
    if (selected === null || !frames[selected]) {
      const e = new THREE.Euler().setFromQuaternion(r.q0, 'YXZ');
      r.yaw = e.y;
      r.pitch = IDLE_PITCH;
      r.q1.setFromEuler(euler.set(IDLE_PITCH, e.y, 0, 'YXZ'));
    } else {
      r.q1.copy(frames[selected].R);
    }
    r.animating = true;
    const t = selected === null ? layout.idle : layout.sel;
    api.start({
      from: { t: 0 },
      t: 1,
      px: t.px,
      py: t.py,
      s: t.s,
      onRest: (res) => { if (!res.cancelled) r.animating = false; },
    });
  }, [selected, layout, frames, api, euler]);

  useEffect(() => {
    document.body.style.cursor = hover !== null ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hover]);

  useFrame((state, dt) => {
    const g = group.current;
    const r = rot.current;
    const d = drag.current;

    // Rotación del conjunto: automática en Y (pausa con hover o arrastre) o animada hacia la cara elegida
    if (g) {
      if (r.animating) {
        g.quaternion.slerpQuaternions(r.q0, r.q1, THREE.MathUtils.clamp(spring.t.get(), 0, 1));
      } else if (selected === null) {
        if (!d.active && hover === null) {
          r.yaw += dt * 0.35;
          r.pitch = THREE.MathUtils.damp(r.pitch, IDLE_PITCH, 1.2, dt);
        }
        g.quaternion.setFromEuler(euler.set(r.pitch, r.yaw, 0, 'YXZ'));
      }
    }

    // Parallax con el puntero
    if (tilt.current) {
      const k = selected === null ? 0.18 : 0.06;
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, -state.pointer.y * k, 4, dt);
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, state.pointer.x * k, 4, dt);
    }

    // Brillo de las caras según hover / selección
    mats.forEach((m, i) => {
      const hot = hover === i || selected === i;
      const dim = selected !== null && selected !== i;
      const target = hot ? 1.3 : dim ? 0.18 : projects[i]?.placeholder ? 0.2 : 0.55;
      m.side.emissiveIntensity = THREE.MathUtils.damp(m.side.emissiveIntensity, target, 6, dt);
      m.center.emissiveIntensity = THREE.MathUtils.damp(m.center.emissiveIntensity, target * 1.3, 6, dt);
    });

    // Poliedros: la cara con hover/selección se levanta
    if (poly) {
      faceRefs.current.forEach((fg, i) => {
        if (!fg || !poly.faces[i]) return;
        const target = hover === i || selected === i ? 0.14 : 0;
        fg.userData.off = THREE.MathUtils.damp(fg.userData.off ?? 0, target, 8, dt);
        fg.position.copy(poly.faces[i].normal).multiplyScalar(fg.userData.off);
      });
    }

    // Cubo Rubik: mezcla 3 giros de capa, se queda revuelto y se resuelve solo
    if (shape === 'cube') {
      const rg = rig.current;
      if (rg.pos.length !== cubies.length) return;
      const speed = selected !== null ? 2.5 : 1;

      if (rg.move) {
        const m = rg.move;
        m.t = Math.min(1, m.t + (dt * speed) / MOVE_TIME);
        tmpQ.setFromAxisAngle(AXES[m.axis], m.dir * HALF * easeInOut(m.t));
        for (const i of m.members) {
          const o = rg.objs[i];
          if (!o) continue;
          o.position.copy(tmpV.copy(rg.pos[i]).applyQuaternion(tmpQ).multiplyScalar(STEP));
          o.quaternion.copy(tmpQ).multiply(rg.quat[i]);
        }
        if (m.t >= 1) {
          tmpQ.setFromAxisAngle(AXES[m.axis], m.dir * HALF);
          for (const i of m.members) {
            const p = rg.pos[i].applyQuaternion(tmpQ);
            p.set(Math.round(p.x), Math.round(p.y), Math.round(p.z));
            rg.quat[i].premultiply(tmpQ);
            const o = rg.objs[i];
            if (o) {
              o.position.copy(p).multiplyScalar(STEP);
              o.quaternion.copy(rg.quat[i]);
            }
          }
          rg.move = null;
        }
      } else if (rg.queue.length) {
        if (rg.wait > 0) rg.wait -= dt * speed;
        else {
          const it = rg.queue.shift();
          if (it.wait) rg.wait = it.wait;
          else startMove(rg, it);
        }
      } else if (selected === null && hover === null && !d.active) {
        rg.idle -= dt;
        if (rg.idle <= 0) {
          rg.queue = buildSequence();
          rg.idle = 2.4 + Math.random() * 2;
          rg.wait = 0;
        }
      }
    }
  });

  const pick = (e) => {
    const p = e.object?.userData?.project;
    return typeof p === 'number' && projects[p] ? p : null;
  };

  return (
    <animated.group position-x={spring.px} position-y={spring.py} scale={spring.s}>
      <Float speed={1.6} rotationIntensity={0} floatIntensity={0.45} floatingRange={[-0.08, 0.08]}>
        <group ref={tilt}>
          <Rings />

          <group
            ref={group}
            onPointerMove={(e) => {
              e.stopPropagation();
              if (drag.current.active && drag.current.moved > 4) return;
              const p = pick(e);
              if (p !== hover) setHover(p);
            }}
            onPointerOut={() => setHover(null)}
            onPointerUp={(e) => { if (e.nativeEvent?.pointerType === 'touch') setHover(null); }}
            onClick={(e) => {
              e.stopPropagation();
              if (drag.current.moved > 4) return; // fue un arrastre, no un clic
              const p = pick(e);
              if (p !== null) onSelect(p);
            }}
          >
            {/* ---- Cubo Rubik cibernético ---- */}
            {shape === 'cube' &&
              cubies.map((c, i) => (
                <group key={i} ref={(el) => { rig.current.objs[i] = el; }} position={c.pos}>
                  <RoundedBox args={[CUBIE, CUBIE, CUBIE]} radius={0.06} smoothness={3}>
                    <meshStandardMaterial color="#0a0720" metalness={0.85} roughness={0.28} />
                  </RoundedBox>
                  {c.stickers.map((s, k) => (
                    <group key={k}>
                      <mesh
                        position={s.pos}
                        quaternion={s.quat}
                        userData={{ project: s.project }}
                        material={c.center ? mats[s.project].center : mats[s.project].side}
                      >
                        <planeGeometry args={[0.5, 0.5]} />
                      </mesh>
                      {c.center && projects[s.project] && (
                        <group position={s.labelPos} quaternion={s.labelQuat}>
                          <FaceLabel project={projects[s.project]} index={s.project} />
                        </group>
                      )}
                    </group>
                  ))}
                </group>
              ))}

            {/* ---- Poliedros: más proyectos = más caras ---- */}
            {poly && (
              <>
                <mesh geometry={poly.core} scale={0.96} raycast={noRaycast}>
                  <meshStandardMaterial color="#0a0720" metalness={0.9} roughness={0.25} />
                </mesh>
                {poly.faces.map((f, i) =>
                  projects[i] ? (
                    <group key={i} ref={(el) => { faceRefs.current[i] = el; }}>
                      <mesh geometry={f.geo} material={mats[i].side} userData={{ project: i }} />
                      <lineSegments geometry={f.edges} raycast={noRaycast}>
                        <lineBasicMaterial color="#e0f2fe" toneMapped={false} />
                      </lineSegments>
                      <group position={f.labelPos} quaternion={frames[i].L} scale={POLY_SCALE[shape]}>
                        <FaceLabel project={projects[i]} index={i} compact />
                      </group>
                    </group>
                  ) : null
                )}
              </>
            )}
          </group>
        </group>
      </Float>
    </animated.group>
  );
}