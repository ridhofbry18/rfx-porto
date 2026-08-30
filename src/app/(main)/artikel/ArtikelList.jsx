'use client'

import React from 'react'
import Link from 'next/link'
import { useData } from '@/components/DataProvider'

const strip = (html) =>
  String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_>`\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export default function ArtikelList() {
  const { daftarArtikel, isLoading } = useData()

  if (isLoading) {
    return (
      <div className="px-5 sm:px-8 lg:px-12 py-12 lg:py-20">
        <div className="h-16 w-56 bg-paper-2 animate-pulse" />
        <div className="mt-12 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-paper-2 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const articles = daftarArtikel || []

  return (
    <div className="px-5 sm:px-8 lg:px-12 pt-12 lg:pt-20 pb-24">
      <h1 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl">Stories</h1>
      <p className="mt-4 max-w-xl text-muted leading-relaxed">
        Catatan di balik layar: proses, reference, dan hal-hal yang dipelajari
        dari tiap shoot.
      </p>

      {articles.length === 0 ? (
        <p className="py-20 text-muted">Belum ada tulisan yang dipublikasikan.</p>
      ) : (
        <div className="mt-10 border-b-2 border-ink">
          {articles.map((a, i) => (
            <Link
              key={a.id}
              href={`/artikel/${a.id}`}
              className="group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_180px_1fr_auto] gap-5 md:gap-8 items-center py-7 border-b border-line"
            >
              <span className="mono-label text-muted">{String(i + 1).padStart(2, '0')}</span>

              <div className="hidden md:block aspect-[4/3] overflow-hidden bg-paper-2">
                {(a.image || a.image_url) && (
                  <img
                    src={a.image || a.image_url}
                    alt={a.title}
                    className="work-img w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="min-w-0">
                <h2 className="font-display uppercase text-2xl sm:text-3xl leading-none group-hover:opacity-60 transition-opacity">
                  {a.title}
                </h2>
                <p className="text-sm text-muted line-clamp-2 mt-2 leading-relaxed max-w-2xl">
                  {strip(a.summary || a.content).slice(0, 180)}
                </p>
              </div>

              <span className="hidden md:block mono-label-sm text-muted whitespace-nowrap">
                {a.date || ' '}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
