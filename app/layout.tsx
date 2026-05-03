import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baptiste Morch',
  description: 'Page personnelle de Baptiste Morch.',
};

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-brand="maisonnee">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_HREF} />
      </head>
      <body>{children}</body>
    </html>
  );
}
