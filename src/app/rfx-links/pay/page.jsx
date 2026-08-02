import { Suspense } from 'react'
import PayClient from './PayClient'

export const metadata = {
  title: 'Payment Gateway - RFX Visual',
  description: 'Gerbang pembayaran khusus untuk transaksi yang aman dan bebas hilang sesi.',
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Loading Gateway...</div>}>
      <PayClient />
    </Suspense>
  )
}
