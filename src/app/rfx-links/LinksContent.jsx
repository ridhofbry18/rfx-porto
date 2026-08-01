'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Instagram, MessageCircle, AlertCircle, ArrowRight, ExternalLink, Image as ImageIcon, Menu, X, ShoppingCart, Sun, Moon, LayoutTemplate } from 'lucide-react';
import { useData } from '@/components/DataProvider';

const LinksContent = () => {
  const { daftarKarya, configSitus, daftarWebsite, isDark, toggleTheme, daftarKatalog } = useData();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const photoWorks = daftarKarya?.filter(item => item.category === 'photo') || [];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    if (photoWorks.length <= 1) return;
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % photoWorks.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [photoWorks.length]);

  const bgImage = photoWorks.length > 0 ? photoWorks[bgIndex].image : (configSitus?.heroImage || 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf');

  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 sm:p-8 font-sans transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-white' : 'bg-[#f4fcf4] text-black'}`}>
      
      {/* Animated Background with Crossfade & Blur Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
        <AnimatePresence>
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
            animate={{ opacity: 1, filter: 'blur(4px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ 
              backgroundImage: `url(${bgImage})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          />
        </AnimatePresence>
      </div>

      {/* Main Container Container (Lebih lebar) */}
      <div className={`relative z-10 w-full max-w-5xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl transition-all duration-500 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-green-50 shadow-[0_20px_60px_rgba(0,0,0,0.05)]'}`}>
        


        {/* Top Section: Split Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-16 mt-8 lg:mt-0">
          
          {/* Left Column: Profile & Bio */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-6 border-4 shadow-lg ${isDark ? 'border-zinc-800' : 'border-white'}`}>
              <img src={configSitus?.aboutImage || "https://placehold.co/400x400/111/222?text=RFX"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight">
              {configSitus?.heroTagline || "Web Creator & Visual Artist"}
            </h1>
            
            <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Visual Artist & Web Creator yang berfokus pada estetika digital dan solusi kreatif untuk Anda.
            </p>
            
            <a href="mailto:email@rfx.web.id" className={`text-sm font-semibold hover:underline ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
              email@rfx.web.id
            </a>

            <button type="button" onClick={toggleTheme} className={`mt-8 px-5 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 shadow-sm'}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Mode Terang' : 'Mode Gelap'}
            </button>
          </div>

          {/* Right Column: Links */}
          <div className="flex-1 flex flex-col gap-3 justify-center w-full max-w-md mx-auto lg:mx-0">
            {/* Template Catalog Link (Highlight) */}
            <button onClick={() => router.push('/templates')} className={`group relative w-full overflow-hidden p-4 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-md ${isDark ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30' : 'bg-green-200 text-green-900 hover:bg-green-300'}`}>
              <div className="flex items-center gap-4">
                <LayoutTemplate className="w-5 h-5" />
                <span className="text-sm font-bold tracking-wide">Katalog Template</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <button onClick={() => router.push('/orderweb')} className={`group relative w-full overflow-hidden p-4 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-sm ${isDark ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
              <div className="flex items-center gap-4">
                <ShoppingCart className="w-5 h-5 opacity-80" />
                <span className="text-sm font-bold tracking-wide">Web Services</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <button onClick={() => router.push('/pricelist')} className={`group relative w-full overflow-hidden p-4 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-sm ${isDark ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
              <div className="flex items-center gap-4">
                <AlertCircle className="w-5 h-5 opacity-80" />
                <span className="text-sm font-bold tracking-wide">Pricelist Jasa Fotografi</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <button onClick={() => window.location.href = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://rfxvisual.my.id'} className={`group relative w-full overflow-hidden p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-black'}`}>
              <div className="flex items-center gap-4">
                <ImageIcon className="w-5 h-5 opacity-60" />
                <span className="text-sm font-bold tracking-wide">Portfolio Utama</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-all" />
            </button>

            <a href="https://instagram.com/rfx.visual" target="_blank" rel="noreferrer" className={`group relative w-full overflow-hidden p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-black'}`}>
              <div className="flex items-center gap-4">
                <Instagram className="w-5 h-5 opacity-60" />
                <span className="text-sm font-bold tracking-wide">Instagram</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-all" />
            </a>
            
            <a href="https://wa.me/6285731021469" target="_blank" rel="noreferrer" className={`group relative w-full overflow-hidden p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-black'}`}>
              <div className="flex items-center gap-4">
                <MessageCircle className="w-5 h-5 opacity-60" />
                <span className="text-sm font-bold tracking-wide">Konsultasi WA</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-all" />
            </a>
          </div>
        </div>

        {/* Bottom Section: Template Cards */}
        <div className="border-t border-zinc-200/20 pt-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-bold">Produk Tersedia</h2>
            <button onClick={() => router.push('/templates')} className="text-xs font-semibold text-blue-500 hover:underline">
              Lihat Semua &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {daftarKatalog && daftarKatalog.length === 0 ? (
              <div className="col-span-full text-center py-10 text-zinc-500 text-sm">
                Belum ada produk untuk ditampilkan.
              </div>
            ) : daftarKatalog?.map(tpl => (
              <div key={tpl.id} className={`flex flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-zinc-100">
                  <img src={tpl.image} alt={tpl.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-sm mb-2 line-clamp-1">{tpl.title}</h3>
                  <p className={`text-xs mb-4 flex-1 line-clamp-3 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {tpl.description}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => router.push(tpl.demoUrl)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 flex-1 justify-center ${isDark ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}>
                      Preview
                    </button>
                    <button onClick={() => router.push('/templates')} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 flex-1 justify-center ${isDark ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                      Beli <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LinksContent;
