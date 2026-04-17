import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { ErrorTrackingInitializer } from '@/components/ErrorTrackingInitializer';

export const metadata: Metadata = {
  title: 'promptcraftin.in - Free Private Background Remover (No Upload)',
  description: 'Instantly remove image backgrounds fully locally in your browser. 100% free, no signups, no uploads, absolute privacy guaranteed.',
  keywords: 'free background remover without upload, offline background remover, privacy image background remover, remove background locally browser',
  openGraph: {
    title: 'Free Private Background Remover (No Upload)',
    description: 'Instantly remove image backgrounds fully locally in your browser. 100% private.',
    url: 'https://promptcraftin.in',
    siteName: 'promptcraftin.in',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9154045707433472"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body suppressHydrationWarning>
        <ErrorTrackingInitializer />
        {children}
      </body>
    </html>
  );
}
