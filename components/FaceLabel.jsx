'use client';

import { Text } from '@react-three/drei';

const FONT_TITLE = '/fonts/ChakraPetch-Bold.woff';
const FONT_MONO = '/fonts/JetBrainsMono-Medium.woff';
const noRaycast = () => null;
const pad = (n) => String(n).padStart(2, '0');

const titleOf = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_.]+/g, ' ').trim().toUpperCase();

// Estima cuántas líneas ocupará el título para dimensionar la placa
function countLines(title, fs, maxWidth) {
  const perLine = Math.max(4, Math.floor(maxWidth / (fs * 0.6)));
  let lines = 1;
  let cur = 0;
  for (const w of title.split(' ')) {
    if (cur === 0) cur = w.length;
    else if (cur + 1 + w.length > perLine) { lines++; cur = w.length; }
    else cur += 1 + w.length;
    while (cur > perLine) { lines++; cur -= perLine; }
  }
  return lines;
}

export default function FaceLabel({ project, index, compact }) {
  const title = titleOf(project.name);
  const longest = Math.max(...title.split(' ').map((w) => w.length));
  const fs = (compact ? 0.22 : 0.27) * Math.min(1, 8 / longest);
  const maxWidth = 1.5;

  if (compact) {
    return (
      <group>
        <Text
          font={FONT_TITLE}
          raycast={noRaycast}
          renderOrder={3}
          position={[0, 0.05, 0]}
          fontSize={fs}
          maxWidth={1.55}
          lineHeight={1.05}
          letterSpacing={0.03}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          overflowWrap="break-word"
          color="#ffffff"
          outlineWidth={0.006}
          outlineColor="#000000"
          outlineOpacity={0.6}
        >
          {title}
        </Text>
        <Text font={FONT_MONO} raycast={noRaycast} renderOrder={3} position={[0, -0.42, 0]} fontSize={0.11} anchorX="center" anchorY="middle" color="#ffffff" fillOpacity={0.75} letterSpacing={0.2}>
          {pad(index + 1)}
        </Text>
      </group>
    );
  }

  const lines = countLines(title, fs, maxWidth);
  const h = lines * fs * 1.2 + 0.24;
  const w = 1.62;
  const cy = 0.04;

  return (
    <group>
      {/* placa oscura + líneas neón */}
      <mesh raycast={noRaycast} renderOrder={1} position={[0, cy, -0.003]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#04010d" transparent opacity={0.62} depthWrite={false} />
      </mesh>
      <mesh raycast={noRaycast} renderOrder={2} position={[0, cy + h / 2, -0.002]}>
        <planeGeometry args={[w, 0.012]} />
        <meshBasicMaterial color="#67e8f9" toneMapped={false} />
      </mesh>
      <mesh raycast={noRaycast} renderOrder={2} position={[0, cy - h / 2, -0.002]}>
        <planeGeometry args={[w, 0.012]} />
        <meshBasicMaterial color="#e879f9" toneMapped={false} />
      </mesh>

      <Text
        font={FONT_TITLE}
        raycast={noRaycast}
        renderOrder={3}
        position={[0, cy, 0]}
        fontSize={fs}
        maxWidth={maxWidth}
        lineHeight={1.08}
        letterSpacing={0.03}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        overflowWrap="break-word"
        color="#ffffff"
        outlineWidth={0.005}
        outlineColor="#000000"
        outlineOpacity={0.55}
      >
        {title}
      </Text>

      <Text font={FONT_MONO} raycast={noRaycast} renderOrder={3} position={[-0.82, 0.82, 0]} fontSize={0.13} anchorX="left" anchorY="top" color="#ffffff" fillOpacity={0.9} letterSpacing={0.18}>
        {pad(index + 1)}
      </Text>
      <Text font={FONT_MONO} raycast={noRaycast} renderOrder={3} position={[-0.82, -0.82, 0]} fontSize={0.105} anchorX="left" anchorY="bottom" color="#ffffff" fillOpacity={0.92} letterSpacing={0.12}>
        {`// ${String(project.language).toUpperCase()}`}
      </Text>
      <Text font={FONT_MONO} raycast={noRaycast} renderOrder={3} position={[0.82, -0.82, 0]} fontSize={0.1} anchorX="right" anchorY="bottom" color="#ffffff" fillOpacity={0.7} letterSpacing={0.16}>
        ABRIR ›
      </Text>
    </group>
  );
}