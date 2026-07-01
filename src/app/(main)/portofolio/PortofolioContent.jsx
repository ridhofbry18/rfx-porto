'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedText from '@/components/AnimatedText'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import { ExternalLink, Play, X, Clapperboard, Camera, Film, Globe, Sparkles } from 'lucide-react'
import { useData } from '@/components/DataProvider'

// Utility function copied from helpers if needed, or implement here:
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/|youtube\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const VideoModal = ({ isOpen, onClose, videoUrl, videoType }) => {
  if (!isOpen) return null;
  
  const videoId = getYoutubeId(videoUrl);
  const isYoutube = videoType === 'youtube' || (videoUrl && (videoUrl.includes('youtube') || videoUrl.includes('youtu.be')));
  const isShorts = videoUrl && videoUrl.includes('shorts');
  const isVideoFile = !isYoutube && videoUrl && videoUrl.match(/\.(mp4|mov|webm|ogg)(\?.*)?$/i);

  const getYoutubeEmbedUrl = (url) => {
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&modestbranding=1&rel=0&fs=0&playsinline=1`;
  };

  // Determine container classes based on aspect ratio
  const containerClasses = isShorts 
    ? "w-full max-w-sm aspect-[9/16]" // For Shorts
    : "w-full max-w-5xl aspect-video"; // For standard 16:9

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-logo-red transition-colors z-[160]">
        <X className="w-8 h-8" />
      </button>
      <div 
        className={`${containerClasses} rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_0_50px_rgba(232,69,77,0.3)] relative flex items-center justify-center`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside video
      >
        {isYoutube ? (
          getYoutubeEmbedUrl(videoUrl) ? (
            <iframe 
              title="Youtube video player"
              src={getYoutubeEmbedUrl(videoUrl)} 
              className="w-full h-full pointer-events-none"
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-sm sm:text-base px-4 text-center">
              Video YouTube tidak valid. Cek kembali URL atau masukkan link YouTube yang lengkap.
            </div>
          )
        ) : isVideoFile ? (
          <video 
            src={videoUrl} 
            className="w-full h-full object-contain pointer-events-none"
            autoPlay 
            playsInline 
            muted
            preload="auto"
          />
        ) : (
          <iframe 
            src={videoUrl} 
            className="w-full h-full"
            frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

const FeaturedProject = ({ category, type, title, summary, img, link, videoType, onOpenVideo }) => {
  const isVideoContent = ['video', 'animation'].includes(category?.toLowerCase());

  return (
    <article className="group w-full flex flex-col lg:flex-row items-center justify-between relative rounded-[1.75rem] lg:rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.11),transparent_32%),linear-gradient(135deg,rgba(24,24,27,0.92),rgba(5,5,5,0.96))] backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.42)] p-5 sm:p-7 lg:p-10 mb-16 overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_30%)]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      <div className="relative w-full lg:w-[54%] cursor-pointer overflow-hidden rounded-[1.25rem] border border-white/10 bg-black">
        <motion.img 
          src={img} 
          alt={title} 
          className="w-full h-auto aspect-video object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <div className="relative w-full lg:w-[46%] flex flex-col items-start justify-between pt-6 lg:pt-0 lg:pl-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-200 font-bold text-[10px] sm:text-xs uppercase tracking-[0.28em]"><Sparkles className="w-3 h-3" />{type}</span>
        <h2 className="my-3 sm:my-4 w-full text-left text-2xl sm:text-3xl md:text-5xl font-black uppercase font-display leading-none">{title}</h2>
        <p className="my-2 sm:my-3 font-medium text-zinc-300 text-sm sm:text-base">{summary}</p>
        <div className="mt-4 flex items-center">
          {isVideoContent ? (
            <button onClick={() => onOpenVideo(link, videoType)} className="rounded-2xl bg-white text-black p-3 px-6 sm:px-8 text-sm sm:text-base font-bold hover:bg-zinc-200 transition-colors flex gap-2 items-center shadow-[0_16px_35px_rgba(255,255,255,0.12)]">
              <Play className="w-4 h-4"/> Play Video
            </button>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-white text-black p-3 px-6 sm:px-8 text-sm sm:text-base font-bold hover:bg-zinc-200 transition-colors flex gap-2 items-center shadow-[0_16px_35px_rgba(255,255,255,0.12)]">
              <ExternalLink className="w-4 h-4"/> Visit Project
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

const Project = ({ category, title, type, img, link, videoType, onOpenVideo }) => {
  const isVideoContent = ['video', 'animation'].includes(category?.toLowerCase());

  return (
    <article className="group w-full flex flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-[linear-gradient(145deg,rgba(39,39,42,0.88),rgba(9,9,11,0.96))] backdrop-blur-2xl p-4 sm:p-5 relative overflow-hidden shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors" />
      <div className="relative w-full cursor-pointer overflow-hidden rounded-[1.2rem] border border-white/10 bg-black">
        <motion.img 
          src={img} 
          alt={title} 
          className="w-full h-auto aspect-video object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <div className="w-full flex flex-col items-start justify-between mt-4 sm:mt-6">
        <span className="text-zinc-300 font-bold text-[10px] sm:text-xs uppercase tracking-[0.26em]">{type}</span>
        <h2 className="my-1 sm:my-2 w-full text-left text-xl sm:text-2xl lg:text-3xl font-bold line-clamp-2 uppercase font-display">{title}</h2>
        <div className="w-full mt-3 sm:mt-4 flex items-center justify-between">
          {isVideoContent ? (
            <button onClick={() => onOpenVideo(link, videoType)} className="text-sm sm:text-base lg:text-lg font-bold underline underline-offset-4 hover:text-logo-red transition-colors flex items-center gap-1">
              Play <Play className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base lg:text-lg font-bold underline underline-offset-4 hover:text-logo-red transition-colors flex items-center gap-1">
              Visit <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

const PortofolioContent = () => {
  const { daftarKarya, daftarWebsite, configSitus, daftarSubKategori } = useData();
  const [filter, setFilter] = useState('video');
  const [subFilter, setSubFilter] = useState('all');
  const [modalVideo, setModalVideo] = useState({ isOpen: false, url: '', type: 'youtube' });

  const handleOpenVideo = (url, type) => {
    setModalVideo({ isOpen: true, url, type });
  }

  const allProjects = [
    ...(daftarKarya || []),
    ...(daftarWebsite || []).map(w => ({
      ...w,
      category: 'website',
      image: w.link_preview || 'https://placehold.co/600x400/111/222?text=Web',
      youtubeUrl: w.link_web,
      subcategory_id: null
    }))
  ];

  const categories = [
    { id: 'video', icon: Clapperboard, label: 'Video' },
    { id: 'photo', icon: Camera, label: 'Foto' },
    { id: 'animation', icon: Film, label: 'Animasi' },
    { id: 'website', icon: Globe, label: 'Websites' }
  ];

  const activeSubcats = (daftarSubKategori || []).filter(sub => sub.parent_category === filter);

  let filteredKarya = allProjects.filter(item => item.category === filter);
  if (subFilter !== 'all') {
    filteredKarya = filteredKarya.filter(item => String(item.subcategory_id) === String(subFilter));
  }

  return (
    <>
      <VideoModal 
        isOpen={modalVideo.isOpen} 
        onClose={() => setModalVideo({ ...modalVideo, isOpen: false })} 
        videoUrl={modalVideo.url} 
        videoType={modalVideo.type} 
      />
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center text-white min-h-screen">
        <Layout className="pt-32 pb-16">
          <AnimatedText 
            text={configSitus?.portfolioTitle || "Imagination Trumps Knowledge!"} 
            className="mb-8 sm:mb-12 md:mb-16 !text-5xl sm:!text-6xl md:!text-7xl lg:!text-8xl font-display uppercase tracking-wider" 
          />

          {/* Filter Bar (Icons Only) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8 flex-wrap px-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = filter === cat.id;
              return (
                <button 
                  key={cat.id} 
                  onClick={() => { setFilter(cat.id); setSubFilter('all'); }}
                  className={`p-4 rounded-full transition-all duration-300 border shadow-xl flex items-center justify-center ${isActive ? 'bg-logo-red border-logo-red text-white shadow-[0_0_20px_rgba(211,34,42,0.6)] scale-110' : 'bg-[#0a0a0a]/80 backdrop-blur-md border-white/10 text-zinc-500 hover:border-logo-red hover:text-white hover:scale-105'}`}
                  title={cat.label}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )
            })}
          </div>

          {/* Subcategory Filter (Albums) */}
          {activeSubcats.length > 0 && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-12 flex-wrap px-4">
              <button 
                onClick={() => setSubFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors border ${subFilter === 'all' ? 'bg-white text-black border-white' : 'bg-transparent border-white/20 text-zinc-400 hover:border-white hover:text-white'}`}
              >
                All Albums
              </button>
              {activeSubcats.map(sub => (
                <button 
                  key={sub.id} 
                  onClick={() => setSubFilter(sub.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors border ${String(subFilter) === String(sub.id) ? 'bg-white text-black border-white' : 'bg-transparent border-white/20 text-zinc-400 hover:border-white hover:text-white'}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-x-16 lg:gap-y-24">
            {filteredKarya.length === 0 ? (
               <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
                 <p className="text-xl">Tidak ada karya di album ini.</p>
               </div>
            ) : filteredKarya.map((item, index) => {
              const link = item.youtubeUrl || item.link_web || item.image;
              
              const albumName = activeSubcats.find(sub => String(sub.id) === String(item.subcategory_id))?.name || item.category;

              if (index % 3 === 0) {
                return (
                  <div key={item.id} className="md:col-span-2 lg:col-span-12 w-full">
                    <FeaturedProject 
                      category={item.category}
                      title={item.title}
                      summary={item.description}
                      link={link}
                      type={albumName}
                      img={item.image}
                      videoType={item.videoType}
                      onOpenVideo={handleOpenVideo}
                    />
                  </div>
                )
              } else {
                return (
                  <div key={item.id} className="col-span-1 lg:col-span-6 w-full">
                    <Project 
                      category={item.category}
                      title={item.title}
                      link={link}
                      type={albumName}
                      img={item.image}
                      videoType={item.videoType}
                      onOpenVideo={handleOpenVideo}
                    />
                  </div>
                )
              }
            })}
          </div>

        </Layout>
      </main>
    </>
  )
}

export default PortofolioContent;
