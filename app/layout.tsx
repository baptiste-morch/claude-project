import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baptiste Morch — Créons des liens improbables',
  description:
    "Visionnaire stratégique, développement de partenariats et accompagnement numérique au service des organisations à vocation sociale, environnementale, citoyenne ou de santé.",
  metadataBase: new URL('https://baptistemorch.com'),
  openGraph: {
    title: 'Baptiste Morch — Créons des liens improbables',
    description:
      "Visionnaire stratégique · Développement de partenariats · Accompagnement numérique.",
    locale: 'fr_CA',
    type: 'website',
  },
};

// Fonts pour l'univers Morch (CV) — Bricolage Grotesque, Hanken Grotesk, Instrument Serif
const MORCH_FONTS =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap';

// Fonts pour l'univers Maisonnée (/famille) — Fraunces, Newsreader, Inter, DM Mono
const MAISONNEE_FONTS =
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={MORCH_FONTS} />
        <link rel="stylesheet" href={MAISONNEE_FONTS} />
      </head>
      <body>{children}</body>
    </html>
  );
}
