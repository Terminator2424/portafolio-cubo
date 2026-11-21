// Sistemas que he diseñado. Las capturas van en public/systems/ y se referencian así: image: '/systems/archivo.png'
// art: 'neural' | 'layers' (ilustración que se muestra si no hay imagen). repo: null oculta el botón.
export const SYSTEMS = [
  {
    title: 'Local AI Studio',
    kind: 'IA en local',
    featured: true,
    description:
      'Aplicación para usar modelos de IA en el propio computador, sin enviar datos a terceros. Chat con Ollama, preguntas sobre documentos propios (RAG) y generación de imágenes. Tiene pruebas, integración continua y revisión de secretos antes de cada commit.',
    tags: ['Python', 'Ollama', 'RAG', 'Stable Diffusion'],
    image: null,
    art: 'neural',
    repo: 'https://github.com/Terminator2424/local-ai-studio',
  },
  {
    title: 'FacturaDIAN',
    kind: 'Facturación electrónica',
    description:
      'Facturación con las reglas de la DIAN (IVA 19 % y ReteIVA 15 %). Arquitectura hexagonal sobre Quarkus, vistas con Qute, MySQL, reportes, facturas en PDF y login con roles.',
    tags: ['Quarkus', 'Hexagonal', 'Qute', 'MySQL'],
    image: null,
    art: 'layers',
    repo: null,
  },
  {
    title: 'Finzen',
    kind: 'App móvil de finanzas',
    description:
      'App de finanzas personales que funciona sin conexión, es privada y registra movimientos leyendo las notificaciones del teléfono. Está organizada como monorepo (app móvil y paquetes) y el APK se compila con GitHub Actions.',
    tags: ['TypeScript', 'React Native', 'Expo', 'SQLite'],
    image: null,
    art: 'layers',
    repo: 'https://github.com/Terminator2424/Finzen',
  },
];