'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Instagram, Youtube, Mail, MessageCircle, ArrowUpRight, Sun, Moon, LayoutTemplate, ShoppingCart, Image as ImageIcon } from 'lucide-react'
import { useData } from '@/components/DataProvider'
import Wordmark from '@/components/logo/wordmark'

/**
 * Link-in-bio ala lynk.id — kolom tunggal, tombol seragam, tanpa warna acak.
 * Routing tidak berubah: subdomain link.rfxvisual.my.id tetap di-rewrite
 * middleware ke /rfx-links.
 */

const LinkButton = ({ icon, label, onClick, href, external = false }) => {
  const inner = (
    <>
      <span className="shrink-0">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
      <ArrowUpRight className="w-4 h-4 ml-auto opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  )
  const cls =
    'group w-full flex items-center gap-3.5 border-[1.5px] border-ink px-4 py-4 transition-colors hover:bg-ink hover:text-paper text-left'
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

export default function LinksContent() {
  const { configSitus, isDark, toggleTheme, daftarKatalog } = useData()
  const router = useRouter()

  const email = configSitus?.email || 'hello@rfxvisual.my.id'
  const featured = daftarKatalog?.[0]

  const goMain = () => {
    window.location.href = window.location.hostname.includes('localhost')
      ? 'http://localhost:3000'
      : 'https://rfxvisual.my.id'
  }

  return (
    <div className={`${isDark ? 'theme-dark' : ''} min-h-screen flex justify-center px-5 py-12 sm:py-16 bg-paper text-ink`}>
      <div className="w-full max-w-[26rem] flex flex-col">
        {/* Profil */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-paper-2 border-[1.5px] border-ink">
            {configSitus?.aboutImage ? (
              <img src={configSitus.aboutImage} alt="Foto profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink/60 font-display text-2xl">RFX</div>
            )}
          </div>
          <div className="mt-5">
            <Wordmark size={18} />
          </div>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Visual artist di Malang — foto, video, dan karya visual lain.
          </p>
        </div>

        {/* Sosial */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <a href="https://instagram.com/rfx.visual" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted hover:text-ink transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://youtube.com/@rfxvisual" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-muted hover:text-ink transition-colors">
            <Youtube className="w-5 h-5" />
          </a>
          <a href={`mailto:${email}`} aria-label="Email" className="text-muted hover:text-ink transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Tombol link */}
        <div className="mt-10 flex flex-col gap-3">
          <LinkButton icon={<ImageIcon className="w-5 h-5" />} label="Karya & portofolio" onClick={goMain} />

          {featured && (
            <button
              type="button"
              onClick={() => router.push('/templates')}
              className="group w-full border-[1.5px] border-ink text-left transition-colors hover:bg-ink hover:text-paper"
            >
              <div className="aspect-[16/7] overflow-hidden bg-paper-2">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex items-center gap-3.5 px-4 py-4">
                <LayoutTemplate className="w-5 h-5 shrink-0" />
                <span className="font-medium text-sm">
                  Katalog template
                  <span className="block mono-label-sm text-muted mt-0.5 normal-case tracking-normal font-normal">
                    {featured.priceStr} · mulai dari
                  </span>
                </span>
                <ArrowUpRight className="w-4 h-4 ml-auto opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </button>
          )}

          <LinkButton icon={<ShoppingCart className="w-5 h-5" />} label="Web services" onClick={() => router.push('/orderweb')} />
          <LinkButton icon={<ImageIcon className="w-5 h-5" />} label="Pricelist fotografi" onClick={() => router.push('/pricelist')} />
          <LinkButton icon={<Instagram className="w-5 h-5" />} label="Instagram" href="https://instagram.com/rfx.visual" />
          <LinkButton icon={<MessageCircle className="w-5 h-5" />} label="WhatsApp" href="https://wa.me/6285731021469" />
        </div>

        {/* Kaki */}
        <button
          type="button"
          onClick={toggleTheme}
          className="mt-10 mx-auto flex items-center gap-2 mono-label-sm text-muted hover:text-ink transition-colors"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          {isDark ? 'Terang' : 'Gelap'}
        </button>
        <p className="mono-label-sm text-muted text-center mt-4">
          © {new Date().getFullYear()} RFX Visual
        </p>
      </div>
    </div>
  )
}
