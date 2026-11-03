'use client';

import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import ProjectCube from './ProjectCube';

// Aleja la cámara según el aspect ratio para que el cubo siempre quepa (móvil incluido)
function ResponsiveRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const t = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const zH = 4.6 / t;
    const zW = 4.8 / (t * aspect);
    camera.position.set(0, 0, Math.max(zH, zW));
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function Scene({ projects, selected, onSelect, isMobile }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={['#05010f']} />
      <fog attach="fog" args={['#05010f', 14, 40]} />
      <ResponsiveRig />

      <ambientLight intensity={0.7} />
      <pointLight position={[5, 4, 5]} intensity={70} color="#22d3ee" />
      <pointLight position={[-5, -3, 4]} intensity={60} color="#e879f9" />
      <pointLight position={[0, 6, -4]} intensity={40} color="#818cf8" />

      <Stars radius={60} depth={50} count={isMobile ? 1500 : 4000} factor={4} saturation={0.6} fade speed={1} />
      <Sparkles count={isMobile ? 40 : 90} scale={[9, 6, 6]} size={3} speed={0.4} color="#67e8f9" />

      <Suspense fallback={null}>
        <ProjectCube projects={projects} selected={selected} onSelect={onSelect} isMobile={isMobile} />
      </Suspense>

      <EffectComposer multisampling={4}>
        <Bloom intensity={0.9} luminanceThreshold={0.4} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}