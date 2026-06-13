import Script from 'next/script'
import { Inter, Outfit } from 'next/font/google'
import { DataProvider } from '@/components/DataProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://rfxvisual.my.id'),
  title: {
    default: 'RFX Visual — Portfolio Ridho Febriyansyah | Visual Artist Malang',
    template: '%s | RFX Visual',
  },
  description: 'Portfolio resmi RFX Visual oleh Muhammad Ridho Febriyansyah — Visual Artist, Videografer, dan Content Creator berbasis di Malang. Spesialis video sinematik, fotografi, animasi, dan desain kreatif.',
  keywords: ['RFX Visual', 'Ridho Febriyansyah', 'Muhammad Ridho Febriyansyah', 'Visual Artist Malang', 'Videografer Malang', 'Sinematografi', 'Fotografer Malang', 'Editor Video', 'Wedding Video', 'Content Creator'],
  authors: [{ name: 'Muhammad Ridho Febriyansyah' }],
  creator: 'Muhammad Ridho Febriyansyah',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://rfxvisual.my.id',
    siteName: 'RFX Visual',
    title: 'RFX Visual — Portfolio Ridho Febriyansyah',
    description: 'Portfolio resmi RFX Visual oleh Muhammad Ridho Febriyansyah — Visual Artist, Videografer, dan Content Creator.',
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
    title: 'RFX Visual — Portfolio Ridho Febriyansyah',
    description: 'Visual Artist & Videografer berbasis Malang. Karya video sinematik, fotografi, dan animasi.',
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
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable}`}>
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
              "description": "Visual Artist, Videografer, dan Content Creator berbasis di Malang. Berkarya sejak 2020 dengan identitas RFX Visual.",
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
                "Content Creation", "Adobe Premiere Pro", "After Effects", "Lightroom"
              ]
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <DataProvider>
          {children}
        </DataProvider>
        <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />
      </body>
    </html>
  )
}
