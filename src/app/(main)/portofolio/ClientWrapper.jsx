'use client'

import dynamic from 'next/dynamic'

// Dynamically import the massive Three.js portfolio content with SSR disabled
const PortofolioContent = dynamic(() => import('./PortofolioContent'), { ssr: false })

export default function ClientWrapper() {
  return <PortofolioContent />
}
