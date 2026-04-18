import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { ErrorTrackingInitializer } from '@/components/ErrorTrackingInitializer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'promptcraftin.in - Free Private Background Remover (No Upload)',
  description: 'Instantly remove image backgrounds fully locally in your browser. 100% free, no signups, no uploads, absolute privacy guaranteed.',
  keywords: 'free background remover without upload, offline background remover, privacy image background remover, remove background locally browser',
  verification: {
    google: "DUUkyk8bHf-PogaTJMn2pR0Cf8E9JYWj0E7xTh4oAsk"
  },
  icons: {
    icon: 'https://res.cloudinary.com/dz3ixer7i/image/upload/v1776431696/Background_remover_website_logo_1_vqflqm.png',
  },
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-342TVNYJJ4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-342TVNYJJ4');
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ErrorTrackingInitializer />
        {children}
      </body>
    </html>
  );
}
