# Portafolio 3D

Mi portafolio personal. En la página principal hay un cubo Rubik que gira y se mezcla solo. Cada cara es uno de mis repositorios de GitHub: al hacer clic en una cara se abre un panel con la descripción, el lenguaje y el enlace al repositorio.

Debajo del cubo hay secciones con quién soy, algunos de los sistemas que he diseñado, mi stack y mis datos de contacto.

## Cómo funciona

- Los proyectos se leen desde la API de GitHub en el servidor (`lib/github.js`) y se refrescan cada hora. Si subo un repositorio nuevo con descripción, aparece solo.
- Se ignoran los repositorios privados, los forks, los que no tienen descripción, el repositorio de mi perfil y los que estén en la lista `EXCLUDE`.
- Primero van los de la lista `FEATURED`, en ese orden. Después se ordenan por tamaño del repositorio y entran los primeros `TOP_PROJECTS`.
- Si hay menos proyectos que caras, las que sobran muestran "Próximamente".
- Si la API de GitHub falla, se usan los proyectos de respaldo de `lib/profile.js`.
- Si el cubo recibe más de seis proyectos, cambia de forma: octaedro, dodecaedro e icosaedro.

## Qué editar

| Archivo | Para qué |
|---|---|
| `lib/profile.js` | Mi nombre, bio, contacto, habilidades, y las listas `FEATURED`, `EXCLUDE` y `TOP_PROJECTS` |
| `lib/systems.js` | Las tarjetas de la sección de sistemas |
| `components/Portfolio.jsx` | Textos del inicio y cinta de tecnologías |
| `public/systems/` | Capturas para las tarjetas de sistemas |

## Ejecutar en local

```bash
npm install
npm run dev
```

La página queda en http://localhost:3000. Para comprobar que compila: `npm run build`.

Opcional: crear un archivo `.env.local` con `GITHUB_TOKEN=...` (un token de solo lectura de repositorios públicos). Sin token, GitHub limita las consultas y a veces se muestran los proyectos de respaldo.

## Tecnologías

Next.js 14, React 18, three.js con React Three Fiber y drei, postprocessing, react-spring, Framer Motion y Tailwind CSS.

## Publicación

Está desplegado en Vercel. Cada `git push` a la rama `main` publica una versión nueva.