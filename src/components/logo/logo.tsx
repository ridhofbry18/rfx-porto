import * as React from 'react'

/**
 * RFX Visual — Mark (monogram)
 *
 * Monogram "RFX" yang dibingkai crop-mark (tanda potong) di empat sudut —
 * motif kropping/framing seorang fotografer & videografer, bukan ikon kamera
 * yang klise. Framing itulah yang membuat inisial terbaca sebagai "karya yang
 * dibingkai", bukan sekadar teks. Monokrom, mengikuti `currentColor`.
 *
 * Dipakai untuk favicon, nav mobile terkompresi, dan avatar.
 */

type LogoProps = {
  size?: number
  /** tampilkan crop-mark sudut */
  frame?: boolean
  className?: string
  title?: string
}

const DISPLAY =
  "var(--font-display), 'Anton', 'Arial Narrow', system-ui, sans-serif"

export default function Logo({
  size = 40,
  frame = true,
  className = '',
  title = 'RFX Visual',
}: LogoProps) {
  const s = 64
  const inset = 6
  const tick = 11
  const stroke = 2.4

  const corner = (x1: number, y1: number, x2: number, y2: number) => (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y1} />
      <line x1={x1} y1={y1} x2={x1} y2={y2} />
    </>
  )

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <title>{title}</title>

      {frame && (
        <g
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="square"
          opacity={0.55}
        >
          {/* kiri-atas */}
          {corner(inset, inset, inset + tick, inset + tick)}
          {/* kanan-atas */}
          <line x1={s - inset} y1={inset} x2={s - inset - tick} y2={inset} />
          <line x1={s - inset} y1={inset} x2={s - inset} y2={inset + tick} />
          {/* kiri-bawah */}
          <line x1={inset} y1={s - inset} x2={inset + tick} y2={s - inset} />
          <line x1={inset} y1={s - inset} x2={inset} y2={s - inset - tick} />
          {/* kanan-bawah */}
          <line x1={s - inset} y1={s - inset} x2={s - inset - tick} y2={s - inset} />
          <line x1={s - inset} y1={s - inset} x2={s - inset} y2={s - inset - tick} />
        </g>
      )}

      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: '-0.03em',
        }}
      >
        RFX
      </text>
    </svg>
  )
}
