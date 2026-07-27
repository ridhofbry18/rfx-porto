'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import { useData } from '@/components/DataProvider'
import { BookOpen, Feather } from 'lucide-react'

const ArtikelList = () => {
  const { daftarArtikel } = useData()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredArticle, setHoveredArticle] = useState(null)
  const [particles, setParticles] = useState([])
  const flipAudioRef = React.useRef(null)

  const articlesWithPages = useMemo(() => {
    if (!daftarArtikel) return [];
    let currentPg = 1;
    return daftarArtikel.map(a => {
      const length = a.content ? a.content.length : 0;
      const pages = Math.max(1, Math.ceil(length / 1200));
      const startPg = currentPg;
      currentPg += pages;
      return { ...a, startPg, totalPages: pages };
    });
  }, [daftarArtikel]);

  useEffect(() => {
    setParticles(Array.from({ length: 30 }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 5,
      size: Math.random() * 3 + 1
    })))
  }, [])

  const handleOpenBook = () => {
    if (!daftarArtikel || daftarArtikel.length === 0) return;
    setIsOpen(true);
    if (flipAudioRef.current) {
      flipAudioRef.current.currentTime = 0;
      flipAudioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
  }

  const handleCloseBook = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    if (flipAudioRef.current) {
      flipAudioRef.current.currentTime = 0;
      flipAudioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
  }

  return (
    <>
      <TransitionEffect />
      <main className="flex w-full flex-col items-center justify-center text-white min-h-screen overflow-hidden relative">
        
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute bg-logo-red/20 rounded-full blur-[1px]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ 
                y: ["0vh", "-100vh"], 
                x: ["0vw", `${(Math.random() - 0.5) * 50}vw`] 
              }}
              transition={{ 
                duration: p.duration, 
                delay: p.delay, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div>

        <Layout className="pt-32 pb-16 w-full flex flex-col items-center relative z-10">
          
          <div className="mb-16 text-center">
             <h2 className="text-zinc-500 tracking-[0.3em] uppercase text-sm font-bold mb-4">The Library</h2>
             <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white drop-shadow-lg">
                READ OUR <span className="text-logo-red">STORIES</span>
             </h1>
          </div>

          {articlesWithPages && articlesWithPages.length > 0 ? (
            <div 
              className="relative group cursor-pointer hover:scale-105 transition-transform duration-700" 
              style={{ perspective: '2000px' }}
              onClick={handleOpenBook}
            >
              
              {/* Stack of pages (The Book Block) */}
              <div className="absolute top-[2%] left-0 w-full h-[96%] bg-[#e5e5e5] rounded-r-3xl shadow-[20px_20px_50px_rgba(0,0,0,0.5)] border-y border-r border-[#d4d4d4] flex items-center justify-center" style={{ transform: 'translateZ(-10px)' }}>
                 {/* Page Lines Texture */}
                 <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-black/20 to-transparent rounded-r-3xl" />
              </div>
              <div 
                className="absolute top-[3%] left-0 w-full h-[94%] bg-[#f5f5f5] rounded-r-3xl border-y border-r border-[#e5e5e5] p-6 sm:p-10 flex flex-col z-0" 
                style={{ transform: 'translateZ(-20px)' }}
              >
                <h2 className="text-black font-display font-black text-2xl border-b border-black/20 pb-4 mb-4 relative z-10">DAFTAR ISI</h2>
                
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-black/20 pr-2 relative z-10">
                  {articlesWithPages.map((artikel, idx) => (
                    <div 
                      key={artikel.id} 
                      onClick={(e) => { e.stopPropagation(); router.push(`/artikel/${artikel.id}`) }}
                      onMouseEnter={() => setHoveredArticle(artikel)}
                      onMouseLeave={() => setHoveredArticle(null)}
                      className="flex items-center justify-between text-black mb-4 cursor-pointer hover:text-logo-red transition-colors group"
                    >
                      <div className="flex-1 overflow-hidden">
                        <span className="font-serif text-sm sm:text-base font-medium truncate block">{idx + 1}. {artikel.title}</span>
                      </div>
                      <div className="flex items-center text-black/30 group-hover:text-logo-red/50 mx-2 flex-1 border-b border-dotted border-black/30" />
                      <span className="font-mono text-xs font-bold text-black/50 group-hover:text-logo-red shrink-0">Pg. {artikel.startPg}</span>
                    </div>
                  ))}
                </div>

                <div className="text-black/40 text-xs font-mono mt-4 text-center border-t border-black/10 pt-4 relative z-10">
                  {articlesWithPages.length} Articles Available
                </div>
              </div>

              {/* The Cover */}
              <motion.div 
                className="w-[280px] h-[400px] sm:w-[400px] sm:h-[550px] relative origin-left"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ rotateY: -15 }}
                animate={isOpen ? { rotateY: -140 } : { rotateY: -15 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={!isOpen ? { rotateY: -25 } : {}}
              >
                
                {/* Front Cover */}
                <div 
                  className="absolute inset-0 bg-[#2b1b17] border-[2px] border-[#4a2e27] rounded-r-3xl flex flex-col items-center justify-center p-8 overflow-hidden shadow-[inset_15px_0_50px_rgba(0,0,0,0.9)]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Leather Noise Texture */}
                  <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-30 pointer-events-none mix-blend-overlay" />
                  
                  {/* Spine Darkening */}
                  <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
                  
                  {/* Inner Decorative Motif/Borders */}
                  <div className="absolute inset-5 border border-[#5a3a31]/60 rounded-xl pointer-events-none z-10" />
                  <div className="absolute inset-7 border border-[#5a3a31]/30 rounded-lg pointer-events-none z-10" />

                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center mb-8 relative z-20">
                    <Feather className="w-16 h-16 sm:w-20 sm:h-20 text-[#b07a68] opacity-80 drop-shadow-md" strokeWidth={1} />
                  </div>

                  <h1 className="font-serif italic font-normal text-4xl sm:text-6xl text-[#e8dac7] tracking-[0.15em] text-center drop-shadow-lg z-20">
                    ARTICLES
                  </h1>
                  
                  <div className="mt-8 flex items-center gap-4 z-20 opacity-80">
                    <div className="w-8 border-t border-[#b07a68]/50" />
                    <p className="text-[#b07a68] font-serif tracking-[0.3em] text-xs sm:text-sm">
                      VOLUME I
                    </p>
                    <div className="w-8 border-t border-[#b07a68]/50" />
                  </div>
                  
                  {/* Click to open badge */}
                  <div className="absolute bottom-6 right-6 bg-[#4a2e27] border border-[#5a3a31] text-[#e8dac7] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full animate-pulse z-20 shadow-lg">
                    Open Book
                  </div>
                </div>

                {/* Inside Cover */}
                <div 
                  className="absolute inset-0 bg-[#111] rounded-l-3xl border border-white/10 flex flex-col items-center justify-center p-8 shadow-[inset_-10px_0_30px_rgba(0,0,0,0.8)] cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                  onClick={handleCloseBook}
                >
                   <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-black/80 to-transparent" />
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={isOpen ? { opacity: 1 } : { opacity: 0 }} 
                     transition={{ delay: 0.5, duration: 0.5 }}
                     className="text-center"
                   >
                     <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4 flex items-center justify-center">
                       <span className="text-white text-xl font-bold">✕</span>
                     </div>
                     <p className="text-zinc-500 font-mono text-sm tracking-widest">TUTUP BUKU</p>
                   </motion.div>
                </div>

              </motion.div>

              {/* OUTSIDE PREVIEW SKELETON */}
              <AnimatePresence>
                {hoveredArticle && isOpen && (
                  <motion.div
                    key="preview-skeleton"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="hidden xl:flex absolute top-1/2 -translate-y-1/2 left-[120%] w-[450px] h-[300px] bg-[#e8e6e1] rounded-xl shadow-[0_20px_50px_rgba(232,69,77,0.15)] border-[2px] border-[#c0bba9] pointer-events-none z-50"
                  >
                     {/* Mini Spine shadow */}
                     <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent z-10" />
                     
                     {/* Left Page (Image Preview) */}
                     <div className="w-1/2 h-full p-6 border-r border-[#c0bba9] bg-[url('/bg-noise.png')] flex flex-col justify-center">
                        <div className="w-full aspect-square bg-black/10 rounded-lg overflow-hidden shadow-inner mb-4 relative">
                          <div className="absolute inset-0 bg-logo-red/20 mix-blend-overlay z-10" />
                          {(hoveredArticle.image || hoveredArticle.image_url) ? (
                            <img src={hoveredArticle.image || hoveredArticle.image_url} alt="" className="w-full h-full object-cover grayscale contrast-125" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-black/20">No Img</div>
                          )}
                        </div>
                        <div className="h-3 w-3/4 bg-black/10 rounded-full mb-2" />
                        <div className="h-2 w-1/2 bg-black/10 rounded-full" />
                     </div>

                     {/* Right Page (Skeleton Text) */}
                     <div className="w-1/2 h-full p-6 bg-[#f0eee9] bg-[url('/bg-noise.png')] flex flex-col justify-center gap-3">
                        <div className="h-4 w-full bg-black/15 rounded-full mb-2" />
                        <div className="h-2 w-full bg-black/10 rounded-full" />
                        <div className="h-2 w-[90%] bg-black/10 rounded-full" />
                        <div className="h-2 w-[95%] bg-black/10 rounded-full" />
                        <div className="h-2 w-[80%] bg-black/10 rounded-full" />
                        <div className="h-2 w-full bg-black/10 rounded-full" />
                        <div className="h-2 w-[85%] bg-black/10 rounded-full" />
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500 flex flex-col items-center border border-white/5 bg-white/5 backdrop-blur-md p-12 rounded-3xl">
              <BookOpen className="w-16 h-16 mb-4 opacity-50 text-logo-red" />
              <p className="font-mono tracking-widest">Belum ada artikel yang dipublikasikan.</p>
            </div>
          )}

        </Layout>
        
        {/* Audio Element */}
        <audio ref={flipAudioRef} src="/flippingbook.mp3" preload="auto" />
      </main>
    </>
  )
}

export default ArtikelList;
