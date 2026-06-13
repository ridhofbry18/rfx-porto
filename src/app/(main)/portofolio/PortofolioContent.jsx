'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedText from '@/components/AnimatedText'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import { ExternalLink, Play, X, Clapperboard, Camera, Film, Globe } from 'lucide-react'
import { useData } from '@/components/DataProvider'

// Utility function copied from helpers if needed, or implement here:
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoModal = ({ isOpen, onClose, videoUrl, videoType }) => {
  if (!isOpen) return null;
  
  const getYoutubeEmbedUrl = (url) => {
    const videoId = getYoutubeId(url);
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&modestbranding=1&rel=0&fs=0&playsinline=1`;
  };

  const isYoutube = videoType === 'youtube' || (videoUrl && (videoUrl.includes('youtube') || videoUrl.includes('youtu.be')));
  const isVideoFile = !isYoutube && videoUrl && videoUrl.match(/\.(mp4|mov|webm|ogg)(\?.*)?$/i);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8">
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-logo-red transition-colors z-[160]">
        <X className="w-8 h-8" />
      </button>
      <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_0_50px_rgba(232,69,77,0.3)] relative flex items-center justify-center">
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
            className="w-full h-full pointer-events-none"
            frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          />
        )}
      </div>
    </div>
  );
};

const FeaturedProject = ({ category, type, title, summary, img, link, videoType, onOpenVideo }) => {
  const isVideoContent = ['video', 'animation'].includes(category?.toLowerCase());

  return (
    <article className="w-full flex flex-col lg:flex-row items-center justify-between relative rounded-2xl lg:rounded-3xl lg:rounded-br-2xl border border-solid border-logo-red/20 bg-logo-red/5 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 lg:p-12 mb-16">
      <div className="absolute top-0 -right-2 sm:-right-3 -z-10 w-[101%] h-[102%] sm:h-[103%] rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] bg-logo-red/50 blur-sm lg:rounded-br-3xl" />
      <div className="w-full lg:w-1/2 cursor-pointer overflow-hidden rounded-xl">
        <motion.img 
          src={img} 
          alt={title} 
          className="w-full h-auto aspect-video object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-start justify-between pt-6 lg:pt-0 lg:pl-10">
        <span className="text-logo-red text-outline-white font-bold text-sm sm:text-base md:text-xl uppercase tracking-widest">{type}</span>
        <h2 className="my-2 sm:my-3 w-full text-left text-2xl sm:text-3xl md:text-4xl font-black uppercase font-display">{title}</h2>
        <p className="my-2 sm:my-3 font-medium text-zinc-300 text-sm sm:text-base">{summary}</p>
        <div className="mt-4 flex items-center">
          {isVideoContent ? (
            <button onClick={() => onOpenVideo(link, videoType)} className="rounded-xl bg-white text-black p-3 px-6 sm:px-8 text-sm sm:text-base font-bold hover:bg-logo-red hover:text-white transition-colors flex gap-2 items-center shadow-[0_0_20px_rgba(232,69,77,0.3)]">
              <Play className="w-4 h-4"/> Play Video
            </button>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white text-black p-3 px-6 sm:px-8 text-sm sm:text-base font-bold hover:bg-logo-red hover:text-white transition-colors flex gap-2 items-center shadow-lg">
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
    <article className="w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-logo-red/20 bg-logo-red/5 backdrop-blur-2xl p-4 sm:p-6 relative">
      <div className="absolute top-0 -right-2 sm:-right-3 -z-10 w-[101%] h-[102%] sm:h-[103%] rounded-[1.5rem] sm:rounded-[2rem] bg-logo-red/30 blur-sm" />
      <div className="w-full cursor-pointer overflow-hidden rounded-xl">
        <motion.img 
          src={img} 
          alt={title} 
          className="w-full h-auto aspect-video object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <div className="w-full flex flex-col items-start justify-between mt-4 sm:mt-6">
        <span className="text-logo-red text-outline-white font-bold text-xs sm:text-sm lg:text-base uppercase tracking-widest">{type}</span>
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
