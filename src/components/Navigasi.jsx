'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Search, X, Instagram, Youtube, Linkedin } from 'lucide-react'
import Wordmark from '@/components/logo/wordmark'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/works', label: 'Work' },
  { href: '/artikel', label: 'Stories' },
  { href: '/about', label: 'About' },
  { href: '/kontak', label: 'Contact' },
  { href: '/myroom', label: 'My Room' },
]

export default function Navigasi() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // tutup semua panel saat pindah halaman
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setQ('')
  }, [pathname])

  // kunci scroll ketika panel terbuka
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, searchOpen])

  const results = q.trim()
    ? navLinks.filter((l) => l.label.toLowerCase().includes(q.trim().toLowerCase()))
    : navLinks

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm">
        <div className="w-full px-5 sm:px-8 lg:px-12">
          {/* ===== Desktop ===== */}
          <div className="hidden md:flex items-center justify-between h-[4.5rem]">
            <Link href="/" aria-label="RFX Visual — beranda" className="text-ink">
              <Wordmark size={20} />
            </Link>
            <nav className="flex items-center gap-8" aria-label="Navigasi utama">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`mono-label pb-1 border-b-2 transition-colors ${
                    isActive(l.href) ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ===== Mobile: logo pindah ke tengah saat scroll, hamburger hanya di atas ===== */}
          <div className="md:hidden relative h-16 flex items-center">
            <motion.div
              className="text-ink"
              initial={false}
              animate={{ left: scrolled ? '50%' : '0%', x: scrolled ? '-50%' : '0%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              style={{ position: 'absolute', top: '50%', translateY: '-50%' }}
            >
              <Link href="/" aria-label="RFX Visual — beranda">
                <Wordmark size={18} />
              </Link>
            </motion.div>

            <AnimatePresence>
              {!scrolled && (
                <motion.button
                  key="top-burger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMenuOpen(true)}
                  aria-label="Buka menu"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-ink p-2 -mr-2"
                >
                  <Menu className="w-6 h-6" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="rule-2" />
      </header>

      {/* ===== Mobile bottom bar (muncul saat scroll): search kiri · hamburger kanan ===== */}
      <AnimatePresence>
        {scrolled && !menuOpen && !searchOpen && (
          <motion.div
            key="bottom-bar"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
            className="md:hidden fixed bottom-5 right-5 z-50"
          >
            <div className="flex items-center bg-ink text-paper rounded-full shadow-lg overflow-hidden">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Cari halaman"
                className="flex items-center justify-center w-14 h-12 hover:bg-paper/10 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <span className="w-px h-6 bg-paper/25" aria-hidden />
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Buka menu"
                className="flex items-center justify-center w-14 h-12 hover:bg-paper/10 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Menu overlay ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-[60] bg-paper text-ink flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b-2 border-ink">
              <Wordmark size={18} />
              <button onClick={() => setMenuOpen(false)} aria-label="Tutup menu" className="p-2 -mr-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-5 gap-1" aria-label="Navigasi utama">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
                >
                  <Link
                    href={l.href}
                    className={`flex items-baseline gap-4 py-3 border-b border-line ${
                      isActive(l.href) ? 'text-ink' : 'text-muted'
                    }`}
                  >
                    <span className="mono-label-sm w-6">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display uppercase text-4xl leading-none">{l.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-5 py-8 flex items-center gap-6">
              <a href="https://instagram.com/rfx.visual" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted hover:text-ink">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@rfxvisual" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-muted hover:text-ink">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-ink">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Search overlay (lompat cepat antar halaman) ===== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-[60] bg-paper text-ink flex flex-col"
          >
            <div className="flex items-center gap-3 h-16 px-5 border-b-2 border-ink">
              <Search className="w-5 h-5 text-muted shrink-0" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results[0]) router.push(results[0].href)
                }}
                placeholder="Cari halaman…"
                className="flex-1 bg-transparent text-lg focus:outline-none placeholder:text-muted/60"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Tutup pencarian" className="p-2 -mr-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {results.length === 0 ? (
                <p className="text-muted py-8">Tidak ada halaman cocok.</p>
              ) : (
                results.map((l) => (
                  <Link key={l.href} href={l.href} className="flex items-center justify-between py-4 border-b border-line">
                    <span className="font-display uppercase text-2xl">{l.label}</span>
                    <span className="mono-label-sm text-muted">{l.href}</span>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
