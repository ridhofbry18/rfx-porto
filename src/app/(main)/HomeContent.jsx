'use client'

import React, { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useData } from '@/components/DataProvider'
import Layout from '@/components/Layout'
import HireMe from '@/components/HireMe'
import TransitionEffect from '@/components/TransitionEffect'
import { ChevronRight, ArrowRight, Instagram, Linkedin, Music2 } from 'lucide-react'

// Custom Hand-drawn Arrow Component
const CurvedArrow = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 10 C 40 10, 60 40, 50 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M35 70 L 50 85 L 65 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

const CurvedArrowRight = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 80 C 40 90, 80 60, 90 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M70 30 L 90 20 L 95 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

const AnimatedArticles = ({ daftarArtikel, router }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background Mesh
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  // Card 1 (Center)
  const yCard1 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.75, 0.8], ["100vh", "100vh", "0vh", "0vh", "0vh"]);
  const rotateCard1 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.75, 0.8], [20, 20, 0, 0, 0]);
  const scaleCard1 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.75, 0.8], [0.8, 0.8, 1, 1, 0.9]);

  // Card 2 (Left Fan)
  const xCard2 = useTransform(scrollYProgress, [0, 0.4, 0.55, 0.65, 0.75, 0.8], ["0%", "0%", "-40%", "-40%", "0%", "0%"]);
  const rotateCard2 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.55, 0.65, 0.75, 0.8], [20, 20, 0, -12, -12, 0, 0]);
  const yCard2 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.55, 0.65, 0.75, 0.8], ["100vh", "100vh", "0vh", "8vh", "8vh", "0vh", "0vh"]);

  // Card 3 (Right Fan)
  const xCard3 = useTransform(scrollYProgress, [0, 0.4, 0.55, 0.65, 0.75, 0.8], ["0%", "0%", "40%", "40%", "0%", "0%"]);
  const rotateCard3 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.55, 0.65, 0.75, 0.8], [20, 20, 0, 12, 12, 0, 0]);
  const yCard3 = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.55, 0.65, 0.75, 0.8], ["100vh", "100vh", "0vh", "8vh", "8vh", "0vh", "0vh"]);

  // Floating Decor Parallax
  const float1Y = useTransform(scrollYProgress, [0, 1], ["150vh", "-50vh"]);
  const float1Rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const float2Y = useTransform(scrollYProgress, [0, 1], ["-50vh", "150vh"]);
  const float2Rotate = useTransform(scrollYProgress, [0, 1], [45, -180]);
  const float3Y = useTransform(scrollYProgress, [0, 1], ["100vh", "-100vh"]);
  const float3Rotate = useTransform(scrollYProgress, [0, 1], [0, -360]);

  if (!daftarArtikel || daftarArtikel.length === 0) return null;

  return (
    <section ref={containerRef} className="relative z-30 w-full bg-[#110505] rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] h-[400vh]">

      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 overflow-hidden rounded-t-[3rem] pointer-events-none">
        <motion.div style={{ y: y1 }} className="absolute top-0 left-0 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#943838]/30 rounded-full blur-[100px]" />
        <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 w-[200vw] h-[150vw] md:w-[50vw] md:h-[50vw] bg-red-900/20 rounded-full blur-[120px]" />
      </div>



      {/* Sticky Scroll Container - Holds only the animated cards */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-20 pointer-events-none">

        {/* Floating Flying Decor */}
        <motion.div style={{ y: float1Y, rotate: float1Rotate }} className="absolute top-[10%] left-[10%] md:left-[20%] w-16 h-16 border-[3px] border-[#943838]/30 rounded-xl" />
        <motion.div style={{ y: float2Y, rotate: float2Rotate }} className="absolute top-[20%] right-[10%] md:right-[15%] w-12 h-12 border-[2px] border-white/20" />
        <motion.div style={{ y: float3Y, rotate: float3Rotate }} className="absolute bottom-[20%] left-[5%] md:left-[25%] w-24 h-24 border-[2px] border-[#943838]/20 rounded-full flex items-center justify-center">
           <div className="w-8 h-8 bg-[#943838]/20 rounded-full" />
        </motion.div>

        {/* Header */}
        <div className="absolute top-28 md:top-36 w-full px-6 md:px-12 flex items-center justify-between z-50 pointer-events-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase font-bold text-white tracking-tight">
            LATEST <span className="text-[#943838]">ARTICLES</span>
          </h2>
          <button onClick={() => router.push('/artikel')} className="text-white/70 hover:text-white flex items-center text-xs md:text-sm font-medium transition-colors uppercase tracking-widest bg-black/40 px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-md border border-white/10">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Cards Wrapper */}
        <div className="relative w-[85%] max-w-sm md:max-w-md aspect-[3/4] md:aspect-[4/5] flex items-center justify-center mt-10 pointer-events-auto">

          {/* Card 1 (Center) */}
          {daftarArtikel[0] && (
            <motion.div
              style={{ y: yCard1, rotate: rotateCard1, scale: scaleCard1, zIndex: 30 }}
              className="absolute inset-0 bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(148,56,56,0.2)] cursor-pointer hover:border-[#943838]/50 hover:shadow-[0_0_60px_rgba(148,56,56,0.6)] transition-all duration-300"
              onClick={() => router.push(`/articles/${daftarArtikel[0].slug}`)}
            >
              <div className="w-full h-[55%] overflow-hidden relative">
                <img src={daftarArtikel[0].image || daftarArtikel[0].image_url || 'https://placehold.co/800x600/111/222?text=Article'} alt={daftarArtikel[0].title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-90" />
              </div>
              <div className="p-6 md:p-8 flex flex-col h-[45%] bg-[#0a0a0a]">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">{daftarArtikel[0].category || 'Berita'}</p>
                <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight mb-3 group-hover:text-[#943838] transition-colors line-clamp-2">{daftarArtikel[0].title}</h3>
                <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">{daftarArtikel[0].summary}</p>
              </div>
            </motion.div>
          )}

          {/* Card 2 (Left Fan) */}
          {daftarArtikel[1] && (
            <motion.div
              style={{ x: xCard2, y: yCard2, rotate: rotateCard2, zIndex: 20 }}
              className="absolute inset-0 bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(148,56,56,0.2)] cursor-pointer hover:border-[#943838]/50 hover:shadow-[0_0_60px_rgba(148,56,56,0.6)] transition-all duration-300"
              onClick={() => router.push(`/articles/${daftarArtikel[1].slug}`)}
            >
              <div className="w-full h-[55%] overflow-hidden relative">
                <img src={daftarArtikel[1].image || daftarArtikel[1].image_url || 'https://placehold.co/800x600/111/222?text=Article'} alt={daftarArtikel[1].title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-90" />
              </div>
              <div className="p-6 md:p-8 flex flex-col h-[45%] bg-[#0a0a0a]">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">{daftarArtikel[1].category || 'Berita'}</p>
                <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight mb-3 group-hover:text-[#943838] transition-colors line-clamp-2">{daftarArtikel[1].title}</h3>
                <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">{daftarArtikel[1].summary}</p>
              </div>
            </motion.div>
          )}

          {/* Card 3 (Right Fan) */}
          {daftarArtikel[2] && (
            <motion.div
              style={{ x: xCard3, y: yCard3, rotate: rotateCard3, zIndex: 10 }}
              className="absolute inset-0 bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(148,56,56,0.2)] cursor-pointer hover:border-[#943838]/50 hover:shadow-[0_0_60px_rgba(148,56,56,0.6)] transition-all duration-300"
              onClick={() => router.push(`/articles/${daftarArtikel[2].slug}`)}
            >
              <div className="w-full h-[55%] overflow-hidden relative">
                <img src={daftarArtikel[2].image || daftarArtikel[2].image_url || 'https://placehold.co/800x600/111/222?text=Article'} alt={daftarArtikel[2].title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] to-transparent opacity-90" />
              </div>
              <div className="p-6 md:p-8 flex flex-col h-[45%] bg-[#151515]">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">{daftarArtikel[2].category || 'Berita'}</p>
                <h3 className="text-white text-xl md:text-2xl font-display font-bold leading-tight mb-3 group-hover:text-[#943838] transition-colors line-clamp-2">{daftarArtikel[2].title}</h3>
                <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">{daftarArtikel[2].summary}</p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  )
}

const AnimatedInstagramGrid = ({ igPosts, instagramConfig, configSitus }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const profileOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const profileY = useTransform(scrollYProgress, [0.2, 0.35], [50, 0]);

  const row1Opacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const row1Y = useTransform(scrollYProgress, [0.3, 0.45], [50, 0]);

  const row2Opacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const row2Y = useTransform(scrollYProgress, [0.45, 0.6], [50, 0]);

  const row3Opacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const row3Y = useTransform(scrollYProgress, [0.6, 0.75], [50, 0]);

  // Watermark text animation
  const watermarkSpacing = useTransform(scrollYProgress, [0, 0.8], ["15vw", "-1vw"]);

  // Converging Particles
  const p1X = useTransform(scrollYProgress, [0, 0.8], ["-50vw", "0vw"]);
  const p1Y = useTransform(scrollYProgress, [0, 0.8], ["-50vh", "0vh"]);
  
  const p2X = useTransform(scrollYProgress, [0, 0.8], ["50vw", "0vw"]);
  const p2Y = useTransform(scrollYProgress, [0, 0.8], ["-50vh", "0vh"]);
  
  const p3X = useTransform(scrollYProgress, [0, 0.8], ["-50vw", "0vw"]);
  const p3Y = useTransform(scrollYProgress, [0, 0.8], ["50vh", "0vh"]);
  
  const p4X = useTransform(scrollYProgress, [0, 0.8], ["50vw", "0vw"]);
  const p4Y = useTransform(scrollYProgress, [0, 0.8], ["50vh", "0vh"]);
  
  const pRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  return (
    <section ref={containerRef} className="relative z-40 w-full bg-[#0a0a0a] rounded-t-[3rem] shadow-[0_-30px_60px_rgba(0,0,0,0.6)] -mt-[100vh] overflow-clip">

      {/* Background Grid Pattern & Watermark */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* Converging Particles */}
          <motion.div style={{ x: p1X, y: p1Y, rotate: pRotate }} className="absolute top-[20%] left-[15%] w-8 h-8 text-[#943838]/40 flex items-center justify-center font-bold text-4xl select-none">+</motion.div>
          <motion.div style={{ x: p2X, y: p2Y, rotate: pRotate }} className="absolute top-[15%] right-[20%] w-10 h-10 border-2 border-[#943838]/30 rounded-full" />
          <motion.div style={{ x: p3X, y: p3Y, rotate: pRotate }} className="absolute bottom-[25%] left-[20%] w-12 h-12 border-2 border-white/10" />
          <motion.div style={{ x: p4X, y: p4Y, rotate: pRotate }} className="absolute bottom-[20%] right-[15%] w-6 h-6 bg-[#943838]/20 rotate-45" />

          <motion.h2 
            style={{ letterSpacing: watermarkSpacing }}
            className="text-[25vw] font-display font-black text-white/[0.02] whitespace-nowrap select-none"
          >
            SOCIALS
          </motion.h2>
        </div>
      </div>

      {/* Scrolling wrapper for the IG grid. It unpins before the section ends. */}
      <div className="relative z-20 h-[200vh] w-full">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-24 md:pt-32 pb-10 pointer-events-none">
          <motion.div
            className="w-full px-4 md:px-8 max-w-[850px] mx-auto scale-[0.80] sm:scale-[0.85] md:scale-90 lg:scale-95 origin-top md:origin-center pointer-events-auto"
          >
          <div className="bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl">
            {/* IG Header */}
            <motion.div
              style={{ opacity: profileOpacity, y: profileY }}
              className="p-6 sm:p-10 border-b border-zinc-800"
            >
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 lg:gap-16 items-start sm:items-center mb-6">
                {/* Profile Picture */}
                <div className="shrink-0">
                  <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#943838] bg-zinc-950 flex items-center justify-center p-1">
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
                      <button className="px-4 py-1.5 bg-[#943838] hover:bg-white hover:text-black text-white text-sm font-semibold rounded-lg transition-colors">
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
                    <span className="font-semibold block uppercase">{configSitus?.heroTitle1 || 'RFX'} {configSitus?.heroTitle2 || 'Visual'}</span>
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
            </motion.div>

            {/* Grid Feed */}
            <div className="grid grid-cols-3 gap-1 bg-black p-1 sm:gap-2 sm:p-2">
              {igPosts.map((postUrl, idx) => {
                const isRow1 = idx < 3;
                const isRow2 = idx >= 3 && idx < 6;
                const isRow3 = idx >= 6;

                let opacity = row1Opacity;
                let y = row1Y;

                if (isRow2) {
                  opacity = row2Opacity;
                  y = row2Y;
                } else if (isRow3) {
                  opacity = row3Opacity;
                  y = row3Y;
                }

                return (
                  <motion.div
                    key={idx}
                    style={{ opacity, y }}
                    className="group relative aspect-square cursor-pointer overflow-hidden bg-zinc-900 shadow-2xl"
                  >
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
            </div>
          </div>
        </motion.div>
      </div>
      </div>

      {/* Empty spacer to receive the Mascot Fire overlap without blocking the grid */}
      <div className="h-[50vh] w-full relative z-10" />

    </section>
  )
}

const HomeContent = () => {
  const router = useRouter()
  const { configSitus, instagramConfig, daftarArtikel } = useData()

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textScaleScroll = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textXLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const textXRight = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const charY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const decoRotate = useTransform(scrollYProgress, [0, 1], [45, 225]);

  // For Instagram Feed (kept simple for now)
  const igPosts = (() => {
    const raw = instagramConfig?.igFeedPosts || [];
    if (Array.isArray(raw)) return raw.concat(Array(9 - raw.length).fill('')).slice(0, 9);
    try { const parsed = JSON.parse(raw || '[]'); return Array.isArray(parsed) ? parsed.concat(Array(9 - parsed.length).fill('')).slice(0, 9) : Array(9).fill(''); } catch { return Array(9).fill(''); }
  })();

  return (
    <>
      <TransitionEffect />
      <div ref={containerRef} className="relative w-full">
        {/* HERO SECTION - PARALLAX BACKGROUND */}
        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden z-0"
        >
          {/* Corner Framing */}
          <div className="absolute inset-4 md:inset-10 border-white/20 pointer-events-none z-20">
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-white"></div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-white"></div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-white"></div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-white"></div>
          </div>

          {/* Top Left Text */}
          <div className="absolute top-24 left-8 md:top-32 md:left-20 z-20">
            <p className="font-display text-white text-lg md:text-2xl tracking-wide">Welcome To My Portfolio</p>
          </div>

          {/* Giant Typography */}
          <motion.div 
            style={{ scale: textScaleScroll }} 
            animate={{ scale: [1, 1.03, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute z-10 w-full flex flex-col items-center justify-center font-display font-black text-white leading-[0.85] tracking-tighter select-none mt-10 md:mt-0"
          >
            <motion.h1 style={{ x: textXLeft }} className="text-[23vw] md:text-[15vw] drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">RIDHO</motion.h1>
            <motion.h1 style={{ x: textXRight }} className="text-[23vw] md:text-[15vw] drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">VISUAL</motion.h1>
          </motion.div>

          {/* 3D Character */}
          <motion.div style={{ y: charY }} className="relative z-20 w-[90%] max-w-[600px] h-[65vh] md:h-[80vh] flex items-end justify-center pb-10 md:pb-0">
            <img
              src="/hero_3d_character.webp"
              alt="Hero Character"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
              }}
            />
          </motion.div>

          {/* Decorative Elements */}
          <motion.div style={{ rotate: decoRotate }} className="absolute left-10 md:left-[15%] top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <div className="w-24 h-24 border-2 border-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white bg-white/10 backdrop-blur-sm"></div>
              </div>
            </div>
          </motion.div>

          {/* Just scroll down arrow */}
          <div className="absolute right-10 md:right-[20%] top-[30%] z-20 hidden md:flex flex-col items-center">
            <CurvedArrow className="w-16 h-16 text-white opacity-80" />
            <p className="font-display text-white mt-2">Just scroll down</p>
          </div>

          {/* Explore More Button */}
          <div className="absolute bottom-8 left-8 md:bottom-20 md:left-20 z-20">
            <button
              onClick={() => router.push('/portofolio')}
              className="flex items-center gap-2 font-display text-white text-lg md:text-2xl font-bold uppercase hover:text-white/70 transition-colors"
            >
              EXPLORE MORE <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Follow Me Socials (Hidden on Mobile) */}
          <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 z-20 hidden md:flex flex-col items-end">
            <div className="flex items-center gap-4 mb-2">
              <p className="font-display text-white text-2xl font-bold">Follow me</p>
              <CurvedArrowRight className="w-10 h-10 text-white opacity-80 -scale-x-100 rotate-90" />
            </div>
            <div className="flex gap-4">
              <a href="https://instagram.com/rfx.visual" target="_blank" rel="noreferrer" className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" rel="noreferrer" className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <span className="font-bold font-display">Bē</span>
              </a>
              <a href="#" className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Music2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* INVISIBLE SPACER FOR PARALLAX */}
        <div className="w-full h-screen"></div>

        {/* OVERLAPPING CONTENT SECTION 1: CINEMATIC ARTICLES */}
        <AnimatedArticles daftarArtikel={daftarArtikel} router={router} />

        {/* OVERLAPPING CONTENT SECTION 2: INSTAGRAM */}
        <AnimatedInstagramGrid igPosts={igPosts} instagramConfig={instagramConfig} configSitus={configSitus} />
      </div>
    </>
  )
}

export default HomeContent;
