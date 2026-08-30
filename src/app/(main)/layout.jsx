'use client'

import ThemeScroller from '@/components/ThemeScroller'
import Navigasi from '@/components/Navigasi'
import Footer from '@/components/Footer'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper text-ink overflow-x-clip">
      <ThemeScroller />
      <Navigasi />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
