'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useData } from '@/components/DataProvider'
import Wordmark from '@/components/logo/wordmark'
import Logo from '@/components/logo/logo'

/* ---------- doodle tangan (tinta, digambar sebagai kode) ---------- */

const DoodleCamera = ({ className }) => (
  <svg viewBox="0 0 120 130" fill="none" className={className} aria-hidden>
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {/* bodi kamera */}
      <path d="M30 22 Q52 17 74 21 Q88 23 87 36 L86 58 Q86 70 72 71 L36 72 Q24 72 23 60 L23 34 Q23 24 30 22 Z" />
      {/* reel */}
      <circle cx="43" cy="36" r="9" />
      <circle cx="68" cy="37" r="9" />
      <circle cx="43" cy="36" r="2.4" />
      <circle cx="68" cy="37" r="2.4" />
      {/* lensa */}
      <path d="M23 47 L10 41 L10 63 L23 57" />
      {/* tripod */}
      <path d="M52 72 L52 96" />
      <path d="M52 96 L34 124" />
      <path d="M52 96 L70 124" />
      <path d="M52 96 L52 122" />
    </g>
  </svg>
)

const DoodleLaptop = ({ className }) => (
  <svg viewBox="0 0 130 92" fill="none" className={className} aria-hidden>
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {/* layar */}
      <path d="M28 14 Q64 9 100 13 L104 58 Q66 63 30 59 Z" />
      <path d="M44 26 Q63 23 84 26 M44 37 Q63 34 84 37" />
      {/* papan ketik */}
      <path d="M18 62 Q64 68 112 61 L118 74 Q64 84 12 76 Z" />
      <path d="M34 68 L96 66" />
    </g>
  </svg>
)

const DoodleSpark = ({ className }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden>
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M40 10 Q44 26 40 40 Q36 26 40 10 Z" />
      <path d="M40 40 Q44 54 40 70 Q36 54 40 40 Z" />
      <path d="M10 40 Q26 44 40 40 Q26 36 10 40 Z" />
      <path d="M40 40 Q54 36 70 40 Q54 44 40 40 Z" />
      <circle cx="40" cy="40" r="5" />
    </g>
  </svg>
)

/* ---------- potret + doodle ---------- */

const Portrait = ({ src, alt }) => {
  const isFallback = src === '/hero_3d_character.webp'
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative aspect-[4/5] sm:aspect-[4/4.6] bg-paper-2 overflow-hidden">
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full ${isFallback ? 'object-contain' : 'object-cover'}`}
            style={{ filter: 'grayscale(1) contrast(1.05)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/70">
            <Logo size={110} />
          </div>
        )}
      </div>

      <DoodleCamera className="absolute -left-6 sm:-left-14 top-6 w-20 sm:w-28 text-ink" />
      <DoodleLaptop className="absolute -left-4 sm:-left-12 bottom-8 w-24 sm:w-32 text-ink" />
      <DoodleSpark className="absolute -right-4 sm:-right-10 top-2 w-12 sm:w-16 text-ink" />
    </div>
  )
}

/* ---------- chips ---------- */

const Chip = ({ children }) => (
  <span className="mono-label inline-block border-[1.5px] border-ink px-3.5 py-2 transition-colors hover:bg-ink hover:text-paper cursor-default">
    {children}
  </span>
)

/* ---------- potongan teks ---------- */

const strip = (html) =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_>`\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getExcerpt = (a) => strip(a.summary || a.excerpt || a.content).slice(0, 150)

const catLabel = { video: 'Video', photo: 'Foto', animation: 'Animasi', website: 'Web' }

/* ---------- skeleton ---------- */

const HomeSkeleton = () => (
  <section className="px-5 sm:px-8 lg:px-12 py-16">
    <div className="rule-1 pb-4" />
    <div className="mt-8 grid md:grid-cols-2 gap-10">
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-9 w-32 bg-paper-2 animate-pulse" />
        ))}
      </div>
      <div className="aspect-[4/5] bg-paper-2 animate-pulse" />
    </div>
  </section>
)

/* ---------- halaman ---------- */

const HomeContent = () => {
  const { isLoading, configSitus, daftarKarya, daftarArtikel, skills } = useData()

  if (isLoading) return <HomeSkeleton />

  const stackSkills = ['Fotografi', 'Videografi', 'Color Grading', 'Editing', 'Motion']
  const tools =
    skills?.length > 0
      ? skills.map((s) => s.title)
      : ['Premiere Pro', 'After Effects', 'Capcut', 'Lightroom']

  const featured = (daftarKarya || []).slice(0, 4)
  const stories = (daftarArtikel || []).slice(0, 3)
  const portrait = configSitus?.aboutImage || configSitus?.heroImage || '/hero_3d_character.webp'

  return (
    <div>
      {/* HERO — kertas */}
      <section data-theme="light" className="px-5 sm:px-8 lg:px-12 pt-8 lg:pt-12 pb-16 lg:pb-24">
        {/* label + chips: tiap grup punya labelnya sendiri (rapi di mobile) */}
        <div className="rule-1" />
        <div className="mt-6 grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <p className="mono-label text-muted mb-3">Skill Stack</p>
            <div className="flex flex-wrap gap-2.5">
              {stackSkills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mono-label text-muted mb-3">Tools &amp; Craft</p>
            <div className="flex flex-wrap gap-2.5">
              {tools.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
        </div>

        {/* potret + doodle */}
        <div className="mt-12 lg:mt-16">
          <Portrait src={portrait} alt="Ridho Febriyansyah" />
        </div>

        {/* blok bawah: kalimat, CTA, nama kota besar */}
        <div className="mt-12 lg:mt-16">
          <p className="max-w-md text-base sm:text-lg leading-relaxed">
            Ridho Febriyansyah — bikin foto &amp; video di Malang sejak 2020.
            Karya di bawah, ceritanya di Stories.
          </p>

          <div className="mt-5 flex items-center gap-8">
            <Link href="/works" className="link-underline font-medium">
              Lihat karya
            </Link>
            <Link href="/kontak" className="link-underline font-medium">
              Hubungi
            </Link>
          </div>

          <h1 className="font-display uppercase text-[clamp(4.5rem,15vw,12rem)] leading-[0.9] mt-10 lg:mt-14">
            Malang
          </h1>
          <p className="mono-label text-muted mt-3">Jawa Timur, Indonesia</p>
        </div>
      </section>

      {/* KARYA PILIHAN — gelap */}
      <section data-theme="dark" className="px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="flex items-baseline justify-between pb-4 border-b-2 border-ink">
          <h2 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl">
            Karya Pilihan
          </h2>
          <Link href="/works" className="mono-label text-muted hover:text-ink transition-colors whitespace-nowrap ml-6">
            Semua karya →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="py-16 text-muted">Karya sedang dirapik — cek lagi nanti.</p>
        ) : (
          <div>
            {featured.map((w, i) => (
              <Link
                key={w.id || i}
                href="/works"
                className="group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3rem_220px_1fr_auto] gap-5 md:gap-8 items-center py-6 border-b border-line"
              >
                <span className="mono-label text-muted">{String(i + 1).padStart(2, '0')}</span>

                <div className="hidden md:block aspect-video overflow-hidden bg-paper-2">
                  {w.image && (
                    <img src={w.image} alt={w.title} className="work-img w-full h-full object-cover" loading="lazy" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-display uppercase text-xl md:text-2xl truncate">{w.title}</h3>
                  <p className="text-sm text-muted line-clamp-2 mt-1.5 max-w-xl">{w.description || ' '}</p>
                  <p className="mono-label-sm text-muted mt-2">
                    {catLabel[w.category] || w.category}
                    {w.year ? ` · ${w.year}` : ''}
                  </p>
                </div>

                <ArrowRight className="hidden md:block w-5 h-5 text-muted transition-transform group-hover:translate-x-1.5 group-hover:text-ink" />
              </Link>
            ))}
          </div>
        )}

        {/* jembatan ke ruang pamer opsional */}
        <Link
          href="/myroom"
          className="group mt-12 inline-flex items-center gap-3 mono-label text-muted hover:text-ink transition-colors"
        >
          <span className="border-b border-current pb-0.5">Masuk ke My Room</span>
          <span className="transition-transform group-hover:translate-x-1.5">→</span>
          <span className="mono-label-sm opacity-60 normal-case tracking-normal">— ruang pamer 3D, opsional</span>
        </Link>
      </section>

      {/* CERITA — kembali ke kertas */}
      <section data-theme="light" className="px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="flex items-baseline justify-between pb-4 border-b-2 border-ink">
          <h2 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl">Cerita</h2>
          <Link href="/artikel" className="mono-label text-muted hover:text-ink transition-colors whitespace-nowrap ml-6">
            Semua tulisan →
          </Link>
        </div>

        {stories.length === 0 ? (
          <p className="py-16 text-muted">Belum ada tulisan.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
            {stories.map((a) => (
              <Link key={a.id} href={`/artikel/${a.id}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-paper-2">
                  {(a.image || a.image_url) && (
                    <img
                      src={a.image || a.image_url}
                      alt={a.title}
                      className="work-img w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="mono-label-sm text-muted mt-4">{a.date || 'Tulisan'}</p>
                <h3 className="font-display uppercase text-xl leading-tight mt-2 group-hover:opacity-60 transition-opacity">
                  {a.title}
                </h3>
                <p className="text-sm text-muted line-clamp-2 mt-2 leading-relaxed">{getExcerpt(a)}</p>
              </Link>
            ))}
          </div>
        )}

        {/* penutup kecil */}
        <div className="mt-16 lg:mt-24 border-t-2 border-ink pt-6 flex items-center justify-between">
          <Wordmark size={18} />
          <Link href="/kontak" className="mono-label text-muted hover:text-ink transition-colors">
            Ada proyek? →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomeContent
