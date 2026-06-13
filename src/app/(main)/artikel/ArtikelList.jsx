'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, BookOpen, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import AnimatedText from '@/components/AnimatedText'
import { useData } from '@/components/DataProvider'

const ArtikelList = () => {
  const { daftarArtikel } = useData()
  const router = useRouter()

  return (
    <>
      <TransitionEffect />
      <main className="flex w-full flex-col items-center justify-center text-white min-h-screen">
        <Layout className="pt-32 pb-16">
          <AnimatedText 
            text="ARTICLES." 
            className="mb-12 md:mb-20 !text-5xl sm:!text-6xl md:!text-7xl lg:!text-8xl font-display uppercase tracking-wider" 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {daftarArtikel && daftarArtikel.length > 0 ? (
              daftarArtikel.map((artikel) => (
                <motion.article 
                  key={artikel.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => router.push(`/artikel/${artikel.id}`)}
                  className="group cursor-pointer bg-logo-red/5 backdrop-blur-2xl border border-logo-red/20 rounded-3xl overflow-hidden hover:border-logo-red transition-colors duration-500 shadow-2xl flex flex-col relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-logo-red/0 to-logo-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  <div className="w-full h-48 sm:h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <img src={artikel.image || artikel.image_url || 'https://placehold.co/600x400/111/222?text=Artikel'} alt={artikel.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex flex-col flex-1 justify-between relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-logo-red/10 rounded-full blur-[40px] -z-10 group-hover:bg-logo-red/30 transition-all" />
                    <div>
                      <div className="flex items-center text-zinc-500 mb-4 text-xs font-bold uppercase tracking-widest">
                        <Clock className="w-3 h-3 mr-2" /> {artikel.date || (artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID') : 'Tanggal Rilis')}
                      </div>
                      <h2 className="text-2xl font-bold font-display text-white group-hover:text-logo-red transition-colors line-clamp-3 mb-4">
                        {artikel.title}
                      </h2>
                    </div>
                    <div className="flex items-center text-zinc-400 text-sm font-semibold mt-4 group-hover:text-white transition-colors">
                      Baca Selengkapnya <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-zinc-500 flex flex-col items-center">
                <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                <p>Belum ada artikel yang dipublikasikan.</p>
              </div>
            )}
          </div>
        </Layout>
      </main>
    </>
  )
}

export default ArtikelList;
