import './globals.css';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const sans = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'Edison Gonzalez | Portafolio',
  description:
    'Portafolio de Edison Gonzalez, estudiante de Ingeniería de Sistemas: backend, inteligencia artificial, redes y web en 3D.',
  openGraph: {
    title: 'Edison Gonzalez | Portafolio',
    description: 'Backend, inteligencia artificial, redes y web en 3D. Universidad Santo Tomás, Tunja.',
    type: 'website',
    locale: 'es_CO',
  },
};

export const viewport = { themeColor: '#05010f' };

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}