'use client'

import React, { useState, Suspense, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useData } from '@/components/DataProvider'
import { getYoutubeEmbedUrl, getYoutubeId } from '@/utils/helpers'
import { Play, ChevronRight, ChevronLeft, Globe, Film, Clapperboard, Camera, X } from 'lucide-react'
import AnimatedText from '@/components/AnimatedText'
import TransitionEffect from '@/components/TransitionEffect'

// Only import Three if it's available (since we just installed it, dynamic import or standard import is fine, but Canvas must be client-side)
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Html, OrbitControls, Environment, ContactShadows, PresentationControls, useProgress } from '@react-three/drei'

// --- MODAL YOUTUBE/VIDEO PLAYER ---
const getProjectVideoUrl = (item) => item?.youtubeUrl || item?.youtube_url || item?.videoUrl || item?.video_url || item?.link_web || item?.image || '';

const VideoModal = ({ isOpen, onClose, videoUrl, videoType }) => {
  if (!isOpen) return null;
  const videoId = getYoutubeId(videoUrl);
  const isYoutube = Boolean(videoId) || videoType === 'youtube';
  const isShorts = videoUrl && videoUrl.includes('shorts');
  const isVideoFile = !isYoutube && videoUrl && videoUrl.match(/\.(mp4|mov|webm|ogg)(\?.*)?$/i);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-logo-red transition-colors z-[99999]">
        <X className="w-8 h-8" />
      </button>
      <div 
        className={`${isShorts ? "w-full max-w-sm aspect-[9/16]" : "w-full max-w-5xl aspect-video"} rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_0_50px_rgba(232,69,77,0.3)] relative flex items-center justify-center`}
        onClick={e => e.stopPropagation()}
      >
        {isYoutube ? (
          videoId ? (
            <iframe title="Youtube player" src={getYoutubeEmbedUrl(videoUrl, true)} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          ) : (
            <div className="text-white text-sm">Video Invalid</div>
          )
        ) : isVideoFile ? (
          <video src={videoUrl} className="w-full h-full object-contain" autoPlay playsInline controls />
        ) : (
          <iframe src={videoUrl} className="w-full h-full" frameBorder="0" allowFullScreen />
        )}
      </div>
    </div>
  );
};

// --- DEEP DIVE UI COMPONENTS ---
// (These remain exactly the same as they were perfect)

const TvDeepDive = ({ data, subcategories, onOpenVideo, onClose }) => {
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isStatic, setIsStatic] = useState(true);
  const [channelIndex, setChannelIndex] = useState(0);
  const [volume, setVolume] = useState(50);
  const [showOSD, setShowOSD] = useState(false);

  const channels = ['all', ...subcategories.map(s => s.id)];
  const activeChannel = channels[channelIndex];
  
  const filteredData = activeChannel === 'all' 
    ? data 
    : data.filter(d => String(d.subcategory_id) === String(activeChannel));

  useEffect(() => {
    setIsPowerOn(true);
    let staticTimer = setTimeout(() => {
      setIsStatic(false);
    }, 1200);
    return () => clearTimeout(staticTimer);
  }, []);

  const triggerStatic = () => {
    setIsStatic(true);
    setShowOSD(true);
    setTimeout(() => {
       setIsStatic(false);
       setTimeout(() => setShowOSD(false), 2000);
    }, 800);
  };

  const handlePower = () => {
    if (isPowerOn) {
      setIsPowerOn(false);
    } else {
      setIsPowerOn(true);
      triggerStatic();
    }
  };

  const handleChUp = () => {
    if (!isPowerOn) return;
    setChannelIndex(prev => (prev + 1) % channels.length);
    triggerStatic();
  };

  const handleChDown = () => {
    if (!isPowerOn) return;
    setChannelIndex(prev => (prev - 1 + channels.length) % channels.length);
    triggerStatic();
  };

  const handleVolUp = () => {
    if (!isPowerOn) return;
    setVolume(prev => Math.min(100, prev + 10));
    setShowOSD(true);
    setTimeout(() => setShowOSD(false), 2000);
  };

  const handleVolDown = () => {
    if (!isPowerOn) return;
    setVolume(prev => Math.max(0, prev - 10));
    setShowOSD(true);
    setTimeout(() => setShowOSD(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9990] bg-[#111] flex items-center justify-center p-4 md:p-12 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517502474136-11f8b65675e8?q=80&w=2564&auto=format&fit=crop")' }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* TV Enclosure */}
      <div className="relative z-10 w-full max-w-6xl md:aspect-[16/10] h-[85vh] md:h-auto bg-[#1a1a1a] rounded-[2rem] border-[8px] md:border-[12px] border-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-8 md:pr-8">
        
        {/* TV Screen Container */}
        <div className="flex-1 bg-[#050505] rounded-[1.5rem] md:rounded-[2.5rem] border-[8px] md:border-[12px] border-[#0f0f0f] relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
           
           {/* CRT Glass Reflection */}
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/50 pointer-events-none z-[60] rounded-[1.5rem] md:rounded-[2rem]" />
           
           {/* Scanlines */}
           <div className="absolute inset-0 pointer-events-none z-[55] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40 mix-blend-overlay rounded-[1.5rem] md:rounded-[2rem]" />

           {/* TV Screen Content */}
           <div className={`w-full h-full relative ${isPowerOn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
             
             {isStatic ? (
               <div className="absolute -inset-[100%] z-50 animate-static opacity-70 mix-blend-screen" 
                 style={{ 
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E")`,
                 }} 
               />
             ) : (
               <div className="absolute inset-0 flex flex-col p-8 overflow-y-auto z-40 bg-[#0a0a0a]">
                 {/* Video Grid inside TV */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
                   {filteredData.map(video => (
                     <div key={video.id} className="group relative rounded-xl overflow-hidden cursor-pointer shadow-lg bg-[#111] border border-white/10" onClick={() => onOpenVideo(getProjectVideoUrl(video), video.videoType)}>
                       <div className="aspect-video relative overflow-hidden">
                         <img src={video.image} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent">
                           <Play className="w-12 h-12 text-white drop-shadow-lg scale-90 group-hover:scale-110 transition-transform" />
                         </div>
                       </div>
                       <div className="p-4 bg-[#151515]">
                         <p className="text-white text-sm font-bold uppercase line-clamp-1 tracking-wider">{video.title}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* OSD (On Screen Display) - Green retro text */}
             {(showOSD && isPowerOn) && (
               <div className="absolute top-10 right-12 text-[#22ff22] font-mono text-4xl z-[70] drop-shadow-[0_0_8px_rgba(34,255,34,1)] font-bold tracking-widest">
                 <div>CH {channelIndex.toString().padStart(2, '0')}</div>
                 <div className="mt-4 text-2xl">VOL {volume}</div>
               </div>
             )}
           </div>

           {/* Power Off Shrink Effect */}
           <div className={`absolute inset-0 bg-white z-[100] transition-all duration-300 ${!isPowerOn ? 'scale-y-[0.01] opacity-0 scale-x-0' : 'scale-100 opacity-0 pointer-events-none'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)' }} />
           
        </div>

        {/* TV Control Panel */}
        <div className="w-full md:w-28 shrink-0 flex flex-row md:flex-col items-center justify-between py-2 md:py-10 border-t md:border-t-0 md:border-l border-[#333] pt-4 md:pt-10 md:pl-6">
           <div className="flex flex-row md:flex-col gap-4 md:gap-10 w-full items-center">
             
             {/* Speaker Grille Pattern */}
             <div className="hidden md:flex w-20 h-32 flex-wrap gap-1.5 opacity-20 justify-center">
               {Array.from({ length: 48 }).map((_, i) => (
                 <div key={i} className="w-2 h-2 rounded-full bg-black shadow-inner" />
               ))}
             </div>

             {/* Channels Buttons */}
             <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-full">
               <button onClick={handleChUp} className="w-full h-10 bg-gradient-to-b from-[#444] to-[#222] hover:from-[#555] hover:to-[#333] rounded border-b-[4px] md:border-b-[6px] border-[#111] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center text-[10px] text-white/70 font-bold uppercase tracking-widest shadow-lg">CH +</button>
               <button onClick={handleChDown} className="w-full h-10 bg-gradient-to-b from-[#444] to-[#222] hover:from-[#555] hover:to-[#333] rounded border-b-[4px] md:border-b-[6px] border-[#111] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center text-[10px] text-white/70 font-bold uppercase tracking-widest shadow-lg">CH -</button>
             </div>

             {/* Volume Buttons */}
             <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-full">
               <button onClick={handleVolUp} className="w-full h-10 bg-gradient-to-b from-[#444] to-[#222] hover:from-[#555] hover:to-[#333] rounded-full border-b-[4px] md:border-b-[6px] border-[#111] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center text-[10px] text-white/70 font-bold uppercase tracking-widest shadow-lg">VOL+</button>
               <button onClick={handleVolDown} className="w-full h-10 bg-gradient-to-b from-[#444] to-[#222] hover:from-[#555] hover:to-[#333] rounded-full border-b-[4px] md:border-b-[6px] border-[#111] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center text-[10px] text-white/70 font-bold uppercase tracking-widest shadow-lg">VOL-</button>
             </div>

           </div>

           <div className="flex flex-col gap-2 md:gap-8 w-auto md:w-full items-center mt-0 md:mt-12 ml-4 md:ml-0 shrink-0">
             <button onClick={handlePower} className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-b-[4px] md:border-b-[6px] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center ${isPowerOn ? 'bg-red-500 border-red-900 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-red-800 border-red-950 shadow-lg'}`}>
               <span className="text-[10px] md:text-xs text-white font-bold uppercase tracking-wider">PWR</span>
             </button>

             <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-[10px] md:text-sm font-bold tracking-widest uppercase mt-0 md:mt-4 underline decoration-white/20 underline-offset-4">
               Exit
             </button>
           </div>
        </div>

      </div>

      <style>{`
        @keyframes tvStatic {
          0% { transform: translate(0,0) }
          10% { transform: translate(-5%,-5%) }
          20% { transform: translate(-10%,5%) }
          30% { transform: translate(5%,-10%) }
          40% { transform: translate(10%,15%) }
          50% { transform: translate(-15%,10%) }
          60% { transform: translate(15%,5%) }
          70% { transform: translate(0%,15%) }
          80% { transform: translate(15%,15%) }
          90% { transform: translate(-10%,10%) }
          100% { transform: translate(0,0) }
        }
        .animate-static {
          animation: tvStatic 0.15s steps(2) infinite;
        }
      `}</style>
    </motion.div>
  );
};

const CameraDeepDive = ({ data, subcategories, onClose }) => {
  const [view, setView] = useState('albums'); // 'albums' | 'viewer'
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpenAlbum = (albumId) => {
    setActiveAlbum(albumId);
    setCurrentIndex(0);
    setView('viewer');
  };

  const handleBackToAlbums = () => {
    setView('albums');
    setActiveAlbum(null);
  };

  const albumPhotos = activeAlbum 
    ? data.filter(p => String(p.subcategory_id) === String(activeAlbum)) 
    : [];

  const handleNext = () => setCurrentIndex(prev => (prev + 1) % albumPhotos.length);
  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + albumPhotos.length) % albumPhotos.length);
  
  const photo = albumPhotos[currentIndex];

  if (!data || data.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9990] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[9999] bg-black/50 p-2 rounded-full">
        <X className="w-6 h-6" />
      </button>

      {/* Sony Viewfinder Overlay */}
      <div className="absolute inset-0 pointer-events-none z-40 border-[24px] border-black/90">
        <div className="absolute inset-0 border border-white/20 m-4" />
        
        {/* Top Left: Shooting Mode */}
        <div className="absolute top-6 left-8 flex items-center gap-4 text-white font-mono text-sm">
          <div className="border border-white px-2 py-0.5 rounded-sm bg-black/50 font-bold">P</div>
          <div className="flex flex-col text-[10px] leading-tight">
             <span>RAW</span>
             <span>X.FINE</span>
          </div>
          <div className="bg-white/20 px-2 py-0.5 rounded-sm">24M</div>
        </div>

        {/* Top Right: Battery & Media */}
        <div className="absolute top-6 right-8 flex items-center gap-4 text-white font-mono text-sm">
          <div className="flex items-center gap-1">
            <span>100%</span>
            <div className="w-6 h-3 border border-white p-[1px] relative flex">
               <div className="h-full bg-white w-[90%]" />
               <div className="w-0.5 h-1.5 bg-white absolute -right-1 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
        
        {/* Center AF Brackets */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-white/10 opacity-30 pointer-events-none flex items-center justify-center">
           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/40" />
           <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/40" />
           <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/40" />
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/40" />
           {/* Center Cross */}
           <div className="w-6 h-6 border border-white/30 rounded-full relative">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30" />
           </div>
        </div>

        {/* Bottom Bar: Exposure Settings */}
        <div className="absolute bottom-6 left-12 flex items-center gap-8 text-white font-mono text-lg font-bold drop-shadow-md">
          <span className="text-orange-400">1/125</span>
          <span className="text-orange-400">F2.8</span>
          <span className="text-white">+0.0</span>
          <span className="text-white">ISO 100</span>
        </div>

        {/* Bottom Right: Focus Mode */}
        <div className="absolute bottom-6 right-12 text-white font-mono text-sm flex gap-4 items-center">
          <div className="border border-white/40 px-2 py-0.5 bg-black/50">AF-C</div>
          <div className="border border-white/40 px-2 py-0.5 bg-black/50">[ ]</div>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center p-16 z-20">
        
        {view === 'albums' ? (
           <div className="w-full h-full p-8 pt-16 flex flex-col pointer-events-auto overflow-y-auto">
             <div className="flex items-center gap-3 mb-8 ml-4">
               <Camera className="w-6 h-6 text-logo-red" />
               <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">Select Folder</h2>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pb-20">
                {subcategories.map(cat => {
                   const firstPhoto = data.find(p => String(p.subcategory_id) === String(cat.id));
                   const thumbUrl = firstPhoto ? firstPhoto.image : 'https://placehold.co/600x400/222/555?text=Empty';
                   const photoCount = data.filter(p => String(p.subcategory_id) === String(cat.id)).length;
                   
                   return (
                     <div 
                       key={cat.id}
                       onClick={() => handleOpenAlbum(cat.id)}
                       className="group cursor-pointer flex flex-col gap-2"
                     >
                        <div className="aspect-[3/2] w-full bg-zinc-900 border-[3px] border-transparent group-hover:border-orange-500 p-1 transition-colors relative overflow-hidden shadow-lg">
                           <img src={thumbUrl} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                           <div className="absolute top-2 left-2 bg-black/80 text-white font-mono text-[10px] px-2 py-1 rounded-sm border border-white/20">
                             {photoCount} IMAGES
                           </div>
                           <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors" />
                        </div>
                        <div className="text-white font-bold uppercase tracking-wider text-sm mt-2">{cat.name}</div>
                     </div>
                   );
                })}
             </div>
           </div>
        ) : (
           <div className="w-full h-full flex flex-col relative pointer-events-auto">
             <button onClick={handleBackToAlbums} className="absolute top-4 left-4 bg-black/80 hover:bg-orange-500 text-white border border-white/20 hover:border-orange-500 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors z-50 flex items-center gap-2">
               <span>MENU</span> <span>Back</span>
             </button>
             
             {albumPhotos.length > 0 ? (
               <div className="flex-1 min-h-0 flex items-center justify-center relative py-4">
                 <motion.img 
                    key={photo?.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={photo?.image}
                    alt={photo?.title}
                    className="w-full h-full object-contain drop-shadow-2xl"
                 />
                 
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center bg-black/80 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/10 max-w-xl pointer-events-none">
                    <h2 className="text-white font-display font-black text-2xl uppercase tracking-wider">{photo?.title}</h2>
                    <p className="text-white/60 text-sm mt-2 line-clamp-2">{photo?.description}</p>
                 </div>

                 {/* Playback Controls (Side Arrows) */}
                 <button onClick={handlePrev} className="absolute left-8 w-16 h-16 bg-black/50 hover:bg-orange-500 rounded-full border-2 border-white/20 hover:border-orange-500 flex items-center justify-center text-white transition-all shadow-xl active:scale-95">
                   <ChevronLeft className="w-8 h-8" />
                 </button>
                 <button onClick={handleNext} className="absolute right-8 w-16 h-16 bg-black/50 hover:bg-orange-500 rounded-full border-2 border-white/20 hover:border-orange-500 flex items-center justify-center text-white transition-all shadow-xl active:scale-95">
                   <ChevronRight className="w-8 h-8" />
                 </button>

                 <div className="absolute top-4 right-4 bg-black/80 text-white font-mono text-sm px-3 py-1 border border-white/20">
                   [{currentIndex + 1}/{albumPhotos.length}]
                 </div>
               </div>
             ) : (
               <div className="flex-1 flex items-center justify-center text-white/50 font-mono text-lg uppercase tracking-widest">
                 No Images in this Folder
               </div>
             )}
           </div>
        )}

      </div>
    </motion.div>
  );
};

const LaptopDeepDive = ({ animData, webData, onOpenVideo, onClose }) => {
  const [mode, setMode] = useState('anim');
  const [time, setTime] = useState(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9990] flex flex-col overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }}
    >
      {/* macOS Top Menu Bar */}
      <div className="w-full h-7 bg-white/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 text-white text-[13px] font-medium shadow-sm z-50">
        <div className="flex items-center gap-4">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-93.1 22.7-18.9 0-46.5-21-79.9-21-50.6 0-96.1 33.1-122.9 83.2-54.8 102.7-17 251.9 45.4 338.9 28.5 39.8 62.4 83.8 106.3 82.2 41.7-1.6 57.3-27.1 107.6-27.1 50.1 0 63.8 26.9 107.4 26.9 44.5-.2 73.7-41.4 102-81.6 33.3-46.9 46.9-92.4 47.9-94.8-1.2-.6-87.7-33-88.8-100zm-111.4-181.7c22.5-27.5 37.8-65.7 33.6-103.7-31.9 1.4-71.9 21.6-95.3 49.3-20.9 24.6-38.6 63.7-33.6 100.8 35.8 2.8 73.1-19.1 95.3-46.4z"/></svg>
          <span className="font-bold">{mode === 'anim' ? 'After Effects' : 'Safari'}</span>
          <span className="hidden sm:inline">File</span>
          <span className="hidden sm:inline">Edit</span>
          <span className="hidden sm:inline">View</span>
          <span className="hidden sm:inline">Window</span>
          <span className="hidden sm:inline">Help</span>
        </div>
        <div className="flex items-center gap-4">
          <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
          <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <span>{time}</span>
          <button onClick={onClose} className="ml-2 px-3 py-1 bg-logo-red hover:bg-red-700 text-white rounded text-[10px] font-bold tracking-widest uppercase transition-colors shadow-sm flex items-center gap-1 border border-red-500/50">
            <X className="w-3 h-3" /> Exit
          </button>
        </div>
      </div>
      
      {/* Workspace Area */}
      <div className="relative flex-1 w-full p-4 sm:p-8 flex items-center justify-center overflow-hidden">
        
        {mode === 'anim' ? (
           <motion.div 
             initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
             className="w-full max-w-7xl h-[85vh] rounded-xl overflow-hidden flex flex-col bg-[#232323] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#444]"
           >
             {/* Window Controls */}
             <div className="h-10 bg-[#323232] flex items-center justify-between px-4 shrink-0 relative">
               <div className="flex items-center gap-2 relative">
                 <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center group z-10"><X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" /></button>
                 <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                 <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
               </div>
               <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                 <Film className="w-4 h-4 text-[#cf80ff]" />
                 <span className="text-white/70 text-xs font-sans tracking-wide truncate max-w-[200px] sm:max-w-md">Adobe After Effects - Animation Portfolio.aep</span>
               </div>
               <div className="w-12" />
             </div>
             
             {/* AE Content */}
             <div className="flex-1 flex p-1 gap-1 overflow-hidden bg-[#1e1e1e]">
               <div className="w-64 border border-[#333] flex flex-col shrink-0 bg-[#252525]">
                 <div className="bg-[#333] text-white/80 text-[10px] uppercase font-bold p-1 px-2 border-b border-[#222]">Project</div>
                 <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                   {animData.map(anim => (
                     <div key={anim.id} className="flex items-center gap-2 text-white/70 text-[11px] p-1.5 hover:bg-[#444] cursor-pointer rounded transition-colors" onClick={() => onOpenVideo(getProjectVideoUrl(anim), anim.videoType)}>
                       <Film className="w-3 h-3 text-[#cf80ff] shrink-0" />
                       <span className="truncate">{anim.title}.mp4</span>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="flex-1 border border-[#333] flex flex-col bg-[#111]">
                 <div className="bg-[#333] text-white/80 text-[10px] uppercase font-bold p-1 px-2 border-b border-[#222]">Composition</div>
                 <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto gap-8 bg-[linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a),linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
                   {animData.map(anim => (
                     <div key={anim.id} className="w-full max-w-2xl bg-black rounded shadow-2xl border border-[#444] group cursor-pointer" onClick={() => onOpenVideo(getProjectVideoUrl(anim), anim.videoType)}>
                       <div className="w-full aspect-video relative">
                         <img src={anim.image} alt={anim.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent">
                           <Play className="w-12 h-12 text-white/70 group-hover:text-white drop-shadow-lg transition-colors group-hover:scale-110" />
                         </div>
                       </div>
                       <div className="p-2 text-white/70 text-[10px] font-mono border-t border-[#333] bg-[#1a1a1a]">
                         RENDER: {anim.title}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
             <div className="h-40 border-t border-[#333] flex flex-col shrink-0 bg-[#252525]">
                <div className="bg-[#333] text-white/80 text-[10px] uppercase font-bold p-1 px-2 border-b border-[#222]">Timeline</div>
                <div className="flex-1 flex relative">
                  <div className="w-64 border-r border-[#333] bg-[#2a2a2a]" />
                  <div className="flex-1 relative overflow-hidden bg-[#1a1a1a]">
                    <div className="absolute top-2 left-4 right-1/4 h-5 bg-[#8257e6] rounded-sm border border-[#6b47c0]" />
                    <div className="absolute top-8 left-12 right-8 h-5 bg-[#007acc] rounded-sm border border-[#005a99]" />
                    <div className="absolute top-14 left-[20%] right-32 h-5 bg-[#2ea043] rounded-sm border border-[#238034]" />
                    <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-[#e8454d] z-10" />
                    <div className="absolute top-0 left-[30%] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#e8454d] -translate-x-1/2 z-10" />
                  </div>
                </div>
             </div>
           </motion.div>
        ) : (
           <motion.div 
             initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
             className="w-full max-w-7xl h-[85vh] rounded-xl overflow-hidden flex flex-col bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20"
           >
             {/* Safari Window Controls */}
             <div className="h-12 bg-[#f6f6f6] flex items-center justify-between px-4 border-b border-[#d1d1d1] shrink-0 relative">
               <div className="flex items-center gap-2 relative">
                 <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center group z-10"><X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" /></button>
                 <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                 <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
               </div>
               <div className="flex-1 flex items-center justify-center px-4 absolute left-1/2 -translate-x-1/2 w-1/2 max-w-xl">
                 <div className="w-full flex items-center justify-center gap-2 bg-white rounded-md px-3 py-1.5 border border-[#d1d1d1] shadow-sm text-zinc-600 text-xs font-medium">
                   <Globe className="w-3.5 h-3.5 text-zinc-400" />
                   <span className="truncate">portfolio.local/websites</span>
                 </div>
               </div>
               <div className="w-12" />
             </div>
             
             {/* Safari Content */}
             <div className="flex-1 overflow-y-auto bg-zinc-50 p-6 md:p-12 flex flex-col items-center gap-12 pb-24">
                {webData.length > 0 ? webData.map(web => (
                  <a href={web.link_web || web.image} target="_blank" rel="noreferrer" key={web.id} className="w-full max-w-4xl bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-zinc-200 overflow-hidden group">
                    <div className="w-full aspect-[16/10] bg-zinc-800 relative overflow-hidden border-b border-zinc-100">
                      <img src={web.image} alt={web.title} className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700" />
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-black uppercase font-display">{web.title}</h2>
                        <p className="text-zinc-500 text-sm mt-1 line-clamp-2 max-w-lg">{web.description || 'Web Project'}</p>
                      </div>
                      <div className="px-5 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-logo-red transition-colors shrink-0">
                        Visit Site
                      </div>
                    </div>
                  </a>
                )) : (
                  <div className="text-zinc-400 text-lg">No websites deployed.</div>
                )}
             </div>
           </motion.div>
        )}
      </div>

      {/* macOS Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-xl border border-white/30 p-2 rounded-2xl shadow-2xl">
          <button 
            onClick={() => setMode('anim')} 
            className={`relative group w-14 h-14 rounded-xl flex items-center justify-center transition-transform hover:-translate-y-2 hover:scale-110 ${mode === 'anim' ? 'bg-[#2b1842]' : 'bg-[#1a0f2e]'}`}
          >
             <Film className="w-8 h-8 text-[#cf80ff]" />
             {mode === 'anim' && <div className="absolute -bottom-1 w-1 h-1 bg-white/80 rounded-full" />}
             <span className="absolute -top-10 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">After Effects</span>
          </button>
          <div className="w-[1px] h-10 bg-white/20 mx-1" />
          <button 
            onClick={() => setMode('web')} 
            className={`relative group w-14 h-14 rounded-xl flex items-center justify-center bg-white transition-transform hover:-translate-y-2 hover:scale-110`}
          >
             <Globe className="w-9 h-9 text-blue-500" />
             {mode === 'web' && <div className="absolute -bottom-1 w-1 h-1 bg-white/80 rounded-full" />}
             <span className="absolute -top-10 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Safari</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};


// --- CAMERA RIG ---
const CameraRig = ({ roomState, targetObj, tutorialTarget }) => {
  useFrame((state) => {
    // 1. Base Target Position & LookAt
    let targetPos = new THREE.Vector3(0, -0.4, 4.0); // Moved forward (from 5.5 to 4.0) to hide holes
    let targetLookAt = new THREE.Vector3(0, -0.4, -5); 

    // 2. Mouse Parallax & Handheld Feel
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    
    // Handheld breathing effect (slow sine wave)
    const time = state.clock.elapsedTime;
    const breathX = Math.sin(time * 1.5) * 0.02;
    const breathY = Math.cos(time * 1.2) * 0.02;

    if (roomState === 'intro') {
      targetPos.set(0, 5, 20);
      targetLookAt.set(0, 0, 0);
    } else if (roomState === 'tutorial') {
       // Look around automatically during tutorial
       if (tutorialTarget === 'tv') {
         targetLookAt.set(0, 0.2, -1.8);
       } else if (tutorialTarget === 'camera') {
         targetLookAt.set(-1.2, -0.6, 0.5);
       } else if (tutorialTarget === 'laptop') {
         targetLookAt.set(1.4, -0.4, 0.2);
       } else {
         targetLookAt.set(0, -0.4, -5); // forward
       }
       targetLookAt.x += breathX;
       targetLookAt.y += breathY;

    } else if (roomState === 'zoomed' && targetObj) {
       if (targetObj === 'tv') {
         targetPos.set(0, 0.4, -0.5);
         targetLookAt.set(0, 0.2, -1.8);
       } else if (targetObj === 'camera') {
         targetPos.set(-0.8, -0.2, 1.0);
         targetLookAt.set(-1.2, -0.6, 0.5);
       } else if (targetObj === 'laptop') {
         targetPos.set(1.0, 0.0, 0.8);
         targetLookAt.set(1.4, -0.4, 0.2);
       }
       
       // Add slight handheld feel even when zoomed in
       targetLookAt.x += breathX;
       targetLookAt.y += breathY;
       
    } else if (roomState === 'inside') {
       // Apply parallax based on mouse movement when idle inside
       targetLookAt.x += pointerX * 3.0 + breathX; // Look left/right
       targetLookAt.y += pointerY * 1.5 + breathY; // Look up/down
       
       // Slight camera body movement
       targetPos.x += pointerX * 0.5 + breathX;
       targetPos.y += pointerY * 0.2 + breathY;
    }

    // Smoothly interpolate position
    state.camera.position.lerp(targetPos, 0.05);

    // Smoothly interpolate lookAt (using quaternion slerp for smoothness)
    const currentQuat = state.camera.quaternion.clone();
    state.camera.lookAt(targetLookAt);
    const targetQuat = state.camera.quaternion.clone();
    state.camera.quaternion.copy(currentQuat);
    state.camera.quaternion.slerp(targetQuat, 0.05);
  });
  return null;
};

// --- 3D SCENE COMPONENT ---
const RoomModel = ({ roomState, onHotspotClick }) => {
  const { scene: roomScene } = useGLTF('/gabungan.glb');

  // Used to find exact coordinates for debugging if clicked
  const handleSceneClick = (e) => {
    // console.log('Clicked coordinates:', e.point);
  };

  return (
    <group position={[0, -2, 0]} scale={1.2}>
      <primitive object={roomScene} onClick={handleSceneClick} />
      {/* --- HITBOXES (INVISIBLE) --- */}
      
      {/* 1. TV Hitbox & Label */}
      <group position={[0, 0.4, -1.8]}>
        <mesh 
          onClick={(e) => { e.stopPropagation(); onHotspotClick('tv'); }}
          onPointerEnter={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerLeave={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
          visible={false}
        >
          <boxGeometry args={[1.5, 1.5, 1]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
        <Html position={[0, 0.8, 0]} center className="pointer-events-none">
          <div className={`transition-all duration-1000 ${roomState === 'inside' ? 'opacity-100 animate-bounce' : 'opacity-0 scale-90'}`}>
            <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Click TV</span>
            </div>
          </div>
        </Html>
      </group>

      {/* 2. Camera Hitbox & Label */}
      <group position={[-1.2, -0.6, 0.5]}>
        <mesh 
          onClick={(e) => { e.stopPropagation(); onHotspotClick('camera'); }}
          onPointerEnter={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerLeave={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
          visible={false}
        >
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
        <Html position={[0, 0.5, 0]} center className="pointer-events-none">
          <div className={`transition-all duration-1000 delay-100 ${roomState === 'inside' ? 'opacity-100 animate-bounce' : 'opacity-0 scale-90'}`}>
            <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Click Camera</span>
            </div>
          </div>
        </Html>
      </group>

      {/* 3. Laptop Hitbox & Label */}
      <group position={[1.4, -0.4, 0.2]}>
        <mesh 
          onClick={(e) => { e.stopPropagation(); onHotspotClick('laptop'); }}
          onPointerEnter={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerLeave={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
          visible={false}
        >
          <boxGeometry args={[1.2, 1, 1]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh>
        <Html position={[0, 0.5, 0]} center className="pointer-events-none">
          <div className={`transition-all duration-1000 delay-200 ${roomState === 'inside' ? 'opacity-100 animate-bounce' : 'opacity-0 scale-90'}`}>
            <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Click Laptop</span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

// --- TUTORIAL TIMELINE ---
// Anda dapat mengedit angka `start` dan `end` (dalam hitungan detik) jika teks kurang pas dengan suara.
const TUTORIAL_STEPS = [
  { start: 0, end: 2.5, en: "Welcome to RFXVisual Studio.", id: "Selamat datang di RFXVisual Studio.", target: "forward" },
  { start: 2.5, end: 5.5, en: "Here you can view visual work by rfxvisual.", id: "Di sini Anda dapat melihat karya visual dari rfxvisual.", target: "forward" },
  { start: 5.5, end: 8.5, en: "Tap the TV to view the videography work.", id: "Ketuk TV untuk melihat karya videografi.", target: "tv" },
  { start: 8.5, end: 12.5, en: "Click the laptop to view the animation and website projects.", id: "Klik laptop untuk melihat proyek animasi dan website.", target: "laptop" },
  { start: 12.5, end: 14.5, en: "Tilt your head down slightly,", id: "Tundukkan kepala Anda sedikit,", target: "camera" },
  { start: 14.5, end: 17.5, en: "then press the camera to view the photo.", id: "lalu tekan kamera untuk melihat foto.", target: "camera" },
];

// --- MAIN PORTFOLIO COMPONENT ---
const PortofolioContent = () => {
  const { daftarKarya, daftarWebsite, daftarSubKategori } = useData();
  const [modalVideo, setModalVideo] = useState({ isOpen: false, url: '', type: 'youtube' });
  const [activeRoom, setActiveRoom] = useState(null); // null | 'tv' | 'camera' | 'laptop'
  const [roomState, setRoomState] = useState('intro'); // 'intro' | 'tutorial' | 'inside' | 'zoomed' | 'exiting'
  const [isWarping, setIsWarping] = useState(false);
  const { progress } = useProgress();

  // Audio Refs
  const audioRef = useRef(null); // Tutorial Voice
  const bgmRef = useRef(null);
  const clickSfxRef = useRef(null);
  const whooshShortRef = useRef(null);
  const whooshLongRef = useRef(null);
  const vhsRef = useRef(null);

  const [activeSubtitle, setActiveSubtitle] = useState(null);

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

  const handleOpenVideo = (url, type) => {
    setModalVideo({ isOpen: true, url, type });
    if (vhsRef.current) {
      vhsRef.current.volume = 0.3;
      vhsRef.current.play().catch(e => {});
    }
    if (bgmRef.current) bgmRef.current.volume = 0.05;
  };

  const videoData = allProjects.filter(p => p.category === 'video');
  const photoData = allProjects.filter(p => p.category === 'photo');
  const animData = allProjects.filter(p => p.category === 'animation');
  const webData = allProjects.filter(p => p.category === 'website');
  const videoSubcats = (daftarSubKategori || []).filter(sub => sub.parent_category === 'video');
  const photoSubcats = (daftarSubKategori || []).filter(sub => sub.parent_category === 'photo');

  // Handle clicking a hotspot
  const handleHotspotClick = (obj) => {
    if (clickSfxRef.current) clickSfxRef.current.play().catch(e => {});
    if (whooshShortRef.current) {
      whooshShortRef.current.currentTime = 0;
      whooshShortRef.current.play().catch(e => {});
    }
    setRoomState('zoomed');
    setActiveRoom(obj);
  };

  // Handle closing a modal
  const handleCloseModal = () => {
    setRoomState('inside');
    if (vhsRef.current) {
      // Fade out VHS noise (simple pause for now, or fade logic if preferred)
      vhsRef.current.pause();
    }
    if (bgmRef.current) bgmRef.current.volume = 0.15; // Restore BGM volume
    setTimeout(() => setActiveRoom(null), 500); // Wait for zoom out before fully destroying modal
  };

  // --- TUTORIAL LOGIC ---
  const startTutorial = () => {
    if (whooshLongRef.current) whooshLongRef.current.play().catch(e => {});
    setIsWarping(true);
    
    setTimeout(() => {
      setRoomState('tutorial');
      setIsWarping(false);
      
      // Start BGM
      if (bgmRef.current) {
        bgmRef.current.volume = 0.05; // Ducking during tutorial
        bgmRef.current.play().catch(e => {});
      }
      
      // Start voiceover
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
      }
    }, 300); // Warp duration
  };

  const skipTutorial = () => {
    setRoomState('inside');
    setActiveSubtitle(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (bgmRef.current) bgmRef.current.volume = 0.15; // Restore BGM volume
  };

  useEffect(() => {
    if (roomState !== 'tutorial') return;
    
    // Check audio timing every 100ms
    const interval = setInterval(() => {
      if (!audioRef.current) return;
      const t = audioRef.current.currentTime;
      const currentStep = TUTORIAL_STEPS.find(step => t >= step.start && t < step.end);
      
      if (currentStep) {
        setActiveSubtitle(currentStep);
      } else if (t > TUTORIAL_STEPS[TUTORIAL_STEPS.length - 1].end) {
        skipTutorial(); // Audio finished
      } else {
        setActiveSubtitle(null); // Silent gaps
      }
    }, 100);

    return () => clearInterval(interval);
  }, [roomState]);

  return (
    <>
      <VideoModal isOpen={modalVideo.isOpen} onClose={() => setModalVideo({ ...modalVideo, isOpen: false })} videoUrl={modalVideo.url} videoType={modalVideo.type} />
      <TransitionEffect />
      
      {/* White Flash Motion Blur Transition */}
      <AnimatePresence>
        {isWarping && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(50px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* 
        When not in intro, this main container acts as a fixed full-screen takeover, 
        hiding the normal footer. When in intro, it's relative so normal layout flows.
      */}
      <main className={`w-full h-screen ${roomState !== 'intro' && roomState !== 'exiting' ? 'fixed inset-0 z-50 bg-black' : 'relative bg-black'} overflow-hidden`}>
        
        {/* Animated Logo (Moves to corner) */}
        <motion.div 
          className={`absolute z-40 pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            roomState === 'intro' 
              ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center' 
              : 'top-6 left-6 md:top-8 md:left-8 text-left scale-50 md:scale-50 origin-top-left drop-shadow-lg'
          }`}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">MY STUDIO</h1>
          
          <AnimatePresence>
            {roomState === 'intro' && (
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-auto"
              >
                <p className="text-zinc-400 uppercase tracking-[0.3em] text-sm md:text-base mt-4 font-bold max-w-xl mb-12">
                  Click below to enter the creative space
                </p>
                {progress >= 99.9 ? (
                  <button 
                    onClick={startTutorial}
                    className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    Enter to the Room
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-logo-red transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-zinc-500 text-[10px] font-mono font-bold tracking-[0.3em] uppercase animate-pulse">
                      LOADING ASSETS... {Math.round(progress)}%
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Exit Screen Overlay */}
        <AnimatePresence>
          {roomState === 'exiting' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center z-40 bg-black"
            >
              <h2 className="text-2xl md:text-4xl font-display uppercase tracking-widest text-white">
                Thank you for visiting my creative studio.
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D WebGL Canvas (Hidden during intro so it's a surprise) */}
        <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 ${roomState === 'intro' ? 'opacity-0' : 'opacity-100'}`}>
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white font-mono z-50">
              LOADING 3D ASSETS...
            </div>
          }>
            <Canvas camera={{ position: [0, 5, 20], fov: 45 }}>
              <color attach="background" args={['#050505']} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <Environment preset="city" />

              <CameraRig roomState={roomState} targetObj={activeRoom} tutorialTarget={activeSubtitle?.target} />

              <RoomModel roomState={roomState} onHotspotClick={handleHotspotClick} />
              <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
            </Canvas>
          </Suspense>
        </div>

        {/* Exit Button & Helper Text (Visible when inside) */}
        <AnimatePresence>
          {roomState === 'inside' && (
            <motion.div 
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              className="absolute bottom-10 left-1/2 z-40 flex flex-col items-center gap-4"
            >
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap hidden md:block">
                Move mouse to look around • Click objects to view
              </p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap block md:hidden">
                Drag to look around • Tap objects to view
              </p>
              <button 
                onClick={() => {
                  if (whooshLongRef.current) whooshLongRef.current.play().catch(e => {});
                  setIsWarping(true);
                  if (bgmRef.current) bgmRef.current.pause();

                  setTimeout(() => {
                    setRoomState('exiting');
                    setIsWarping(false);
                    setTimeout(() => setRoomState('intro'), 2500); // Reset to intro after exit msg
                  }, 300);
                }}
                className="flex items-center justify-center px-8 py-2.5 bg-logo-red text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(232,69,77,0.5)] pointer-events-auto"
              >
                <span className="pl-[0.1em]">Exit Room</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tutorial Subtitle UI */}
        <AnimatePresence>
          {roomState === 'tutorial' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center z-40 pointer-events-none px-4"
            >
              {activeSubtitle && (
                <div className="bg-black/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 text-center max-w-2xl shadow-2xl">
                  <p className="text-white text-lg md:text-xl font-display font-bold">{activeSubtitle.en}</p>
                  <p className="text-zinc-400 text-xs md:text-sm mt-1 uppercase tracking-wider">{activeSubtitle.id}</p>
                </div>
              )}
              <button 
                onClick={skipTutorial}
                className="mt-6 pointer-events-auto px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-[10px] uppercase font-bold tracking-widest transition-colors backdrop-blur-md border border-white/20"
              >
                Skip Tutorial
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden Audio Elements */}
        <audio ref={audioRef} src="/speechpetunjuk.mp3" preload="auto" />
        <audio ref={bgmRef} src="/backsound.mp3" preload="auto" loop />
        <audio ref={clickSfxRef} src="/click_effect.mp3" preload="auto" />
        <audio ref={whooshShortRef} src="/whoosh_short.mp3" preload="auto" />
        <audio ref={whooshLongRef} src="/whoosh_long.mp3" preload="auto" />
        <audio ref={vhsRef} src="/vhs_noise.mp3" preload="auto" loop />
      </main>

      {/* 3. The Modals (Deep Dives) */}
      <AnimatePresence>
        {activeRoom === 'tv' && roomState === 'zoomed' && (
          <TvDeepDive data={videoData} subcategories={videoSubcats} onOpenVideo={handleOpenVideo} onClose={handleCloseModal} />
        )}
        {activeRoom === 'camera' && roomState === 'zoomed' && (
          <CameraDeepDive data={photoData} subcategories={photoSubcats} onClose={handleCloseModal} />
        )}
        {activeRoom === 'laptop' && roomState === 'zoomed' && (
          <LaptopDeepDive animData={animData} webData={webData} onOpenVideo={handleOpenVideo} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default PortofolioContent;
