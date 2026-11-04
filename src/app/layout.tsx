import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConceptUnlock | Mobile App',
  description: `Upload a syllabus. Get a personalized AI tutor and study plan instantly.`,
  applicationName: 'ConceptUnlock',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ConceptUnlock',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'ConceptUnlock',
    description: `Upload a syllabus. Get a personalized AI tutor and study plan instantly.`,
    url: 'https://conceptunlock.vercel.app',
    siteName: 'ConceptUnlock',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConceptUnlock',
    description: `Upload a syllabus. Get a personalized AI tutor and study plan instantly.`,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#2563EB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ConceptUnlock" />
        <style>{`:root { --accent-color: #2563EB; } html, body { overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; }`}</style>
      </head>
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
