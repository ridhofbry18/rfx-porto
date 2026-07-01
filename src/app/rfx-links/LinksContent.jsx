'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Instagram, MessageCircle, AlertCircle, ArrowRight, ExternalLink, Image as ImageIcon, Menu, X, ShoppingCart, Sun, Moon } from 'lucide-react';
import { useData } from '@/components/DataProvider';

const LinksContent = () => {
  const { daftarKarya, configSitus } = useData();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
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
    <div className={`min-h-screen relative overflow-hidden flex flex-col items-center py-20 px-6 font-sans transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Background Image & Glass overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bgImage}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: isDark ? 0.62 : 0.32, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      </AnimatePresence>
      <div className={`absolute inset-0 z-0 ${isDark ? 'bg-[radial-gradient(circle_at_50%_5%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.74),#000)]' : 'bg-[radial-gradient(circle_at_50%_5%,rgba(255,255,255,0.72),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.28),rgba(255,255,255,0.78),#fff)]'} backdrop-blur-[2px]`} />
      <div className="absolute inset-x-8 top-20 z-0 h-64 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-8">
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className={`flex items-center justify-center w-12 h-12 rounded-3xl transition-all ${isDark ? 'bg-white/10 border-white/10 text-white hover:bg-white/15' : 'bg-black/10 border-black/10 text-black hover:bg-black/15'} border`}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIsDark(!isDark)} className={`flex items-center justify-center w-12 h-12 rounded-3xl transition-all border ${isDark ? 'bg-white/10 border-white/10 text-yellow-400 hover:bg-white/15' : 'bg-black/10 border-black/10 text-blue-600 hover:bg-black/15'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button type="button" onClick={() => router.push('/rfx-links/orderweb')} className={`flex items-center gap-2 px-4 py-3 rounded-3xl font-semibold transition-all ${isDark ? 'bg-logo-red text-white hover:bg-red-700 border border-logo-red' : 'bg-logo-red text-white hover:bg-red-700 border border-logo-red'}`}>
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.25em]">Order</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={`w-full mb-8 p-5 rounded-3xl border transition-all ${isDark ? 'border-white/10 bg-black/60 text-white' : 'border-black/10 bg-white/60 text-black'} backdrop-blur-xl`}>
            <p className={`text-xs uppercase tracking-[0.35em] mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>Web Bermanfaat</p>
            <div className="grid gap-3">
              <a href="https://pickygraph.rfx.web.id" target="_blank" rel="noreferrer" className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${isDark ? 'bg-zinc-900/80 border border-white/10 text-white hover:border-logo-red/60 hover:bg-zinc-800/80' : 'bg-zinc-100 border border-black/10 text-black hover:border-logo-red/60 hover:bg-zinc-200'}`}>PickyGraph</a>
              <a href="https://quicknota.rfx.web.id" target="_blank" rel="noreferrer" className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${isDark ? 'bg-zinc-900/80 border border-white/10 text-white hover:border-logo-red/60 hover:bg-zinc-800/80' : 'bg-zinc-100 border border-black/10 text-black hover:border-logo-red/60 hover:bg-zinc-200'}`}>QuickNota</a>
            </div>
          </div>
        )}

        {/* Profile */}
        <div className={`w-24 h-24 rounded-full border-2 overflow-hidden mb-4 shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-colors ${isDark ? 'border-white/20 bg-black' : 'border-black/20 bg-white'}`}>
          <img src={configSitus?.aboutImage || "https://placehold.co/400x400/111/222?text=RFX"} alt="RFX Visual" className="w-full h-full object-cover" />
        </div>

        <h1 className={`text-3xl font-black italic tracking-tight mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
          RFX<span className="text-red-600">.VISUAL</span>
        </h1>
        <p className={`text-xs uppercase tracking-widest font-semibold mb-10 text-center ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {configSitus?.heroTagline || "Visual Artist • Malang"}
        </p>

        {/* Links */}
        <div className="w-full space-y-4">
          <button onClick={() => router.push('/')} className={`group relative w-full overflow-hidden p-5 rounded-[1.75rem] flex items-center justify-between transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-zinc-950/90 border border-white/15 shadow-[0_20px_45px_rgba(0,0,0,0.45)] hover:border-white/35' : 'bg-white/95 border border-black/10 shadow-[0_20px_45px_rgba(0,0,0,0.12)] hover:border-black/25'}`}>
            <div className="flex items-center gap-4">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}><ImageIcon className="w-6 h-6" /></span>
              <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>Portfolio Website</span>
            </div>
            <ExternalLink className={`w-5 h-5 transition-all ${isDark ? 'text-zinc-500 group-hover:text-white' : 'text-zinc-600 group-hover:text-black'} group-hover:translate-x-1`} />
          </button>

          <button onClick={() => router.push('/rfx-links/orderweb')} className={`group relative w-full overflow-hidden p-5 rounded-[1.75rem] flex items-center justify-between transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-blue-950/90 border border-blue-400/25 shadow-[0_20px_55px_rgba(37,99,235,0.18)] hover:border-blue-300/50' : 'bg-blue-50/95 border border-blue-300 shadow-[0_20px_45px_rgba(37,99,235,0.12)] hover:border-blue-400'}`}>
            <div className="flex items-center gap-4">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${isDark ? 'bg-blue-600/40 text-blue-400' : 'bg-blue-300 text-blue-700'}`}><ShoppingCart className="w-6 h-6" /></span>
              <div className="flex flex-col text-left">
                <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>Web Store</span>
                <span className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Template Portofolio</span>
              </div>
            </div>
            <ArrowRight className={`w-5 h-5 transition-all ${isDark ? 'text-blue-500 group-hover:text-blue-400' : 'text-blue-600 group-hover:text-blue-500'} group-hover:translate-x-1`} />
          </button>

          <a href="https://instagram.com/rfx.visual" target="_blank" rel="noreferrer" className={`group relative w-full overflow-hidden p-5 rounded-[1.75rem] flex items-center justify-between transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-zinc-950/90 border border-white/15 shadow-[0_20px_45px_rgba(0,0,0,0.45)] hover:border-white/35' : 'bg-white/95 border border-black/10 shadow-[0_20px_45px_rgba(0,0,0,0.12)] hover:border-black/25'}`}>
            <div className="flex items-center gap-4">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}><Instagram className="w-6 h-6" /></span>
              <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>Instagram @rfx.visual</span>
            </div>
            <ExternalLink className={`w-5 h-5 transition-all ${isDark ? 'text-zinc-500 group-hover:text-white' : 'text-zinc-600 group-hover:text-black'} group-hover:translate-x-1`} />
          </a>

          <a href="https://wa.me/6285731021469?text=Halo%20RFX%20VISUAL%2C%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20(Fotografi%20%2F%20Videografi%20%2F%20Animasi%20%2F%20Website).%20Bisa%20minta%20info%20lebih%20lanjut%3F" target="_blank" rel="noreferrer" className={`group relative w-full overflow-hidden p-5 rounded-[1.75rem] flex items-center justify-between transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-emerald-950/90 border border-emerald-400/25 shadow-[0_20px_55px_rgba(16,185,129,0.16)] hover:border-emerald-300/50' : 'bg-emerald-50/95 border border-emerald-300 shadow-[0_20px_45px_rgba(16,185,129,0.12)] hover:border-emerald-400'}`}>
            <div className="flex items-center gap-4">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${isDark ? 'bg-green-600/40 text-green-400' : 'bg-green-300 text-green-700'}`}>
                <MessageCircle className="w-6 h-6" />
              </span>
              <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>Konsultasi (WA)</span>
            </div>
            <ExternalLink className={`w-5 h-5 transition-all ${isDark ? 'text-green-500 group-hover:text-green-400' : 'text-green-600 group-hover:text-green-500'} group-hover:translate-x-1`} />
          </a>

          <button onClick={() => router.push('/rfx-links/pricelist')} className={`group relative w-full overflow-hidden p-5 rounded-[1.75rem] flex items-center justify-between transition-all duration-300 hover:-translate-y-1 mt-6 ${isDark ? 'bg-red-950/90 border border-red-400/25 shadow-[0_20px_55px_rgba(220,38,38,0.16)] hover:border-red-300/50' : 'bg-red-50/95 border border-red-300 shadow-[0_20px_45px_rgba(220,38,38,0.12)] hover:border-red-400'}`}>
            <div className="flex items-center gap-4">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${isDark ? 'bg-red-600/40 text-red-400' : 'bg-red-300 text-red-700'}`}><AlertCircle className="w-6 h-6" /></span>
              <span className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>Pricelist</span>
            </div>
            <ArrowRight className={`w-5 h-5 transition-all ${isDark ? 'text-red-500 group-hover:text-red-400' : 'text-red-600 group-hover:text-red-500'} group-hover:translate-x-1`} />
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className={`text-[9px] uppercase tracking-[0.3em] font-black italic ${isDark ? 'text-zinc-600' : 'text-zinc-500'}`}>&copy; {new Date().getFullYear()} RFX VISUAL</p>
        </div>
      </div>
    </div>
  );
};

export default LinksContent;
