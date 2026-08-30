'use client'

import React, { useState, useMemo } from 'react'
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { useData } from '@/components/DataProvider'
import { getYoutubeId, getYoutubeEmbedUrl } from '@/utils/helpers'

const getProjectVideoUrl = (item) =>
  item?.youtubeUrl || item?.youtube_url || item?.videoUrl || item?.video_url || item?.link_web || ''

const FILTERS = [
  { id: 'all', label: 'Semua' },
  { id: 'photo', label: 'Foto' },
  { id: 'video', label: 'Video' },
  { id: 'animation', label: 'Animasi' },
  { id: 'website', label: 'Web' },
]

const catLabel = { video: 'Video', photo: 'Foto', animation: 'Animasi', website: 'Web' }

/* ---------- modal video ---------- */

const VideoModal = ({ item, onClose }) => {
  if (!item) return null
  const url = getProjectVideoUrl(item)
  const videoId = getYoutubeId(url)
  const isVideoFile = !videoId && url && /\.(mp4|mov|webm|ogg)(\?.*)?$/i.test(url)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button onClick={onClose} aria-label="Tutup" className="absolute top-5 right-5 text-white/70 hover:text-white">
        <X className="w-8 h-8" />
      </button>
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-video bg-black overflow-hidden">
          {videoId ? (
            <iframe
              title={item.title || 'Pemutar video'}
              src={getYoutubeEmbedUrl(url, true)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : isVideoFile ? (
            <video src={url} className="w-full h-full object-contain" controls autoPlay playsInline />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
              Video tidak tersedia.
            </div>
          )}
        </div>
        {item.title && <p className="mono-label-sm text-white/60 mt-4">{item.title}</p>}
      </div>
    </div>
  )
}

/* ---------- lightbox foto ---------- */

const PhotoLightbox = ({ photos, index, onIndex, onClose }) => {
  if (!photos || photos.length === 0) return null
  const photo = photos[index]
  const prev = () => onIndex((index - 1 + photos.length) % photos.length)
  const next = () => onIndex((index + 1) % photos.length)

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-10" onClick={onClose} role="dialog" aria-modal="true">
      <button onClick={onClose} aria-label="Tutup" className="absolute top-5 right-5 text-white/70 hover:text-white">
        <X className="w-8 h-8" />
      </button>
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={photo?.image} alt={photo?.title || 'Foto'} className="w-full max-h-[78vh] object-contain" />
        {photo?.title && (
          <div className="mt-4 flex items-baseline justify-between gap-6">
            <p className="text-white text-lg">{photo.title}</p>
            <p className="mono-label-sm text-white/50 whitespace-nowrap">
              {index + 1} / {photos.length}
            </p>
          </div>
        )}
        {photos.length > 1 && (
          <>
            <button onClick={prev} aria-label="Sebelumnya" className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2">
              <ChevronLeft className="w-9 h-9" />
            </button>
            <button onClick={next} aria-label="Berikutnya" className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2">
              <ChevronRight className="w-9 h-9" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- halaman ---------- */

export default function WorksContent() {
  const { daftarKarya, daftarWebsite, isLoading } = useData()
  const [filter, setFilter] = useState('all')
  const [videoItem, setVideoItem] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(null)

  const items = useMemo(() => {
    const karya = (daftarKarya || []).map((k) => ({ ...k, kind: k.category }))
    const web = (daftarWebsite || []).map((w) => ({
      ...w,
      kind: 'website',
      category: 'website',
      image: w.link_preview || w.image,
    }))
    return [...karya, ...web]
  }, [daftarKarya, daftarWebsite])

  const photos = useMemo(() => items.filter((i) => i.kind === 'photo'), [items])
  const shown = filter === 'all' ? items : items.filter((i) => i.kind === filter)

  const openItem = (item) => {
    if (item.kind === 'photo') {
      setPhotoIndex(Math.max(0, photos.findIndex((p) => p.id === item.id)))
    } else if (item.kind === 'video' || item.kind === 'animation') {
      setVideoItem(item)
    } else if (item.kind === 'website') {
      const url = item.link_web || item.link_preview
      if (url) window.open(url, '_blank', 'noopener')
    }
  }

  if (isLoading) {
    return (
      <div className="theme-dark min-h-screen px-5 sm:px-8 lg:px-12 py-16">
        <div className="h-14 w-64 bg-paper-2 animate-pulse" />
        <div className="mt-12 space-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-paper-2 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="theme-dark min-h-screen">
      <div className="px-5 sm:px-8 lg:px-12 pt-12 lg:pt-20 pb-24">
        {/* kepala halaman */}
        <h1 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl">Karya</h1>
        <p className="mt-4 max-w-xl text-muted leading-relaxed">
          Foto, video, animasi, dan web. Klik untuk melihat lebih dekat —
          foto membesar di layar, video membuka pemutar.
        </p>

        {/* filter */}
        <div className="mt-10 flex flex-wrap gap-2.5 border-b-2 border-ink pb-5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`mono-label px-4 py-2 border-[1.5px] transition-colors ${
                filter === f.id
                  ? 'bg-ink text-paper border-ink'
                  : 'border-line text-muted hover:text-ink hover:border-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* daftar karya */}
        {shown.length === 0 ? (
          <p className="py-20 text-muted">Belum ada karya di kategori ini.</p>
        ) : (
          <div>
            {shown.map((item, i) => (
              <button
                key={item.id || i}
                onClick={() => openItem(item)}
                className="group w-full text-left grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_260px_1fr_auto] gap-5 md:gap-10 items-center py-7 border-b border-line"
              >
                <span className="mono-label text-muted">{String(i + 1).padStart(2, '0')}</span>

                <div className="hidden md:block aspect-video overflow-hidden bg-paper-2">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="work-img w-full h-full object-cover" loading="lazy" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 md:hidden mb-2">
                    {item.image && (
                      <img src={item.image} alt="" className="work-img w-16 aspect-video object-cover" loading="lazy" />
                    )}
                  </div>
                  <h2 className="font-display uppercase text-2xl sm:text-3xl leading-none">{item.title}</h2>
                  <p className="text-sm text-muted line-clamp-2 mt-2 max-w-2xl leading-relaxed">
                    {item.description || ' '}
                  </p>
                  <p className="mono-label-sm text-muted mt-3">
                    {catLabel[item.kind] || item.kind}
                    {item.year ? ` · ${item.year}` : ''}
                  </p>
                </div>

                <ArrowUpRight className="hidden md:block w-6 h-6 text-muted transition-all group-hover:text-ink group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            ))}
          </div>
        )}

        {/* CTA My Room */}
        <div className="mt-16 flex items-baseline justify-between border-t-2 border-ink pt-5">
          <p className="mono-label text-muted">Mau cara lain melihat karya?</p>
          <a href="/myroom" className="mono-label group inline-flex items-center gap-2">
            <span className="border-b border-current pb-0.5">My Room — ruang pamer 3D</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>

      {videoItem && <VideoModal item={videoItem} onClose={() => setVideoItem(null)} />}
      {photoIndex !== null && (
        <PhotoLightbox photos={photos} index={photoIndex} onIndex={setPhotoIndex} onClose={() => setPhotoIndex(null)} />
      )}
    </div>
  )
}
