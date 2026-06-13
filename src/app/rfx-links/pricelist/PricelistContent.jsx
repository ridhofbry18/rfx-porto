'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, Check } from 'lucide-react';
import { useData } from '@/components/DataProvider';

const PricelistContent = () => {
  const { daftarPricelist = [], daftarKarya = [] } = useData();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const photoWorks = daftarKarya.filter(item => item.category === 'photo');
  const itemsPerSlide = 5;
  const numSlides = Math.ceil(photoWorks.length / itemsPerSlide);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (numSlides <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % numSlides);
    }, 120000); // 2 menit
    return () => clearInterval(interval);
  }, [numSlides]);

  const currentPhotos = photoWorks.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide);

  if (selectedCategory) {
    const list = selectedCategory;
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-red-500 mb-4">{list.title}</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.04em] uppercase mb-2">Pricelist<span className="text-red-500">.</span></h2>
            {list.subtitle && <p className="text-zinc-500 text-sm font-light">{list.subtitle}</p>}
          </div>

          <div className="space-y-4 mb-16">
            {list.packages?.map((pkg, idx) => (
              <div key={idx} className={`bg-zinc-900/40 border ${pkg.isBestValue ? 'border-red-500/20 bg-gradient-to-br from-zinc-900/80 to-zinc-900/30' : 'border-white/5'} rounded-2xl p-6 hover:border-red-500/30 transition-all relative overflow-hidden`}>
                {pkg.isBestValue && <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-white text-[9px] font-black tracking-widest uppercase rounded-bl-xl z-20">Best Value</div>}
                {pkg.isBestValue && <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full blur-2xl"></div>}

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className="text-xl font-bold uppercase tracking-wider">{pkg.name}</h3>
                  <span className="text-lg font-black text-red-500">{pkg.price}</span>
                </div>

                <ul className="space-y-2 text-sm text-zinc-400 font-light relative z-10">
                  {pkg.features?.map((feat, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span dangerouslySetInnerHTML={{ __html: feat }} />
                    </li>
                  ))}
                </ul>
                {pkg.note && <p className="mt-4 text-xs text-zinc-500 p-3 bg-black/50 rounded-xl relative z-10" dangerouslySetInnerHTML={{ __html: pkg.note }}></p>}
              </div>
            ))}
          </div>

          {list.extra_info?.length > 0 && (
            <div className="mb-12 space-y-3 bg-zinc-900/20 border border-white/5 p-6 rounded-2xl text-xs text-zinc-400 font-light leading-relaxed">
              <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-sm">Tambahan / Extra</h4>
              {list.extra_info.map((info, idx) => <p key={idx} dangerouslySetInnerHTML={{ __html: info }}></p>)}
            </div>
          )}

          {list.terms?.length > 0 && (
            <div className="mb-12">
              <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-sm border-b border-white/10 pb-2">Syarat & Ketentuan</h4>
              <ol className="list-decimal pl-4 space-y-3 text-xs text-zinc-400 font-light leading-relaxed uppercase">
                {list.terms.map((term, idx) => <li key={idx} dangerouslySetInnerHTML={{ __html: term }}></li>)}
              </ol>
            </div>
          )}

          <div className="flex flex-col items-center gap-4 border-t border-white/10 pt-8 pb-10">
            <button onClick={() => router.push(`/rfx-links/pricelist/formbooking?kategori=${encodeURIComponent(list.title)}`)} className="w-full text-center px-6 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Booking Sekarang (WA)
            </button>
            <button onClick={() => setSelectedCategory(null)} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2">
              <ChevronLeft className="w-3 h-3" /> Kembali ke Kategori
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center pt-24 pb-10 text-white px-6">
      <div className="w-full max-w-md text-center mb-10">
        <h2 className="text-3xl font-black uppercase mb-2 tracking-tighter">Pilih Kategori<span className="text-red-600">.</span></h2>
        <p className="text-zinc-500 text-xs font-light">Pilih kategori pricelist yang ingin Anda lihat detailnya.</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {daftarPricelist.length === 0 ? (
          <div className="p-8 border border-white/5 rounded-2xl text-center text-zinc-500 text-xs">Belum ada kategori pricelist.</div>
        ) : (
          daftarPricelist.map(list => (
            <button key={list.id} onClick={() => setSelectedCategory(list)} className="w-full group relative bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/10 backdrop-blur-xl p-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col items-start text-left">
                <span className="text-lg font-bold text-white uppercase tracking-wider mb-1">{list.title}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{list.subtitle || 'Lihat Paket'}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </button>
          ))
        )}
      </div>

      {photoWorks.length > 0 && (
        <div className="w-full max-w-2xl mt-16 pt-10 border-t border-white/10">
          <div className="text-center mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-red-500 mb-2">Cuplikan Karya</p>
            <h3 className="text-xl font-black uppercase">Fotografi <span className="text-red-500">Kami</span></h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 transition-opacity duration-1000 ease-in-out" key={slideIndex}>
            {currentPhotos.map(item => (
              <div key={item.id} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-zinc-800/60 group relative shadow-xl">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold uppercase tracking-widest text-center px-1">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <button onClick={() => router.push('/rfx-links')} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2">
          <ChevronLeft className="w-3 h-3" /> Kembali ke Bio
        </button>
      </div>
    </div>
  );
};

export default PricelistContent;
