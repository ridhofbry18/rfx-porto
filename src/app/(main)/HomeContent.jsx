'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '@/components/DataProvider'
import AnimatedText from '@/components/AnimatedText'
import Layout from '@/components/Layout'
import HireMe from '@/components/HireMe'
import TransitionEffect from '@/components/TransitionEffect'
import { ExternalLink, ChevronRight } from 'lucide-react'

const HomeContent = () => {
  const router = useRouter()
  const { configSitus, instagramConfig, daftarKarya, daftarArtikel } = useData()
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = daftarKarya?.filter(k => k.category === 'photo') || [];
  const igPosts = (() => {
    const raw = instagramConfig?.igFeedPosts || [];
    if (Array.isArray(raw)) return raw.concat(Array(9 - raw.length).fill('')).slice(0, 9);
    try { const parsed = JSON.parse(raw || '[]'); return Array.isArray(parsed) ? parsed.concat(Array(9 - parsed.length).fill('')).slice(0, 9) : Array(9).fill(''); } catch { return Array(9).fill(''); }
  })();

  useEffect(() => {
    if (photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos]);

  return (
    <>
      <TransitionEffect />
      <section className="flex flex-col items-center justify-start text-white w-full min-h-screen">
        <Layout className="pt-24 sm:pt-32 lg:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16 w-full text-center lg:text-left mt-8 lg:mt-0">
            {/* Text & Buttons */}
            <div className="order-1 lg:order-2 w-full flex flex-col items-center lg:items-start p-8 sm:p-12 bg-logo-red/5 backdrop-blur-2xl border border-logo-red/20 rounded-3xl shadow-2xl relative">
              <div className="absolute top-0 -right-2 sm:-right-3 -z-10 w-[101%] h-[102%] sm:h-[103%] rounded-[1.5rem] sm:rounded-[2rem] bg-logo-red/30 blur-sm" />
              <AnimatedText
                text={`${configSitus?.heroTitle1 || 'Visual'} ${configSitus?.heroTitle2 || 'Artist.'}`}
                className="!text-5xl sm:!text-6xl md:!text-7xl lg:!text-left lg:!text-7xl xl:!text-8xl text-white uppercase font-display tracking-tight"
                highlightIndices={[1]}
              />
              <p className="mt-4 mb-8 text-sm sm:text-base md:text-lg font-bold text-zinc-400 text-center lg:text-left">
                {configSitus?.heroTagline || "Menangkap Momen, Menciptakan Mahakarya. Berbasis di Malang."}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-2">
                <button
                  onClick={() => router.push('/portofolio')}
                  className="flex items-center bg-logo-red text-white py-3 px-8 rounded-xl text-base sm:text-lg font-bold hover:bg-white hover:text-logo-red border-2 border-solid border-transparent transition-all shadow-[0_0_20px_rgba(211,34,42,0.4)]"
                >
                  Lihat Karya <ExternalLink className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => router.push('/kontak')}
                  className="text-base sm:text-lg font-medium capitalize text-white underline underline-offset-8 hover:text-logo-red transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Image / Photo Carousel */}
            <div className="order-2 lg:order-1 w-full flex justify-center mb-8 lg:mb-0 relative">
              {photos.length > 0 ? (
                <div className="w-full max-w-[720px] aspect-[4/5] lg:aspect-[3/4] max-h-[70vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(211,34,42,0.3)] border border-white/5 relative bg-[#0a0a0a]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`bg-${currentIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      src={photos[currentIndex].image}
                      className="absolute inset-0 w-full h-full object-cover blur-2xl"
                    />
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full z-10"
                    >
                      <img
                        src={photos[currentIndex].image}
                        alt={photos[currentIndex].title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <motion.img
                  src={configSitus?.heroImage || 'https://placehold.co/600x800/111/222?text=RFX+Visual'}
                  alt="RFX Visual"
                  className="w-full max-w-sm md:max-w-md lg:max-w-full h-auto max-h-[50vh] lg:max-h-[70vh] object-cover rounded-3xl shadow-[0_0_50px_rgba(211,34,42,0.3)] border border-white/5"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              )}
            </div>
          </div>
        </Layout>

        <HireMe />

        {/* Article Spoiler Carousel */}
        {daftarArtikel && daftarArtikel.length > 0 && (
          <div className="w-full relative z-20 pt-20 pb-16">
            <Layout>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase font-bold text-white tracking-tight">Baca <span className="text-logo-red">Artikel</span></h2>
                <button onClick={() => router.push('/artikel')} className="text-zinc-400 hover:text-white flex items-center text-sm font-medium transition-colors">
                  Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory custom-scrollbar">
                {daftarArtikel.slice(0, 5).map(artikel => (
                  <div key={artikel.id} onClick={() => router.push(`/artikel/${artikel.id}`)} className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-logo-red/5 backdrop-blur-xl border border-logo-red/20 rounded-2xl overflow-hidden group hover:border-logo-red/50 transition-colors cursor-pointer">
                    <div className="w-full h-40 overflow-hidden relative">
                      <img src={artikel.image || artikel.image_url || 'https://placehold.co/600x400/111/222?text=Article'} alt={artikel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
                    </div>
                    <div className="p-5">
                      <p className="text-logo-red text-xs font-bold uppercase tracking-widest mb-2">{artikel.category || 'Berita'}</p>
                      <h3 className="text-white text-lg font-bold line-clamp-2 leading-tight mb-3 group-hover:text-logo-red transition-colors">{artikel.title}</h3>
                      <p className="text-zinc-400 text-sm line-clamp-3">{artikel.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Layout>
          </div>
        )}

        {/* Instagram-style Feed Panel */}
        <div className="w-full relative z-20 pb-20">
          <Layout>
            <div className="max-w-[935px] mx-auto bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              {/* IG Header */}
              <div className="p-6 sm:p-10 border-b border-zinc-800">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 lg:gap-20 items-start sm:items-center mb-6">
                  {/* Profile Picture */}
                  <div className="shrink-0">
                    <div className="w-20 h-20 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center p-1">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        {instagramConfig?.igProfileImage ? (
                          <img src={instagramConfig.igProfileImage} alt="IG Profile" className="w-full h-full object-cover block" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 bg-zinc-900">No Pic</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6">
                      <h3 className="text-xl font-normal text-[#F5F5F5]">{instagramConfig?.igUsername || 'rfx.visual'}</h3>
                      <div className="flex items-center gap-2">
                        <a href={`https://instagram.com/${instagramConfig?.igUsername || 'rfx.visual'}`} target="_blank" rel="noreferrer" className="px-5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-[#F5F5F5] text-sm font-semibold rounded-lg transition-colors">
                          View Profile
                        </a>
                        <button className="px-4 py-1.5 bg-logo-red hover:bg-logo-red-light text-white text-sm font-semibold rounded-lg transition-colors">
                          Follow
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-8 mb-6 text-[15px] text-[#F5F5F5]">
                      <span><span className="font-semibold">{igPosts.filter(p => p).length}</span> posts</span>
                      <span><span className="font-semibold">237</span> followers</span>
                      <span><span className="font-semibold">216</span> following</span>
                    </div>

                    <div className="text-[14px] text-[#F5F5F5] leading-relaxed">
                      <span className="font-semibold block">{configSitus?.heroTitle1 || 'RFX'} {configSitus?.heroTitle2 || 'Visual'}</span>
                      <span className="text-zinc-400 block mb-1">Visual Artist</span>
                      <p className="whitespace-pre-line">{instagramConfig?.igBio || 'Menangkap Momen, Menciptakan Mahakarya.\nBerbasis di Malang.'}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="flex sm:hidden items-center justify-around py-3 border-t border-zinc-800 text-sm text-[#F5F5F5]">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{igPosts.filter(p => p).length}</span>
                    <span className="text-zinc-500 text-xs">posts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">237</span>
                    <span className="text-zinc-500 text-xs">followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">216</span>
                    <span className="text-zinc-500 text-xs">following</span>
                  </div>
                </div>
              </div>

              {/* Grid 3x3 */}
              <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-2 bg-black">
                {igPosts.map((postUrl, idx) => (
                  <div key={idx} className="relative aspect-[4/5] overflow-hidden bg-zinc-900 group cursor-pointer">
                    {postUrl ? (
                      <a href={postUrl} target="_blank" rel="noreferrer" className="block w-full h-full">
                        <img src={postUrl} alt={`IG feed ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </a>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-700">
                        Post {idx + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Layout>
        </div>
      </section>
    </>
  )
}

export default HomeContent;
