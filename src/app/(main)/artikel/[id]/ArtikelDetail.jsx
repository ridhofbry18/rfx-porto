'use client'

import { ArrowLeft, ArrowRight, Clock, Home } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useData } from '@/components/DataProvider'
import React, { useMemo, useState, useRef, useEffect, Suspense } from 'react'

const linkifyParagraph = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;
    if (start > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, start) });
    }
    let normalizedUrl = url;
    const trailingPunctuation = /[.,!?;:)]$/.test(normalizedUrl);
    if (trailingPunctuation) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    parts.push({ type: 'link', content: normalizedUrl });
    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
};

const ArtikelDetailContent = ({ artikel }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { daftarArtikel } = useData()
  
  const [isFlippingNext, setIsFlippingNext] = useState(false)
  const [isFlippingPrev, setIsFlippingPrev] = useState(false)
  
  const audioRef = useRef(null)
  const dir = searchParams.get('dir') || 'next' // 'next' or 'prev'

  const [localPageIndex, setLocalPageIndex] = useState(0)

  // Recalculate pages to get the global page number
  const articlesWithPages = useMemo(() => {
    if (!daftarArtikel) return [];
    let currentPg = 1;
    return daftarArtikel.map(a => {
      const length = a.content ? a.content.length : 0;
      const pgs = Math.max(1, Math.ceil(length / 1200));
      const startPg = currentPg;
      currentPg += pgs;
      return { ...a, startPg, totalPages: pgs };
    });
  }, [daftarArtikel]);

  const currentArticleWithPg = articlesWithPages.find(a => a.id === artikel.id);
  const startPg = currentArticleWithPg ? currentArticleWithPg.startPg : 1;

  // Chunk the content into pages
  const pages = useMemo(() => {
    const rawContent = artikel.content || '';
    const paragraphs = rawContent.split('\n').filter(p => p.trim() !== '');
    const maxChars = 1200;
    const result = [];
    let currentPage = [];
    let currentLength = 0;

    for (let p of paragraphs) {
      if (currentLength + p.length > maxChars && currentPage.length > 0) {
        result.push(currentPage);
        currentPage = [p];
        currentLength = p.length;
      } else {
        currentPage.push(p);
        currentLength += p.length;
      }
    }
    if (currentPage.length > 0) result.push(currentPage);
    return result.length > 0 ? result : [[]];
  }, [artikel.content]);

  useEffect(() => {
    // Reset local page index when article changes
    setLocalPageIndex(0);
    
    // Play sound on mount if navigating between pages
    if (searchParams.has('dir') && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log(e));
    }
  }, [searchParams, artikel.id]);

  // Calculate Next and Prev Articles for flipbook navigation
  const { prevId, nextId } = useMemo(() => {
    if (!daftarArtikel || daftarArtikel.length === 0) return { prevId: null, nextId: null };
    const currentIndex = daftarArtikel.findIndex(a => a.id === artikel.id);
    
    // Reverse logic if we want "Next Page" to go deeper into the past
    // Assuming daftarArtikel is sorted by newest first
    const nextItem = currentIndex < daftarArtikel.length - 1 ? daftarArtikel[currentIndex + 1] : null;
    const prevItem = currentIndex > 0 ? daftarArtikel[currentIndex - 1] : null;

    return { prevId: prevItem?.id, nextId: nextItem?.id };
  }, [daftarArtikel, artikel.id]);

  const handlePrevPage = () => {
    if (localPageIndex > 0 || prevId) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log(e));
      }
      setIsFlippingPrev(true);
      setTimeout(() => {
        if (localPageIndex > 0) {
          setLocalPageIndex(prev => prev - 1);
          setIsFlippingPrev(false);
        } else {
          router.push(`/artikel/${prevId}?dir=prev`);
        }
      }, 500);
    }
  };

  const handleNextPage = () => {
    if (localPageIndex < pages.length - 1 || nextId) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log(e));
      }
      setIsFlippingNext(true);
      setTimeout(() => {
        if (localPageIndex < pages.length - 1) {
          setLocalPageIndex(prev => prev + 1);
          setIsFlippingNext(false);
        } else {
          router.push(`/artikel/${nextId}?dir=next`);
        }
      }, 500);
    }
  };

  // Determine initial mount animations based on direction
  // If moving NEXT: Left page flips in from right to left (like the turned page landing)
  const leftInitial = dir === 'next' ? { rotateY: 90, opacity: 0 } : { rotateY: 0, opacity: 1 }
  const leftAnimate = isFlippingPrev ? { rotateY: 90, opacity: 0 } : { rotateY: 0, opacity: 1 }
  
  // If moving PREV: Right page flips in from left to right
  const rightInitial = dir === 'prev' ? { rotateY: -90, opacity: 0 } : { rotateY: 0, opacity: 1 }
  const rightAnimate = isFlippingNext ? { rotateY: -90, opacity: 0 } : { rotateY: 0, opacity: 1 }

  return (
    <>
      <audio ref={audioRef} src="/flippingbook.mp3" preload="auto" />
      <main className="w-full flex flex-col items-center justify-center text-[#111] min-h-screen bg-[#050505]">
        
        {/* Navigation Bar Above Book */}
        <div className="w-full max-w-7xl flex justify-between items-center px-4 pt-32 pb-8">
           <button 
             onClick={() => router.push('/artikel')}
             className="group flex items-center text-zinc-400 hover:text-white font-mono text-sm tracking-widest uppercase transition-colors"
           >
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
             Close Book
           </button>
           <div className="text-zinc-600 font-mono text-xs uppercase tracking-[0.3em]">
             RFX Articles Vol I
           </div>
        </div>

        {/* The Open Book */}
        <div className="relative w-full max-w-7xl px-4 flex justify-center">
          
          {/* FLIP PREV BUTTON */}
          <button 
            onClick={handlePrevPage}
            disabled={localPageIndex === 0 && !prevId}
            className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-24 bg-white/5 border border-white/10 rounded-l-xl items-center justify-center text-white/50 hover:text-white hover:bg-logo-red/20 hover:border-logo-red transition-all disabled:opacity-0 ${localPageIndex === 0 && !prevId ? 'pointer-events-none' : ''}`}
            title="Halaman Sebelumnya"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* FLIP NEXT BUTTON */}
          <button 
            onClick={handleNextPage}
            disabled={localPageIndex === pages.length - 1 && !nextId}
            className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-24 bg-white/5 border border-white/10 rounded-r-xl items-center justify-center text-white/50 hover:text-white hover:bg-logo-red/20 hover:border-logo-red transition-all disabled:opacity-0 ${localPageIndex === pages.length - 1 && !nextId ? 'pointer-events-none' : ''}`}
            title="Halaman Berikutnya"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Book Container */}
          <div className="w-full flex flex-col md:flex-row bg-[#e8e6e1] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_0_50px_rgba(0,0,0,0.1)] relative border-[3px] border-[#c0bba9]" style={{ perspective: '3000px' }}>
            
            {/* Book Center Binding / Spine (Desktop Only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent shadow-[inset_4px_0_10px_rgba(0,0,0,0.1),inset_-4px_0_10px_rgba(0,0,0,0.1)] z-10" />
            
            {/* LEFT PAGE (Cover/Metadata) */}
            <motion.div 
              initial={leftInitial}
              animate={leftAnimate}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformOrigin: 'right', transformStyle: 'preserve-3d' }}
              className="w-full md:w-1/2 min-h-[60vh] md:min-h-[800px] p-8 md:p-16 flex flex-col justify-center relative bg-[url('/bg-noise.png')] opacity-95"
            >
               {/* Page Texture */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 opacity-50 pointer-events-none" />
               
               <div className="z-10 h-full flex flex-col">
                 <div className="flex items-center gap-3 text-logo-red font-mono text-xs tracking-widest uppercase mb-8 border-b border-[#d1cec1] pb-4">
                   <Clock className="w-4 h-4" /> 
                   {artikel.date || (artikel.created_at ? new Date(artikel.created_at).toLocaleDateString('id-ID') : 'Tanggal Rilis')}
                 </div>
                 
                 <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl mb-12 leading-none text-[#111] uppercase tracking-tighter">
                   {artikel.title}
                 </h1>

                 {(artikel.image || artikel.image_url) && (
                   <div className="w-full aspect-[4/3] overflow-hidden shadow-2xl relative bg-black p-2 transform -rotate-2">
                     <img src={artikel.image || artikel.image_url} alt={artikel.title} className="w-full h-full object-cover filter contrast-125 sepia-[0.2]" />
                   </div>
                 )}
                 
                 <div className="mt-auto pt-12 flex justify-between items-center border-t border-[#d1cec1] text-[#7a7870] font-serif text-sm">
                   <span>RFX.Visual</span>
                   <span>Pg. {startPg + localPageIndex}</span>
                 </div>
               </div>
            </motion.div>

            {/* RIGHT PAGE (Content) */}
            <motion.div 
              initial={rightInitial}
              animate={rightAnimate}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformOrigin: 'left', transformStyle: 'preserve-3d' }}
              className="w-full md:w-1/2 min-h-[60vh] md:min-h-[800px] p-8 md:p-16 relative bg-[#f0eee9] bg-[url('/bg-noise.png')]"
            >
               {/* Page Texture */}
               <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5 opacity-50 pointer-events-none" />
               
               <div className="z-10 h-full flex flex-col">
                 <div className="prose prose-p:text-[#333] prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed prose-a:text-logo-red prose-a:underline-offset-4 max-w-none h-full overflow-hidden">
                   {(pages[localPageIndex] || []).map((paragraph, idx) => {
                     const parts = linkifyParagraph(paragraph);
                     return (
                       <p key={idx} className="mb-6 text-justify" style={{ textIndent: '2.5rem' }}>
                         {parts.map((part, pieceIndex) => {
                           if (part.type === 'link') {
                             return (
                               <a key={pieceIndex} href={part.content} target="_blank" rel="noopener noreferrer" className="font-bold">
                                 {part.content}
                               </a>
                             );
                           }
                           return <span key={pieceIndex}>{part.content}</span>;
                         })}
                       </p>
                     )
                   })}
                 </div>

                 {/* Mobile Navigation Buttons (Visible only on mobile) */}
                 <div className="mt-12 flex md:hidden justify-between items-center pt-8 border-t border-[#d1cec1]">
                    <button 
                      onClick={handlePrevPage}
                      disabled={localPageIndex === 0 && !prevId}
                      className="text-logo-red disabled:opacity-30 font-bold uppercase tracking-widest text-xs flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Prev
                    </button>
                    <button 
                      onClick={handleNextPage}
                      disabled={localPageIndex === pages.length - 1 && !nextId}
                      className="text-logo-red disabled:opacity-30 font-bold uppercase tracking-widest text-xs flex items-center"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                 </div>
                 
               </div>
            </motion.div>

          </div>
        </div>
      </main>
    </>
  )
}

const ArtikelDetail = ({ artikel }) => {
  return (
    <Suspense fallback={
      <main className="w-full flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="w-12 h-12 border-4 border-logo-red border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <ArtikelDetailContent artikel={artikel} />
    </Suspense>
  )
}

export default ArtikelDetail;
