import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { ErrorTrackingInitializer } from '@/components/ErrorTrackingInitializer';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Free HD Background Remover | 100% Private & No Watermark | PromptCraft',
  description: 'Remove image backgrounds instantly in your browser. 100% FREE, no server uploads, batch processing, and download in absolute HD quality.',
  keywords: 'in browser background remover free, remove background without uploading image, HD background remover free no watermark, bulk image background remover free, offline background removal tool web',
  alternates: {
    canonical: 'https://promptcraftin.in',
  },
  verification: {
    google: "DUUkyk8bHf-PogaTJMn2pR0Cf8E9JYWj0E7xTh4oAsk"
  },
  icons: {
    icon: [
      { url: 'https://res.cloudinary.com/dz3ixer7i/image/upload/e_trim:10/c_fit,w_512,h_512/v1776431696/Background_remover_website_logo_1_vqflqm.png' },
      { url: 'https://res.cloudinary.com/dz3ixer7i/image/upload/e_trim:10/c_fit,w_192,h_192/v1776431696/Background_remover_website_logo_1_vqflqm.png', type: 'image/png', sizes: '192x192' },
      { url: 'https://res.cloudinary.com/dz3ixer7i/image/upload/e_trim:10/c_fit,w_512,h_512/v1776431696/Background_remover_website_logo_1_vqflqm.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: 'https://res.cloudinary.com/dz3ixer7i/image/upload/e_trim:10/c_fit,w_180,h_180/v1776431696/Background_remover_website_logo_1_vqflqm.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Free Background Remover - HD Quality & 100% Private',
    description: 'Remove backgrounds instantly right in your browser. No data leaves your device. Free HD downloads.',
    url: 'https://promptcraftin.in',
    siteName: 'PromptCraft',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Background Remover (100% Free & Private)',
    description: 'Browser-based HD background removal. No uploads, no watermarks.',
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
        <link rel="preconnect" href="https://staticimgly.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://staticimgly.com" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "PromptCraft Background Remover",
                "operatingSystem": "Web Browser",
                "applicationCategory": "MultimediaApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": "A browser-based, AI-powered tool to remove image backgrounds with high-definition exports and batch processing.",
                "featureList": "Client-side processing, HD exports, Batch background removal, Zero data retention"
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Is this background remover really free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, PromptCraft is 100% free to use. You can process images and download them in standard or HD resolutions without paying."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Are my images uploaded to a server?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No! Our AI runs entirely inside your web browser. Your photos never leave your device, ensuring complete privacy."
                    }
                  }
                ]
              }
            ])
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ErrorTrackingInitializer />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
