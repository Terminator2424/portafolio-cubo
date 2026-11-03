export const MAX_PROJECTS = 20;

// Mientras más proyectos, más caras: cubo -> octaedro -> dodecaedro -> icosaedro
export const SHAPES = [
  { kind: 'cube', faces: 6, label: 'Cubo Rubik' },
  { kind: 'octa', faces: 8, label: 'Octaedro' },
  { kind: 'dodeca', faces: 12, label: 'Dodecaedro' },
  { kind: 'icosa', faces: 20, label: 'Icosaedro' },
];

export function shapeFor(n) {
  return SHAPES.find((s) => n <= s.faces) || SHAPES[SHAPES.length - 1];
}