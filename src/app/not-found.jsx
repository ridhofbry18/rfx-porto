import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-sans">
      <h1 className="text-8xl md:text-[12rem] font-black text-logo-red/30 font-display leading-none">404</h1>
      <h2 className="text-2xl md:text-4xl font-bold font-display uppercase tracking-wider mt-4">Halaman Tidak Ditemukan</h2>
      <p className="text-zinc-500 text-sm mt-4 max-w-md text-center">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-8 px-8 py-3 bg-logo-red text-white rounded-xl font-bold text-sm hover:bg-white hover:text-logo-red transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
