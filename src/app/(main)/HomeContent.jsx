'use client'

import React, { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useData } from '@/components/DataProvider'
import Layout from '@/components/Layout'
import HireMe from '@/components/HireMe'
import TransitionEffect from '@/components/TransitionEffect'
import { ChevronRight, ArrowRight } from 'lucide-react'

const HomeContent = () => {
  const router = useRouter()
  const { configSitus, instagramConfig, daftarArtikel } = useData()
  const heroRef = useRef(null);
  const feedRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: feedScroll } = useScroll({ target: feedRef, offset: ['start end', 'end start'] });
  const heroRotate = useTransform(heroScroll, [0, 1], [0, -7]);
  const heroDepth = useTransform(heroScroll, [0, 1], [1, 0.92]);
  const heroY = useTransform(heroScroll, [0, 1], [0, 90]);
  const leftColumnX = useTransform(feedScroll, [0, 0.45, 1], [-38, 0, 16]);
  const centerColumnZ = useTransform(feedScroll, [0, 0.45, 1], [70, 0, -30]);
  const rightColumnX = useTransform(feedScroll, [0, 0.45, 1], [38, 0, -16]);
  const feedRotate = useTransform(feedScroll, [0, 0.45, 1], [10, 0, -6]);
  const igPosts = (() => {
    const raw = instagramConfig?.igFeedPosts || [];
    if (Array.isArray(raw)) return raw.concat(Array(9 - raw.length).fill('')).slice(0, 9);
    try { const parsed = JSON.parse(raw || '[]'); return Array.isArray(parsed) ? parsed.concat(Array(9 - parsed.length).fill('')).slice(0, 9) : Array(9).fill(''); } catch { return Array(9).fill(''); }
  })();


  return (
    <>
      <TransitionEffect />
      <section className="flex flex-col items-center justify-start text-white w-full min-h-screen">
        <Layout className="pt-24 sm:pt-32 lg:pt-28">
          <motion.div
            ref={heroRef}
            style={{ rotateX: heroRotate, scale: heroDepth, y: heroY, transformPerspective: 1200 }}
            className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-center overflow-hidden rounded-[2.4rem] border-4 border-[#F6D232] bg-black px-5 py-12 text-center shadow-[0_30px_100px_rgba(246,210,50,0.16)] sm:rounded-[4rem] sm:px-10 lg:min-h-[82vh] lg:px-14"
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-20 border-t border-white/20 opacity-70 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.68)_0_2px,transparent_2px_18px)] sm:inset-x-20" />
            <div className="pointer-events-none absolute left-[15%] top-16 text-sm font-mono text-zinc-500 sm:text-lg">-01</div>
            <div className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 text-sm font-mono text-zinc-500 sm:text-lg">00</div>
            <div className="pointer-events-none absolute right-[15%] top-16 text-sm font-mono text-zinc-500 sm:text-lg">01</div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative z-10 mx-auto max-w-5xl"
            >
              <p className="mx-auto mb-12 max-w-3xl text-base uppercase tracking-[0.18em] text-white sm:text-2xl md:text-3xl">
                {configSitus?.heroTagline || 'I create vibrant and colorful digital experiences'}
              </p>
              <div className="relative px-2 py-6 sm:px-8">
                <span className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-white/55 sm:h-11 sm:w-11" />
                <span className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-white/55 sm:h-11 sm:w-11" />
                <span className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-white/55 sm:h-11 sm:w-11" />
                <span className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-white/55 sm:h-11 sm:w-11" />
                <p className="font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                  {configSitus?.heroTitle1 || 'RFX.Visual'}
                </p>
                <h1 className="mt-1 font-display text-[5.3rem] font-black uppercase leading-[0.78] tracking-[-0.08em] text-[#F6D232] sm:text-[9rem] md:text-[12rem] lg:text-[15rem] xl:text-[17rem]">
                  {configSitus?.heroTitle2 || 'Visual Artist'}
                </h1>
              </div>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => router.push('/portofolio')}
                  className="group flex items-center rounded-full border border-white/35 bg-black/80 py-3 pl-7 pr-4 text-lg font-semibold uppercase tracking-wide text-white shadow-[0_0_0_7px_rgba(255,255,255,0.04)] transition hover:border-[#F6D232]"
                >
                  Lihat Karya <span className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F6D232] text-black transition group-hover:translate-x-1"><ArrowRight /></span>
                </button>
                <button
                  onClick={() => router.push('/kontak')}
                  className="text-base font-bold uppercase tracking-[0.25em] text-zinc-300 transition hover:text-[#F6D232]"
                >
                  Contact
                </button>
              </div>
            </motion.div>
          </motion.div>
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

              {/* Scroll-reactive 3D Grid: starts separated in 3 columns, then merges on scroll */}
              <motion.div ref={feedRef} style={{ rotateX: feedRotate, transformPerspective: 1000 }} className="grid grid-cols-3 gap-1 bg-black p-1 sm:gap-2 sm:p-2">
                {igPosts.map((postUrl, idx) => {
                  const columnStyle = idx % 3 === 0 ? { x: leftColumnX } : idx % 3 === 1 ? { z: centerColumnZ } : { x: rightColumnX };
                  return (
                  <motion.div key={idx} style={columnStyle} className="group relative aspect-[4/5] cursor-pointer overflow-hidden bg-zinc-900 shadow-2xl">
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
                  </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </Layout>
        </div>
      </section>
    </>
  )
}

export default HomeContent;
