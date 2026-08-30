import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-6 text-center font-sans">
      <h1 className="font-display uppercase text-[clamp(5rem,20vw,14rem)] leading-none">404</h1>
      <h2 className="text-2xl md:text-4xl font-bold font-display uppercase tracking-wider mt-4">Halaman Tidak Ditemukan</h2>
      <p className="text-muted text-sm mt-4 max-w-md">
        Mungkin sudah dipindah, mungkin memang tidak pernah ada.
      </p>
      <Link
        href="/"
        className="mt-8 link-underline font-medium"
      >
        Kembali ke beranda
      </Link>
    </div>
  )
}
