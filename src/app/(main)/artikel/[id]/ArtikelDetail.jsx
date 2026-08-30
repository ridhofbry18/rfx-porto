'use client'

import React from 'react'
import Link from 'next/link'
import { useData } from '@/components/DataProvider'

/* Ubah URL mentah dalam teks menjadi tautan yang bisa diklik */
const linkify = (text) => {
  const parts = []
  const re = /(https?:\/\/[^\s]+)/g
  let last = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', content: text.slice(last, m.index) })
    let url = m[0]
    if (/[.,!?;:)]$/.test(url)) {
      parts.push({ type: 'text', content: url.slice(-1) })
      url = url.slice(0, -1)
    }
    parts.push({ type: 'link', content: url })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) })
  return parts
}

const Paragraph = ({ text }) => (
  <p className="leading-[1.85] text-ink/90 mb-7">
    {linkify(text).map((part, i) =>
      part.type === 'link' ? (
        <a
          key={i}
          href={part.content}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline break-words"
        >
          {part.content}
        </a>
      ) : (
        <React.Fragment key={i}>{part.content}</React.Fragment>
      )
    )}
  </p>
)

export default function ArtikelDetail({ artikel }) {
  const { daftarArtikel } = useData()

  const list = daftarArtikel && daftarArtikel.length > 0 ? daftarArtikel : [artikel]
  const idx = list.findIndex((a) => String(a.id) === String(artikel.id))
  const newer = idx > 0 ? list[idx - 1] : null
  const older = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null

  const paragraphs = String(artikel.content || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  const image = artikel.image || artikel.image_url

  return (
    <article className="px-5 sm:px-8 pt-12 lg:pt-20 pb-24">
      <div className="max-w-[68ch] mx-auto">
        <Link href="/artikel" className="mono-label text-muted hover:text-ink transition-colors">
          ← Semua tulisan
        </Link>

        <h1 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mt-6">
          {artikel.title}
        </h1>
        <p className="mono-label-sm text-muted mt-4">{artikel.date || 'Tulisan'}</p>

        {image && (
          <figure className="mt-10">
            <img src={image} alt={artikel.title} className="w-full object-cover" />
          </figure>
        )}

        <div className="rule-1 mt-10" />

        <div className="mt-10 text-[1.0625rem]">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <Paragraph key={i} text={p} />)
          ) : (
            <p className="text-muted">Tulisan ini belum punya isi.</p>
          )}
        </div>

        <div className="rule-1 mt-14" />

        {/* navigasi antar tulisan */}
        <nav className="mt-8 grid sm:grid-cols-2 gap-6" aria-label="Tulisan lain">
          {older ? (
            <Link href={`/artikel/${older.id}`} className="group">
              <p className="mono-label-sm text-muted">← Sebelumnya</p>
              <p className="font-display uppercase text-lg mt-1.5 group-hover:opacity-60 transition-opacity">
                {older.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/artikel/${newer.id}`} className="group sm:text-right">
              <p className="mono-label-sm text-muted">Berikutnya →</p>
              <p className="font-display uppercase text-lg mt-1.5 group-hover:opacity-60 transition-opacity">
                {newer.title}
              </p>
            </Link>
          )}
        </nav>
      </div>
    </article>
  )
}
