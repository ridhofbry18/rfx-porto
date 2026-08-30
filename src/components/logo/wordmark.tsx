import * as React from 'react'

/**
 * RFX Visual — Wordmark
 *
 * Tipografi sebagai identitas, bukan warna. Ketegangan antara "RFX" (display
 * condensed, berat) dan "VISUAL" (mono, tracking lebar) adalah keseluruhan
 * idenya. Monokrom penuh: mewarisi `currentColor`.
 *
 * Presisi: keduanya dikunci pada satu tinggi cap-height (`cap`) dan disejajarkan
 * lewat flexbox center + kotak berukuran cap yang di-set line-height:1, jadi
 * "VISUAL" benar-benar sejajar tengah terhadap tinggi "RFX" — bukan menempel di
 * baseline yang membuatnya terlihat melorot.
 */

type WordmarkProps = {
  /** tinggi cap-height acuan dalam px */
  size?: number
  variant?: 'lockup' | 'stack'
  bare?: boolean
  className?: string
  title?: string
}

const DISPLAY =
  "var(--font-display), 'Anton', 'Arial Narrow', system-ui, sans-serif"
const MONO =
  "var(--font-mono), 'Space Mono', ui-monospace, 'Courier New', monospace"

export default function Wordmark({
  size = 22,
  variant = 'lockup',
  bare = false,
  className = '',
  title = 'RFX Visual',
}: WordmarkProps) {
  const cap = size
  // Anton: cap-height ~0.73em → perbesar agar tinggi kapital = `cap`
  const rfxFont = Math.round(cap / 0.72)
  // Space Mono: cap-height ~0.68em → samakan tinggi kapital VISUAL ≈ 0.66 * cap
  const visualFont = Math.round(cap * 0.66 / 0.68)

  const capBox: React.CSSProperties = {
    height: cap,
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: 1,
  }

  const rfx = (
    <span style={{ ...capBox }}>
      <span
        style={{
          fontFamily: DISPLAY,
          fontSize: rfxFont,
          lineHeight: 1,
          letterSpacing: '-0.015em',
          display: 'block',
          // Anton punya ruang kosong di atas glyph; geser agar optik center
          transform: `translateY(${Math.round(cap * 0.07)}px)`,
        }}
      >
        RFX
      </span>
    </span>
  )

  const visual = (
    <span style={{ ...capBox }}>
      <span
        style={{
          fontFamily: MONO,
          fontSize: visualFont,
          lineHeight: 1,
          letterSpacing: '0.4em',
          textIndent: '0.4em',
          fontWeight: 400,
          textTransform: 'uppercase',
          display: 'block',
        }}
      >
        VISUAL
      </span>
    </span>
  )

  const divider = !bare && (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 1,
        height: variant === 'lockup' ? Math.round(cap * 0.82) : 1,
        alignSelf: 'center',
        background: 'currentColor',
        opacity: 0.3,
        margin: variant === 'lockup' ? `0 ${Math.round(cap * 0.42)}px` : `${Math.round(cap * 0.28)}px 0`,
      }}
    />
  )

  return (
    <span
      role="img"
      aria-label={title}
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: variant === 'lockup' ? 'row' : 'column',
        alignItems: variant === 'lockup' ? 'center' : 'flex-start',
        color: 'currentColor',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {rfx}
      {divider}
      {visual}
    </span>
  )
}
