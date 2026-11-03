export const GITHUB_USER = 'Terminator2424';
// Van primero en el cubo, en este orden. Después se ordena por tamaño del repo.
// Van primero en el cubo, en este orden. Después se ordena por tamaño del repo.
export const FEATURED = ['local-ai-studio', 'finzen'];
// Repos que nunca aparecen en el cubo (se comparan sin mayúsculas ni símbolos).
export const EXCLUDE = ['neurito', 'instagram', 'portafolio-cubo'];
// Cuántos repos entran al cubo. Con 6 es cubo; con 8, 12 o 20 pasa a octaedro, dodecaedro o icosaedro.
export const TOP_PROJECTS = 6;
// Repos que nunca aparecen en el cubo (se comparan sin mayúsculas ni símbolos).
// Cuántos repos entran al cubo. Con 6 es cubo; con 8, 12 o 20 pasa a octaedro, dodecaedro o icosaedro.

export const PROFILE = {
  name: 'Edison Javier Gonzalez Velosa',
  short: 'Edison',
  role: 'Estudiante de Ingeniería de Sistemas',
  tagline: 'Estudiante de Ingeniería de Sistemas. Hago backend, inteligencia artificial y web.',
  location: 'Tunja, Colombia',
  university: 'Universidad Santo Tomás',
  about: [
    'Soy estudiante de Ingeniería de Sistemas en la Universidad Santo Tomás, Seccional Tunja, y voy en octavo semestre.',
    'Trabajo sobre todo con backend (Java, Quarkus, Spring Boot, arquitectura hexagonal) y con inteligencia artificial en Python. También hago web y móvil con React, Next.js y React Native.',
    'Estudié redes y seguridad, y me gusta entender cómo funciona un sistema completo, no solo el código. También me gusta hablar en público: explicar lo que construyo es parte del trabajo.',
  ],
  contact: {
    email: 'edisonjgv@gmail.com',
    phone: '311 586 7274',
    whatsapp: 'https://wa.me/573115867274',
    github: `https://github.com/${GITHUB_USER}`,
    linkedin: 'https://www.linkedin.com/in/edison-gonzalez-445945448/',
  },
};

export const SKILLS = [
  { group: 'Lenguajes', items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C/C++'] },
  { group: 'Backend y bases de datos', items: ['Quarkus', 'Spring Boot', 'Arquitectura hexagonal', 'MySQL', 'PostgreSQL', 'SQLite'] },
  { group: 'Web y móvil', items: ['HTML', 'React', 'Next.js', 'React Native', 'Three.js', 'Tailwind CSS'] },
  { group: 'Inteligencia artificial', items: ['Ollama', 'RAG', 'Stable Diffusion'] },
  { group: 'Redes y seguridad', items: ['Cisco Packet Tracer', 'Subnetting', 'TCP/IP, DNS, DHCP', 'Wireshark', 'Kali Linux', 'JWT y hashing'] },
  { group: 'Herramientas', items: ['Git y GitHub', 'GitHub Actions', 'Docker', 'Linux', 'VS Code'] },
];

// Se usan si la API de GitHub falla o para completar caras si hay pocos repos.
export const FALLBACK_PROJECTS = [
  {
    id: 'fb-local-ai-studio',
    name: 'local-ai-studio',
    description: 'IA que corre en el propio computador, con chat, preguntas sobre documentos y generación de imágenes.',
    language: 'Python',
    topics: ['ollama', 'rag', 'privacy'],
    url: `https://github.com/${GITHUB_USER}/local-ai-studio`,
    stars: 0,
  },
  {
    id: 'fb-finzen',
    name: 'Finzen',
    description: 'App de finanzas personales que funciona sin conexión y lee las notificaciones del teléfono.',
    language: 'TypeScript',
    topics: ['react-native', 'expo', 'sqlite'],
    url: `https://github.com/${GITHUB_USER}/Finzen`,
    stars: 0,
  },
  {
    id: 'fb-no-lo-presiones',
    name: 'no-lo-presiones-licorera-boyaca',
    description: 'Juego de navegador sobre la historia de la Licorera de Boyacá, con modo en línea por WebRTC.',
    language: 'HTML',
    topics: ['canvas', 'webrtc'],
    url: `https://github.com/${GITHUB_USER}/no-lo-presiones-licorera-boyaca`,
    stars: 0,
  },
];
