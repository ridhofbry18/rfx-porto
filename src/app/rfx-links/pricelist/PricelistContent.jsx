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
    <div className={`min-h-screen font-sans transition-colors duration-700 overflow-x-hidden bg-paper text-ink ${isDark ? 'theme-dark' : ''}`}>

      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-paper-2 via-paper to-paper"></div>

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
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-6 shadow-xl border border-line bg-paper-2 text-ink">
                  <Diamond className="w-5 h-5" />
                </div>
                <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-4 text-ink">
                  Layanan <span className="text-ink">Premium</span>
                </h1>
                <p className="text-base md:text-lg leading-relaxed text-muted">
                  Pilih kategori layanan di bawah untuk melihat rincian harga dan spesifikasi paket yang kami tawarkan.
                </p>
              </motion.div>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
                {normalizedPricelists.length === 0 ? (
                  <div className="col-span-2 p-12 rounded-lg text-center border border-line bg-paper-2">Belum ada kategori pricelist.</div>
                ) : (
                  normalizedPricelists.map((list) => (
                    <motion.div variants={fadeUpVariant} key={list.id}>
                      <button
                        onClick={() => setSelectedCategory(list)}
                        className={`w-full h-full group text-left relative overflow-hidden rounded-lg p-8 border transition-all duration-500 hover:-translate-y-1 bg-paper-2 border-line hover:border-ink shadow-sm hover:shadow-lg`}
                      >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-ink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                          <div className="flex flex-col gap-8">
                            <div className="w-14 h-14 rounded-lg flex items-center justify-center transition-colors duration-500 bg-paper text-muted group-hover:text-ink">
                              {getIconForCategory(list.title)}
                            </div>
                            <div className="pr-4">
                              <h3 className="text-2xl font-bold tracking-tight mb-2 transition-colors text-ink">{list.title}</h3>
                              <p className="text-sm font-medium tracking-wide uppercase text-muted group-hover:text-ink transition-colors">{list.subtitle || 'Lihat Detail Paket'}</p>
                            </div>
                          </div>

                          <div className="flex justify-end w-full mt-auto">
                            <div className="w-10 h-10 shrink-0 rounded-full border border-line flex items-center justify-center text-muted group-hover:text-ink group-hover:border-ink group-hover:translate-x-2 transition-all duration-500">
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
                  className="group flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all text-muted hover:text-ink hover:bg-paper-2"
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
                  className="group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all bg-paper-2 text-ink hover:bg-ink hover:text-paper shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                <div className="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border border-line text-muted">
                  {activeCategory.title}
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-4 text-ink">
                  Pricing <span className="text-ink">Plans.</span>
                </h2>
                {activeCategory.subtitle && <p className="text-base md:text-lg max-w-2xl mx-auto text-muted">{activeCategory.subtitle}</p>}
              </motion.div>

              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-16 items-start">
                {activeCategory.packages.length === 0 ? (
                  <div className="col-span-full p-8 rounded-lg text-center border border-line bg-paper-2 text-muted">Belum ada tier paket untuk kategori ini.</div>
                ) : activeCategory.packages.map((pkg, idx) => (
                  <motion.div variants={fadeUpVariant} key={idx} className={`relative flex flex-col h-full p-8 rounded-lg border transition-all duration-300 ${
                    pkg.isBestValue
                      ? 'bg-paper-2 border-ink shadow-lg md:-mt-4 md:mb-4 relative z-10'
                      : 'bg-paper-2 border-line hover:border-ink shadow-sm'
                  }`}>

                    {pkg.isBestValue && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink text-paper text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                        Recommended
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className="text-xl font-bold uppercase tracking-wide mb-2 text-ink">{pkg.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black tracking-tighter text-ink">{pkg.price}</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                      {pkg.features?.map((feat, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${pkg.isBestValue ? 'bg-paper text-ink' : 'bg-paper text-muted'}`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-sm leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: feat }} />
                        </li>
                      ))}
                    </ul>

                    {pkg.note && (
                      <div className="text-xs p-4 rounded-lg mb-8 bg-paper text-muted border border-line" dangerouslySetInnerHTML={{ __html: pkg.note }} />
                    )}

                    <button
                      onClick={() => router.push(`/pricelist/formbooking?kategori=${encodeURIComponent(activeCategory.title)}`)}
                      className={`w-full py-4 rounded-md text-xs font-black uppercase tracking-widest transition-all ${
                        pkg.isBestValue
                        ? 'bg-ink text-paper hover:bg-ink/85'
                        : 'border border-ink text-ink hover:bg-ink hover:text-paper'
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
                    <div className="p-8 rounded-lg border h-full bg-paper-2 border-line">
                      <h4 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-ink">
                        <PlusCircle className="w-4 h-4 text-ink" /> Ekstra
                      </h4>
                      <div className="space-y-4">
                        {activeCategory.extra_info.map((info, idx) => (
                          <p key={idx} className="text-sm leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: info }}></p>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCategory.terms.length > 0 && (
                    <div className="p-8 rounded-lg border h-full bg-paper-2 border-line">
                      <h4 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-ink">
                        Syarat & Ketentuan
                      </h4>
                      <ol className="list-decimal pl-5 space-y-3">
                        {activeCategory.terms.map((term, idx) => (
                          <li key={idx} className="text-sm leading-relaxed pl-1 text-muted" dangerouslySetInnerHTML={{ __html: term }}></li>
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
        <div className="w-full py-16 border-t relative overflow-hidden flex flex-col justify-center bg-paper-2 border-line">
          <div className="text-center mb-10 relative z-10">
            <p className="mono-label-sm text-ink mb-2">Showcase</p>
            <h3 className="text-2xl md:text-3xl font-display uppercase tracking-tight text-ink">Portofolio <span className="text-ink">Karya</span></h3>
          </div>

          <div className="w-full overflow-hidden flex items-center group relative">
             <div className="absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none bg-gradient-to-r from-paper-2 to-transparent"></div>
             <div className="absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none bg-gradient-to-l from-paper-2 to-transparent"></div>

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
                     <div key={`${i}-${item.id}`} className="w-[200px] h-[200px] shrink-0 rounded-lg overflow-hidden border relative group/item shadow-xl border-line">
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
