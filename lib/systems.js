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
      'Facturación con las reglas de la DIAN (IVA 19 % y ReteIVA 15 %). Arquitectura hexagonal sobre Quarkus, vistas con Qute, MySQL, reportes, facturas en PDF y login con roles. Repositorio privado.',
    tags: ['Quarkus', 'Hexagonal', 'Qute', 'MySQL'],
    image: null,
    art: 'layers',
    repo: null,
  },
  {
    title: 'Optimización de rutas',
    kind: 'Algoritmos',
    description:
      'Ordena la visita a restaurantes reales de un dataset de Kaggle con Hill Climbing. Pasó de 73,47 km a 33,33 km en 423 iteraciones, una mejora del 54,64 %.',
    tags: ['Python', 'Hill Climbing', 'Kaggle'],
    image: null,
    art: 'neural',
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
  {
    title: 'Latinoamérica Comparte',
    kind: 'Plataforma web',
    description:
      'Plataforma web hecha con Spring Boot, con controladores, DAOs, entidades, DTOs y una capa de seguridad con filtros. Integra el trabajo de varias asignaturas del semestre.',
    tags: ['Spring Boot', 'Java', 'Seguridad'],
    image: null,
    art: 'layers',
    repo: null,
  },
];