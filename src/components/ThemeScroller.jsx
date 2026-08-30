'use client'

import { useEffect } from 'react'

/**
 * ThemeScroller — mesin pengalaman warna situs.
 *
 * Setiap <section data-theme="light|dark"> adalah waypoint. Saat di-scroll,
 * warna kertas/tinta/abu di-root diinterpolasi halus: section gelap yang
 * mendekat menarik warna dari kertas ke tinta, lalu saat dilewati warna
 * kembali seperti semula. Hasilnya hero putih → perlahan hitam → perlahan
 * putih lagi, tanpa seam keras dan tanpa JS per-komponen.
 *
 * Halaman yang gelap menyeluruh tidak butuh JS: cukup bungkus konten dengan
 * class `theme-dark` (lihat globals.css) yang menimpa variabel secara statis.
 */

const THEMES = {
  light: { paper: [245, 243, 238], ink: [20, 18, 15], muted: [120, 114, 106] },
  dark: { paper: [16, 15, 13], ink: [241, 238, 231], muted: [146, 140, 131] },
}

const lerp = (a, b, t) => a + (b - a) * t
const mix = (a, b, t) => [0, 1, 2].map((i) => Math.round(lerp(a[i], b[i], t)))
const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function ThemeScroller() {
  useEffect(() => {
    const root = document.documentElement
    let waypoints = [] // { top: number, theme: 'light'|'dark' }

    const measure = () => {
      const els = document.querySelectorAll('[data-theme]')
      waypoints = Array.from(els).map((el) => ({
        top: el.getBoundingClientRect().top + window.scrollY,
        theme: el.dataset.theme === 'dark' ? 'dark' : 'light',
      }))
      waypoints.sort((a, b) => a.top - b.top)
    }

    // ukur ulang saat layout berubah (gambar terload, data datang, resize)
    const ro = new ResizeObserver(() => measure())
    ro.observe(document.body)
    window.addEventListener('resize', measure)

    let raf = 0
    let last = ''

    const paint = () => {
      raf = 0
      const vh = window.innerHeight
      const y = window.scrollY

      // tema "pangkalan": waypoint terakhir yang top-nya sudah lewat y
      let base = waypoints.length ? waypoints[0].theme : 'light'
      let next = null
      for (const w of waypoints) {
        if (w.top <= y) base = w.theme
        else if (w.theme !== base) { next = w; break }
      }

      const from = THEMES[base]
      let paper = from.paper
      let ink = from.ink
      let muted = from.muted

      // section berbeda-tema sedang masuk viewport → mulai tarik warna
      if (next) {
        const t = clamp01(1 - (next.top - y) / vh)
        if (t > 0) {
          const to = THEMES[next.theme]
          paper = mix(from.paper, to.paper, t)
          ink = mix(from.ink, to.ink, t)
          muted = mix(from.muted, to.muted, t)
        }
      }

      const sig = `${paper}|${ink}|${muted}`
      if (sig === last) return
      last = sig
      root.style.setProperty('--paper', paper.join(' '))
      root.style.setProperty('--ink', ink.join(' '))
      root.style.setProperty('--muted', muted.join(' '))
      root.style.setProperty('--paper-2', mix(paper, ink, 0.06).join(' '))
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    window.addEventListener('scroll', onScroll, { passive: true })

    measure()
    paint()

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
