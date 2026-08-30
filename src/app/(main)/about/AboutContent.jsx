'use client'

import React from 'react'
import Link from 'next/link'
import { useData } from '@/components/DataProvider'

export default function AboutContent() {
  const { configSitus, skills, experiences, isLoading } = useData()

  const bio =
    configSitus?.homeDescription ||
    'Saya Ridho — visual artist di Malang. Sehari-hari saya memotret, merekam, dan menyunting; dari dokumentasi acara sampai konten brand.'

  const journey =
    experiences && experiences.length > 0
      ? experiences
      : [
          { id: 1, year: '2020', title: 'Mulai', company: 'Freelance', description: 'Eksplorasi visual: dokumentasi acara lokal dan short movie indie di Malang.' },
          { id: 2, year: '2021–2022', title: 'Cari identitas', company: 'RFX Visual', description: 'Membentuk gaya color grading yang jadi ciri khas, mulai masuk ke music video.' },
          { id: 3, year: '2023–kini', title: 'Visual artist', company: 'RFX Visual', description: 'Full-time untuk brand fashion dan FnB: foto, video, konten.' },
        ]

  return (
    <div className="px-5 sm:px-8 lg:px-12 pt-12 lg:pt-20 pb-24">
      {/* Bio */}
      <section data-theme="light">
        <h1 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl">Tentang</h1>
        <div className="mt-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <p className="text-lg sm:text-xl leading-relaxed max-w-xl">{bio}</p>

          {configSitus?.aboutImage && (
            <div className="aspect-[4/5] max-w-md w-full overflow-hidden bg-paper-2">
              <img
                src={configSitus.aboutImage}
                alt="Ridho Febriyansyah"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(1) contrast(1.05)' }}
              />
            </div>
          )}
        </div>
        {configSitus?.aboutQuote && (
          <p className="mt-12 max-w-2xl font-display uppercase text-2xl sm:text-3xl leading-snug">
            “{configSitus.aboutQuote}”
          </p>
        )}
      </section>

      {/* Perjalanan */}
      <section className="mt-20 lg:mt-28">
        <div className="border-b-2 border-ink pb-4">
          <h2 className="font-display uppercase text-3xl sm:text-4xl">Perjalanan</h2>
        </div>
        <div>
          {journey.map((exp) => (
            <div key={exp.id} className="grid md:grid-cols-[10rem_1fr] gap-2 md:gap-12 py-8 border-b border-line">
              <p className="mono-label text-muted pt-1.5">{exp.year}</p>
              <div className="max-w-2xl">
                <h3 className="font-display uppercase text-2xl">{exp.title}</h3>
                <p className="mono-label-sm text-muted mt-1">{exp.company}</p>
                <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keahlian — chip, tanpa persentase */}
      <section className="mt-20 lg:mt-28">
        <div className="border-b-2 border-ink pb-4">
          <h2 className="font-display uppercase text-3xl sm:text-4xl">Peralatan</h2>
        </div>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {(skills?.length > 0 ? skills.map((s) => s.title) : ['Premiere Pro', 'After Effects', 'Capcut', 'Lightroom']).map(
            (t) => (
              <span
                key={t}
                className="mono-label border-[1.5px] border-ink px-4 py-2 transition-colors hover:bg-ink hover:text-paper cursor-default"
              >
                {t}
              </span>
            )
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 lg:mt-28 border-t-2 border-ink pt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <p className="max-w-md text-muted">Punya proyek foto atau video? Saya open untuk freelance dan kolaborasi.</p>
        <Link href="/kontak" className="link-underline font-medium w-max">
          Hubungi
        </Link>
      </section>
    </div>
  )
}
