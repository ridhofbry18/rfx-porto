'use client'

import React from 'react'
import Link from 'next/link'
import { Instagram, Youtube, Linkedin, Mail } from 'lucide-react'
import Wordmark from '@/components/logo/wordmark'
import { useData } from '@/components/DataProvider'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/works', label: 'Work' },
  { href: '/artikel', label: 'Stories' },
  { href: '/about', label: 'About' },
  { href: '/kontak', label: 'Contact' },
]

export default function Footer() {
  const { configSitus } = useData()
  const email = configSitus?.email || 'hello@rfxvisual.my.id'

  return (
    <footer className="border-t-2 border-ink bg-paper text-ink">
      <div className="px-5 sm:px-8 lg:px-12 py-10 lg:py-12 flex flex-col gap-8">
        {/* Baris 1: wordmark + kalimat pendek */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Wordmark size={26} />
            <p className="mt-3 text-sm text-muted max-w-xs leading-relaxed">
              Foto, video, dan karya visual lain — dibuat di Malang sejak 2020.
            </p>
          </div>
          <a href={`mailto:${email}`} className="link-underline text-sm font-medium w-max">
            {email}
          </a>
        </div>

        {/* Baris 2: nav + sosial */}
        <div className="rule-1" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Navigasi footer">
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="mono-label-sm text-muted hover:text-ink transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <a href="https://instagram.com/rfx.visual" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted hover:text-ink transition-colors">
              <Instagram className="w-4.5 h-4.5" width={18} height={18} />
            </a>
            <a href="https://youtube.com/@rfxvisual" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-muted hover:text-ink transition-colors">
              <Youtube width={18} height={18} />
            </a>
            <a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-ink transition-colors">
              <Linkedin width={18} height={18} />
            </a>
          </div>
        </div>

        {/* Baris 3: copyright */}
        <div className="rule-1" />
        <p className="mono-label-sm text-muted">
          © {new Date().getFullYear()} RFX Visual — Malang, Indonesia
        </p>
      </div>
    </footer>
  )
}
