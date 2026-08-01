'use client'

import React, { useState, useEffect } from 'react';
import { Camera, Video, Film, Mail, ArrowRight, Play, Instagram, Twitter, ChevronUp, Aperture, MonitorPlay, Zap, Star, Hexagon, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlassmorphismTemplate() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'services', 'gear', 'portfolio', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 300) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const works = [
    { id: 1, img: "https://placehold.co/800x800/050505/333333?text=Project+1", title: "Neon Nights", type: "Photography", category: "Photo", height: "h-[400px]" },
    { id: 2, img: "https://placehold.co/800x600/050505/333333?text=Project+2", title: "Analog Dreams", type: "Film", category: "Video", height: "h-[300px]" },
    { id: 3, img: "https://placehold.co/800x1000/050505/333333?text=Project+3", title: "Urban Exploration", type: "Photography", category: "Photo", height: "h-[500px]", colSpan: "md:col-span-2 lg:col-span-1" },
    { id: 4, img: "https://placehold.co/800x900/050505/333333?text=Project+4", title: "Nature's Echo", type: "Cinematography", category: "Video", height: "h-[450px]" },
    { id: 5, img: "https://placehold.co/800x700/050505/333333?text=Project+5", title: "Mountain Peak", type: "Photography", category: "Photo", height: "h-[350px]" },
    { id: 6, img: "https://placehold.co/800x800/050505/333333?text=Project+6", title: "Golden Hour", type: "Film", category: "Video", height: "h-[400px]" },
  ];

  const filteredWorks = activeFilter === 'All' ? works : works.filter(w => w.category === activeFilter);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const popIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const scaleVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20">
      
      {/* FLOATING GLASS DOCK (NAVBAR) */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-11/12 max-w-2xl">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full px-6 py-4 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
          
          <div className="flex w-full justify-between sm:justify-center sm:gap-8">
            {['home', 'about', 'services', 'gear', 'portfolio', 'contact'].map(item => (
              <button 
                key={item} 
                onClick={() => scrollTo(item)} 
                className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 relative group px-2 py-1 hidden sm:block ${activeSection === item ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {item}
                {activeSection === item && (
                  <motion.span layoutId="activeTab" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></motion.span>
                )}
              </button>
            ))}
            
            {/* Mobile simplified nav */}
            {['home', 'portfolio', 'contact'].map(item => (
              <button 
                key={`mob-${item}`} 
                onClick={() => scrollTo(item)} 
                className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 relative group px-2 py-1 sm:hidden ${activeSection === item ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {item}
                {activeSection === item && (
                  <motion.span layoutId="activeTabMobile" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></motion.span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80" alt="Cinematic" className="w-full h-full object-cover opacity-60 scale-105 animate-[slowzoom_20s_ease-in-out_infinite_alternate]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#050505]/60 to-[#050505]"></div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 text-center px-6 mt-10">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-light tracking-[0.3em] uppercase mb-8 shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
            Visual Artist & Filmmaker
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[10rem] font-extralight tracking-tighter mb-6 drop-shadow-2xl leading-[0.85]">
            VISUAL <br/>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-600">SYMPHONY</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-zinc-400 font-light max-w-lg mx-auto mb-10 text-sm md:text-base tracking-wide">
            Crafting cinematic experiences and timeless photographs. Based in Jakarta, available worldwide.
          </motion.p>
          
          <motion.button variants={fadeUp} onClick={() => scrollTo('portfolio')} className="group flex items-center gap-4 mx-auto text-xs uppercase tracking-[0.2em] hover:text-white text-zinc-400 transition-colors">
            <span className="w-12 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-20 transition-all duration-500"></span>
            Explore Archives
            <span className="w-12 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-20 transition-all duration-500"></span>
          </motion.button>
        </motion.div>
      </section>

      {/* TRUSTED BY LOGOS (NEW) */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02] relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest mb-8">Trusted by visionary brands</p>
          <div className="flex justify-center gap-12 md:gap-24 opacity-40 grayscale flex-wrap">
            {['VOGUE', 'SONY', 'NIKE', 'NETFLIX', 'HBO'].map((brand, i) => (
              <span key={i} className="text-xl md:text-2xl font-bold tracking-tighter hover:opacity-100 transition-opacity cursor-default">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={popIn} className="relative order-2 lg:order-1">
            <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-full"></div>
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-3xl shadow-2xl overflow-hidden aspect-[3/4]">
              <img src="https://placehold.co/800x1200/050505/333333?text=Director+Portrait" alt="Director Portrait" className="w-full h-full object-cover rounded-[1.25rem] opacity-80" />
            </div>
            
            {/* Floating Element 1 */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-3xl border border-white/10 p-6 rounded-2xl shadow-2xl w-52 hidden md:block">
              <div className="flex justify-between items-center mb-2">
                <Camera className="w-6 h-6 text-white/70" />
                <span className="text-3xl font-light">10+</span>
              </div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed">Years Behind <br/>The Lens</p>
            </motion.div>

            {/* Floating Element 2 */}
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-1/4 -left-12 bg-white/5 backdrop-blur-2xl border border-white/10 p-4 rounded-full shadow-2xl hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                <Star className="w-5 h-5 fill-black" />
              </div>
              <div className="pr-4">
                <p className="text-xs font-bold uppercase tracking-wider">Award Winning</p>
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Cinematography</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="order-1 lg:order-2">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-[1px] bg-white/30"></div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">The Director</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-extralight mb-8 leading-tight tracking-tight">
              A visual storyteller <br/> 
              <span className="font-bold text-zinc-500">obsessed with light & shadow.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 font-light leading-relaxed mb-6 text-lg">
              Every frame tells a story. Whether it's the raw emotion of an intimate portrait, the gritty reality of a documentary, or the sweeping grandeur of a commercial campaign.
            </motion.p>
            <motion.p variants={fadeUp} className="text-zinc-500 font-light leading-relaxed mb-12">
              My goal is to freeze time and evoke feelings that words simply cannot express. I don't just point a camera; I engineer moments.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="flex gap-10">
              <motion.div variants={fadeUp}>
                <div className="text-4xl font-light mb-2">200+</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Projects Delivered</div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="text-4xl font-light mb-2">15</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Global Locations</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES / EXPERTISE (NEW) */}
      <section id="services" className="py-32 px-6 relative z-10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 block">Core Competencies</span>
            <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">WHAT I DO <span className="font-bold">BEST</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Film className="w-8 h-8"/>, title: "Cinematography", desc: "High-end commercial and narrative filmmaking. RED & Arri systems." },
              { icon: <Aperture className="w-8 h-8"/>, title: "Photography", desc: "Fashion, editorial, and commercial photography with distinct lighting." },
              { icon: <MonitorPlay className="w-8 h-8"/>, title: "Color Grading", desc: "Professional DaVinci Resolve color grading for that perfect cinematic look." }
            ].map((srv, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6 } } }}
                key={i} 
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 scale-150 -translate-y-10 translate-x-10">
                  {srv.icon}
                </div>
                <div className="text-white mb-8 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  {srv.icon}
                </div>
                <h3 className="text-xl font-medium uppercase tracking-wider mb-4">{srv.title}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">{srv.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors cursor-pointer">
                  Learn More <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GEAR / ARSENAL (NEW) */}
      <section id="gear" className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="md:w-1/2">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extralight tracking-tight mb-8">THE <span className="font-bold">ARSENAL</span></motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 font-light leading-relaxed mb-12 max-w-md">
              Tools don't make the artist, but they certainly help execute the vision without compromise. My standard loadout for high-end productions.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="space-y-6">
              {[
                { title: "RED V-RAPTOR 8K VV", subtitle: "Primary A-Cam for commercial films." },
                { title: "Sony FX6 & A7S III", subtitle: "Documentary and fast-paced environments." },
                { title: "Zeiss CP.3 Primes", subtitle: "Cinematic, clinical, and perfect skin tones." },
                { title: "DJI Inspire 3", subtitle: "High-end aerial cinematography." }
              ].map((gear, i) => (
                <motion.div variants={fadeUp} key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                  <div className="mt-1 bg-white/10 p-2 rounded-full"><Crosshair className="w-4 h-4" /></div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1">{gear.title}</h4>
                    <p className="text-xs text-zinc-500">{gear.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleVariant} className="md:w-1/2 relative w-full h-[600px]">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl p-4">
              <img src="https://placehold.co/800x1200/050505/333333?text=Camera+Rig" alt="Camera Gear" className="w-full h-full object-cover rounded-[2.5rem] opacity-70 mix-blend-luminosity" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="py-32 px-6 relative z-10 bg-black/50 min-h-screen border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 block">The Showcase</span>
              <h2 className="text-4xl md:text-6xl font-extralight tracking-tight">SELECTED <br/> <span className="font-bold">ARCHIVES</span></h2>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-xl">
              {['All', 'Photo', 'Video'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full transition-all duration-300 ${
                    activeFilter === filter 
                    ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {filter === 'All' ? 'All Work' : filter}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredWorks.map((work) => (
                <motion.div 
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                  className={`group relative rounded-[2rem] overflow-hidden cursor-pointer ${work.height} ${work.colSpan || ''} border border-white/10 bg-white/5`}
                >
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                  
                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-5 rounded-2xl flex justify-between items-center shadow-2xl">
                      <div>
                        <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          {work.type === 'Film' || work.type === 'Cinematography' ? <Video className="w-3 h-3"/> : <Camera className="w-3 h-3"/>}
                          {work.type}
                        </p>
                        <h3 className="text-base font-bold uppercase tracking-wider">{work.title}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {work.type === 'Film' || work.type === 'Cinematography' ? <Play className="w-4 h-4 ml-1" /> : <ArrowRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          <div className="mt-20 flex justify-center">
            <button className="px-10 py-4 border border-white/20 rounded-full text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300">
              View Complete Archive
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (NEW) */}
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extralight tracking-tight">CLIENT <span className="font-bold">VOICES</span></h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { text: "Absolute genius behind the camera. The cinematic quality they brought to our commercial exceeded all expectations.", client: "Creative Director, VOGUE" },
              { text: "A rare breed of visual artist who understands both technical perfection and raw emotion. Our go-to DOP.", client: "Producer, Netflix" }
            ].map((testi, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.3 } } }}
                key={i} className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] relative"
              >
                <div className="text-6xl text-white/10 font-serif absolute top-6 left-6">"</div>
                <p className="text-lg font-light leading-relaxed mb-8 relative z-10 italic">"{testi.text}"</p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full overflow-hidden">
                    <img src={`https://placehold.co/100x100/050505/333333?text=User`} alt="Client" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400">{testi.client}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 px-6 relative z-10 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <img src="https://placehold.co/1920x1080/050505/111111?text=Contact+Background" alt="Contact BG" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-7xl font-extralight tracking-tight mb-8">LET'S CREATE <br/><span className="font-bold text-zinc-500">SOMETHING BEAUTIFUL</span></motion.h2>
          
          <motion.div variants={popIn} className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-14 rounded-[3rem] text-left max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <form className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Your Name</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-white/40 focus:bg-black/60 transition-all" placeholder="YOUR NAME" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Your Email</label>
                  <input type="email" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-white/40 focus:bg-black/60 transition-all" placeholder="YOUR@EMAIL.COM" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Project Details</label>
                <textarea rows="5" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-white/40 focus:bg-black/60 transition-all" placeholder="Tell me about your vision..."></textarea>
              </div>
              
              <button type="button" className="w-full py-5 rounded-2xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                Send Inquiry <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-24 flex flex-col items-center gap-8 border-t border-white/10 pt-12">
            <div className="flex gap-4">
              {[<Instagram key="1"/>, <Twitter key="2"/>, <Mail key="3"/>].map((icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/20 hover:scale-110 transition-all">
                  {React.cloneElement(icon, { className: "w-5 h-5" })}
                </a>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">© 2026 Glassmorphism Visuals. All Rights Reserved.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Global Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slowzoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
