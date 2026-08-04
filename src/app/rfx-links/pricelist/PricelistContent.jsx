'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, Check, Diamond, PlusCircle, Image as ImageIcon, Video, Code, Palette, Play } from 'lucide-react';
import { useData } from '@/components/DataProvider';
import { normalizePricelist } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const PricelistContent = () => {
  const { daftarPricelist = [], daftarKarya = [], isDark } = useData();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const normalizedPricelists = daftarPricelist.map(normalizePricelist);
  const activeCategory = selectedCategory ? normalizePricelist(selectedCategory) : null;

  const photoWorks = daftarKarya.filter(item => item.category === 'photo');

  const getIconForCategory = (title) => {
    const t = title.toLowerCase();
    if (t.includes('foto')) return <ImageIcon className="w-6 h-6" />;
    if (t.includes('video')) return <Video className="w-6 h-6" />;
    if (t.includes('web')) return <Code className="w-6 h-6" />;
    if (t.includes('animasi')) return <Play className="w-6 h-6" />;
    return <Palette className="w-6 h-6" />;
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 selection:bg-red-500/30 overflow-x-hidden ${isDark ? 'bg-[#0a0a0a] text-zinc-300' : 'bg-[#fafafa] text-zinc-800'}`}>

      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className={`fixed inset-0 z-0 pointer-events-none opacity-20 ${isDark ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-[#0a0a0a] to-[#0a0a0a]' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100 via-[#fafafa] to-[#fafafa]'}`}></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32 min-h-[80vh]">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="selection"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={staggerContainer}
              className="w-full flex flex-col items-center"
            >
              <motion.div variants={fadeUpVariant} className="text-center mb-16 max-w-2xl">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6 shadow-xl border border-red-500/20 bg-red-500/10 text-red-500">
                  <Diamond className="w-5 h-5" />
                </div>
                <h1 className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Layanan <span className="text-red-600">Premium</span>
                </h1>
                <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Pilih kategori layanan di bawah untuk melihat rincian harga dan spesifikasi paket yang kami tawarkan.
                </p>
              </motion.div>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
                {normalizedPricelists.length === 0 ? (
                  <div className={`col-span-2 p-12 rounded-3xl text-center border ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-white'}`}>Belum ada kategori pricelist.</div>
                ) : (
                  normalizedPricelists.map((list) => (
                    <motion.div variants={fadeUpVariant} key={list.id}>
                      <button
                        onClick={() => setSelectedCategory(list)}
                        className={`w-full h-full group text-left relative overflow-hidden rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-1 ${
                          isDark
                          ? 'bg-zinc-900/40 hover:bg-zinc-800/80 border-zinc-800 hover:border-red-500/50 shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.2)]'
                          : 'bg-white hover:bg-red-50/50 border-zinc-200 hover:border-red-200 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.1)]'
                        }`}
                      >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                          <div className="flex flex-col gap-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-400 group-hover:text-red-500 group-hover:bg-red-950/50' : 'bg-zinc-50 text-zinc-400 group-hover:text-red-600 group-hover:bg-red-100/50'}`}>
                              {getIconForCategory(list.title)}
                            </div>
                            <div className="pr-4">
                              <h3 className={`text-2xl font-bold tracking-tight mb-2 transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>{list.title}</h3>
                              <p className="text-sm font-medium tracking-wide uppercase text-zinc-500 group-hover:text-red-500/70 transition-colors">{list.subtitle || 'Lihat Detail Paket'}</p>
                            </div>
                          </div>

                          <div className="flex justify-end w-full mt-auto">
                            <div className="w-10 h-10 shrink-0 rounded-full border border-zinc-700/50 flex items-center justify-center text-zinc-500 group-hover:text-red-500 group-hover:border-red-500/50 group-hover:translate-x-2 transition-all duration-500">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))
                )}
              </motion.div>

              <motion.div variants={fadeUpVariant} className="mt-12 w-full flex justify-center">
                <button
                  onClick={() => router.push('/')}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={staggerContainer}
              className="w-full flex flex-col items-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeUpVariant} className="w-full flex items-center justify-between mb-12">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 shadow-sm'}`}
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                <div className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-400'}`}>
                  {activeCategory.title}
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="text-center mb-16">
                <h2 className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Pricing <span className="text-red-600">Plans.</span>
                </h2>
                {activeCategory.subtitle && <p className={`text-base md:text-lg max-w-2xl mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{activeCategory.subtitle}</p>}
              </motion.div>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-16 items-start">
                {activeCategory.packages.length === 0 ? (
                  <div className={`col-span-full p-8 rounded-3xl text-center border ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-400' : 'border-zinc-200 bg-white text-zinc-500'}`}>Belum ada tier paket untuk kategori ini.</div>
                ) : activeCategory.packages.map((pkg, idx) => (
                  <motion.div variants={fadeUpVariant} key={idx} className={`relative flex flex-col h-full p-8 rounded-3xl border transition-all duration-300 ${
                    pkg.isBestValue
                      ? (isDark ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.15)] md:-mt-4 md:mb-4 relative z-10' : 'bg-white border-red-500/50 shadow-[0_20px_40px_-15px_rgba(220,38,38,0.2)] md:-mt-4 md:mb-4 relative z-10')
                      : (isDark ? 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-600' : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm')
                  }`}>

                    {pkg.isBestValue && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                        Recommended
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className={`text-xl font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{pkg.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-black tracking-tighter ${pkg.isBestValue ? 'text-red-500' : (isDark ? 'text-white' : 'text-zinc-900')}`}>{pkg.price}</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                      {pkg.features?.map((feat, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${pkg.isBestValue ? 'bg-red-500/20 text-red-500' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-400')}`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`} dangerouslySetInnerHTML={{ __html: feat }} />
                        </li>
                      ))}
                    </ul>

                    {pkg.note && (
                      <div className={`text-xs p-4 rounded-2xl mb-8 ${isDark ? 'bg-zinc-900/50 text-zinc-400 border border-zinc-800/50' : 'bg-zinc-50 text-zinc-500 border border-zinc-100'}`} dangerouslySetInnerHTML={{ __html: pkg.note }} />
                    )}

                    <button
                      onClick={() => router.push(`/pricelist/formbooking?kategori=${encodeURIComponent(activeCategory.title)}`)}
                      className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        pkg.isBestValue
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]'
                        : (isDark ? 'bg-zinc-900 hover:bg-white hover:text-black text-white' : 'bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-900')
                      }`}
                    >
                      Pilih Paket
                    </button>
                  </motion.div>
                ))}
              </motion.div>

              {(activeCategory.extra_info.length > 0 || activeCategory.terms.length > 0) && (
                <motion.div variants={fadeUpVariant} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                  {activeCategory.extra_info.length > 0 && (
                    <div className={`p-8 rounded-3xl border h-full ${isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                      <h4 className={`text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        <PlusCircle className="w-4 h-4 text-red-500" /> Ekstra
                      </h4>
                      <div className="space-y-4">
                        {activeCategory.extra_info.map((info, idx) => (
                          <p key={idx} className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} dangerouslySetInnerHTML={{ __html: info }}></p>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCategory.terms.length > 0 && (
                    <div className={`p-8 rounded-3xl border h-full ${isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                      <h4 className={`text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        Syarat & Ketentuan
                      </h4>
                      <ol className="list-decimal pl-5 space-y-3">
                        {activeCategory.terms.map((term, idx) => (
                          <li key={idx} className={`text-sm leading-relaxed pl-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} dangerouslySetInnerHTML={{ __html: term }}></li>
                        ))}
                      </ol>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Marquee Cuplikan Karya (Always visible if exists) */}
      {photoWorks.length > 0 && (
        <div className={`w-full py-16 border-t relative overflow-hidden flex flex-col justify-center ${isDark ? 'bg-[#050505] border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
          <div className="text-center mb-10 relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-2">Showcase</p>
            <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Portofolio <span className="text-red-500">Karya</span></h3>
          </div>

          <div className="w-full overflow-hidden flex items-center group relative">
             <div className={`absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none ${isDark ? 'bg-gradient-to-r from-[#050505] to-transparent' : 'bg-gradient-to-r from-zinc-50 to-transparent'}`}></div>
             <div className={`absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none ${isDark ? 'bg-gradient-to-l from-[#050505] to-transparent' : 'bg-gradient-to-l from-zinc-50 to-transparent'}`}></div>

             <style dangerouslySetInnerHTML={{__html: `
               @keyframes scrollworks {
                 0% { transform: translateX(0); }
                 100% { transform: translateX(calc(-200px * ${photoWorks.length} - 1.5rem * ${photoWorks.length})); }
               }
               .animate-scrollworks {
                 display: flex;
                 animation: scrollworks 80s linear infinite;
               }
               .group:hover .animate-scrollworks {
                 animation-play-state: paused;
               }
             `}} />

             <div className="animate-scrollworks gap-6 px-3">
               {[...Array(3)].map((_, i) => (
                 <React.Fragment key={i}>
                   {photoWorks.map(item => (
                     <div key={`${i}-${item.id}`} className={`w-[200px] h-[200px] shrink-0 rounded-2xl overflow-hidden border relative group/item shadow-xl ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end p-4">
                         <span className="text-xs text-white font-bold uppercase tracking-wider">{item.title}</span>
                       </div>
                     </div>
                   ))}
                 </React.Fragment>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricelistContent;
