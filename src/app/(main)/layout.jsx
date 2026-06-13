'use client'

import Link from 'next/link'
import { useData } from '@/components/DataProvider'
import AnimatedBackground from '@/components/AnimatedBackground'
import Navigasi from '@/components/Navigasi'
import Footer from '@/components/Footer'
import HireMe from '@/components/HireMe'

export default function MainLayout({ children }) {
  const { configSitus } = useData()

  return (
    <div className="min-h-screen text-white font-sans tracking-tight overflow-x-hidden relative custom-scrollbar">
      <AnimatedBackground />
      <Navigasi configSitus={configSitus} />
      <main>{children}</main>
      <Footer />
      <HireMe />
      <Link
        href="/admin"
        className="fixed bottom-4 right-4 z-50 text-[10px] text-zinc-800 hover:text-zinc-500 font-mono opacity-50"
      >
        [admin]
      </Link>
    </div>
  )
}
