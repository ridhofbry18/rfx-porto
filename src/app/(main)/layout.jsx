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
    <div className="min-h-screen text-white font-sans tracking-tight overflow-x-clip relative custom-scrollbar">
      <AnimatedBackground />
      <Navigasi configSitus={configSitus} />
      <main>{children}</main>
      <Footer />
      <HireMe />
    </div>
  )
}
