import Script from 'next/script'
import localFont from 'next/font/local'
import { DataProvider } from '@/components/DataProvider'
import './globals.css'

// Font self-hosted (OFL) — file woff2 di-commit di src/fonts, tanpa CDN runtime.
const anton = localFont({
  src: '../fonts/anton-latin-400-normal.woff2',
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const spaceGrotesk = localFont({
  src: [
    { path: '../fonts/space-grotesk-latin-400-normal.woff2', weight: '400' },
    { path: '../fonts/space-grotesk-latin-500-normal.woff2', weight: '500' },
    { path: '../fonts/space-grotesk-latin-700-normal.woff2', weight: '700' },
  ],
  variable: '--font-sans',
  display: 'swap',
})

const spaceMono = localFont({
  src: [
    { path: '../fonts/space-mono-latin-400-normal.woff2', weight: '400' },
    { path: '../fonts/space-mono-latin-700-normal.woff2', weight: '700' },
  ],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://rfxvisual.my.id'),
  title: {
    default: 'RFX Visual — Ridho Febriyansyah | Visual Artist Malang',
    template: '%s | RFX Visual',
  },
  description: 'Portfolio RFX Visual — Ridho Febriyansyah. Foto, video, dan karya visual lain, dibuat di Malang sejak 2020.',
  keywords: ['RFX Visual', 'Ridho Febriyansyah', 'Visual Artist Malang', 'Videografer Malang', 'Fotografer Malang', 'Wedding Video', 'Content Creator'],
  authors: [{ name: 'Muhammad Ridho Febriyansyah' }],
  creator: 'Muhammad Ridho Febriyansyah',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://rfxvisual.my.id',
    siteName: 'RFX Visual',
    title: 'RFX Visual — Ridho Febriyansyah',
    description: 'Foto, video, dan karya visual lain, dibuat di Malang sejak 2020.',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'RFX Visual Portfolio by Ridho Febriyansyah',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RFX Visual — Ridho Febriyansyah',
    description: 'Foto, video, dan karya visual lain, dibuat di Malang sejak 2020.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://rfxvisual.my.id',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${anton.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Muhammad Ridho Febriyansyah",
              "alternateName": "RFX Visual",
              "url": "https://rfxvisual.my.id",
              "image": "https://rfxvisual.my.id/logo.png",
              "description": "Visual artist berbasis di Malang. Bikin foto dan video sejak 2020 dengan identitas RFX Visual.",
              "jobTitle": "Visual Artist & Videografer",
              "worksFor": {
                "@type": "Organization",
                "name": "RFX Visual"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Malang",
                "addressCountry": "ID"
              },
              "sameAs": [
                "https://instagram.com/rfx.visual",
                "https://youtube.com/@rfxvisual",
                "https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5"
              ],
              "knowsAbout": [
                "Videografi", "Fotografi", "Animasi", "Color Grading",
                "Adobe Premiere Pro", "After Effects", "Lightroom"
              ]
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <DataProvider>
          {children}
        </DataProvider>
        <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />
      </body>
    </html>
  )
}
