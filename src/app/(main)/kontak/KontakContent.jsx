'use client'

import React, { useState } from 'react'
import { Mail, Instagram, MessageCircle } from 'lucide-react'
import { useData } from '@/components/DataProvider'

const WA_NUMBER = '6285731021469'

const ContactRow = ({ icon, label, value, href, external = true }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="group flex items-center justify-between gap-6 py-5 border-b border-line transition-colors"
  >
    <span className="flex items-center gap-4">
      <span className="text-muted group-hover:text-ink transition-colors">{icon}</span>
      <span>
        <span className="mono-label-sm text-muted block">{label}</span>
        <span className="font-medium">{value}</span>
      </span>
    </span>
    <span className="mono-label-sm text-muted group-hover:text-ink transition-colors">→</span>
  </a>
)

const inputClass =
  'w-full bg-transparent border-b-[1.5px] border-line py-3 text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition-colors'

export default function KontakContent() {
  const { configSitus } = useData()
  const email = configSitus?.email || 'hello@rfxvisual.my.id'

  const [form, setForm] = useState({ nama: '', kontak: '', judul: '', cerita: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Proyek: ${form.judul || 'Tanpa judul'}`)
    const body = encodeURIComponent(
      `Nama: ${form.nama}\nKontak: ${form.kontak}\n\n${form.cerita}`
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="px-5 sm:px-8 lg:px-12 pt-12 lg:pt-20 pb-24">
      <h1 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl">Kontak</h1>
      <p className="mt-4 max-w-xl text-muted leading-relaxed">
        Ceritakan proyekmu — foto, video, atau dokumentasi. Balasan biasanya
        dalam satu hari kerja.
      </p>

      <div className="mt-14 grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
        {/* Kontak langsung */}
        <div>
          <p className="mono-label text-muted pb-3 border-b-2 border-ink">Langsung</p>
          <ContactRow icon={<Mail className="w-5 h-5" />} label="Email" value={email} href={`mailto:${email}`} external={false} />
          <ContactRow
            icon={<MessageCircle className="w-5 h-5" />}
            label="WhatsApp"
            value="Chat cepat"
            href={`https://wa.me/${WA_NUMBER}`}
          />
          <ContactRow
            icon={<Instagram className="w-5 h-5" />}
            label="Instagram"
            value="@rfx.visual"
            href="https://instagram.com/rfx.visual"
          />
        </div>

        {/* Form singkat */}
        <div>
          <p className="mono-label text-muted pb-3 border-b-2 border-ink">Atau isi form ini</p>
          <form onSubmit={submit} className="mt-8 flex flex-col gap-7">
            <div className="grid sm:grid-cols-2 gap-7">
              <label className="block">
                <span className="mono-label-sm text-muted">Nama</span>
                <input required value={form.nama} onChange={set('nama')} placeholder="Nama kamu" className={inputClass} />
              </label>
              <label className="block">
                <span className="mono-label-sm text-muted">Kontak</span>
                <input required value={form.kontak} onChange={set('kontak')} placeholder="Email / WA" className={inputClass} />
              </label>
            </div>
            <label className="block">
              <span className="mono-label-sm text-muted">Judul proyek</span>
              <input required value={form.judul} onChange={set('judul')} placeholder="Contoh: Konten kampanye brand X" className={inputClass} />
            </label>
            <label className="block">
              <span className="mono-label-sm text-muted">Ceritakan kebutuhannya</span>
              <textarea
                required
                value={form.cerita}
                onChange={set('cerita')}
                rows={5}
                placeholder="Kapan, di mana, mau hasil seperti apa…"
                className={`${inputClass} resize-none`}
              />
            </label>
            <button
              type="submit"
              className="mono-label self-start border-[1.5px] border-ink px-6 py-3.5 transition-colors hover:bg-ink hover:text-paper"
            >
              Kirim via email
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
