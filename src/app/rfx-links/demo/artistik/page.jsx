'use client'

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Palette, Brush, Code, Send, Menu, X, Instagram, Dribbble, Twitter, Heart, Sparkles, MoveRight, Shapes, PenTool, Figma, Monitor, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArtistikTemplate() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'toolkit', 'works', 'testimonials', 'contact'];
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
    setIsMenuOpen(false);
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scaleVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", type: "spring", bounce: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const portfolioItems = [
    { id: 1, img: "https://placehold.co/800x800/FFF4E0/000000?text=Artwork+Illustration", title: "Abstract Shapes", tag: "Illustration", color: "bg-[#FF90E8]" },
    { id: 2, img: "https://placehold.co/800x800/FFF4E0/000000?text=Artwork+Digital", title: "Neon City", tag: "Digital Art", color: "bg-[#23A094]" },
    { id: 3, img: "https://placehold.co/800x800/FFF4E0/000000?text=Artwork+Branding", title: "Funky Character", tag: "Branding", color: "bg-[#FFD500]" },
    { id: 4, img: "https://placehold.co/800x800/FFF4E0/000000?text=Artwork+UI", title: "Brand Kit", tag: "Web Design", color: "bg-white" },
    { id: 5, img: "https://placehold.co/800x800/FFF4E0/000000?text=Artwork+Illustration+2", title: "Cosmic Vibes", tag: "Illustration", color: "bg-[#23A094]" },
    { id: 6, img: "https://placehold.co/800x800/FFF4E0/000000?text=Artwork+Branding+2", title: "Streetwear Logo", tag: "Branding", color: "bg-[#FF90E8]" },
  ];

  const filteredItems = activeFilter === 'All' ? portfolioItems : portfolioItems.filter(item => item.tag === activeFilter);

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black font-sans selection:bg-black selection:text-[#FF90E8] overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          {/* Logo */}
          <div className="text-2xl font-black tracking-tighter bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] hover:rotate-0 transition-transform cursor-pointer" onClick={() => scrollTo('home')}>
            ART<span className="text-[#23A094]">ISTIK</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-2 bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full">
            {['home', 'about', 'services', 'toolkit', 'works', 'contact'].map(item => (
              <button 
                key={item} 
                onClick={() => scrollTo(item)} 
                className={`px-5 py-2 text-sm font-bold uppercase tracking-wider rounded-full transition-all border-2 border-transparent ${activeSection === item ? 'bg-[#FFD500] border-black shadow-inner' : 'hover:bg-[#FFF4E0]'}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden bg-[#FF90E8] border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            {isMenuOpen ? <X className="w-6 h-6 stroke-[3]" /> : <Menu className="w-6 h-6 stroke-[3]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#FFF4E0] pt-28 px-6 lg:hidden border-b-8 border-black h-fit pb-10 shadow-[0_20px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex flex-col gap-4">
               {['home', 'about', 'services', 'toolkit', 'works', 'contact'].map(item => (
                <button key={item} onClick={() => scrollTo(item)} className="text-3xl font-black uppercase tracking-tighter text-left bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD500] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="home" className="pt-32 pb-20 px-6 min-h-screen flex items-center relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#FF90E8] rounded-full mix-blend-multiply opacity-50 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#FFD500] rounded-full mix-blend-multiply opacity-50 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 bg-[#23A094] text-white font-bold px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 -rotate-2">
              Hello, World! <Sparkles className="w-5 h-5 fill-white" />
            </motion.div>
            <motion.h1 variants={fadeUpVariant} className="text-6xl md:text-8xl lg:text-[7.5rem] font-black uppercase leading-[0.85] tracking-tighter mb-8 text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
              I Create <br/>
              <span className="text-[#FF90E8] drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] stroke-black" style={{ WebkitTextStroke: '3px black' }}>Visual</span> <br/>
              Magic.
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-xl md:text-2xl font-bold border-l-8 border-[#FFD500] pl-6 mb-12 max-w-lg leading-snug">
              Independent Illustrator & UI/UX Designer based in Indonesia. Bringing ideas to life through bold colors and unapologetic designs.
            </motion.p>
            <motion.button variants={scaleVariant} onClick={() => scrollTo('works')} className="bg-[#FFD500] border-4 border-black px-10 py-5 text-xl font-black uppercase tracking-wider flex items-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group">
              View My Work <ArrowUpRight className="w-8 h-8 stroke-[4] group-hover:rotate-45 transition-transform" />
            </motion.button>
          </motion.div>
          
          <motion.div variants={scaleVariant} initial="hidden" animate="visible" className="relative hidden md:block">
            <div className="absolute inset-0 bg-[#FF90E8] border-4 border-black translate-x-6 translate-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl"></div>
            <img src="https://placehold.co/600x800/FFF4E0/000000?text=Hero+Image+600x800" alt="Artist Profile" className="relative z-10 w-full h-[600px] object-cover border-4 border-black grayscale hover:grayscale-0 transition-all duration-700 rounded-3xl" />
            
            {/* Floating Badges */}
            <motion.div animate={{ rotate: [ -6, 0, -6 ] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-8 -left-8 z-20 bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-5xl font-black mb-1">5+</div>
              <div className="text-sm font-bold uppercase border-t-4 border-black pt-1">Years Exp.</div>
            </motion.div>
            
            <motion.div animate={{ rotate: [ 6, 0, 6 ] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-1/4 -right-10 z-20 bg-[#23A094] text-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-full w-24 h-24 flex items-center justify-center text-center leading-tight">
              <span className="font-black uppercase text-sm">Award<br/>Winner</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MY SKILL */}
      <section className="py-8 bg-black border-y-8 border-black relative z-20 flex overflow-hidden">
        {/* Static Title */}
        <div className="bg-black z-30 px-6 md:px-10 flex items-center shrink-0 shadow-[20px_0_20px_-10px_rgba(0,0,0,1)] relative border-r-4 border-zinc-900">
          <h3 className="text-[#FFD500] font-black uppercase text-xl md:text-2xl whitespace-nowrap">My Skill:</h3>
        </div>
        
        {/* Scrolling Content */}
        <div className="flex flex-1 overflow-hidden items-center group relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>
          
          <div className="animate-marquee flex gap-12 md:gap-20 items-center w-max group-hover:[animation-play-state:paused] pl-12">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {['Adobe Illustrator', 'Adobe Photoshop', 'Adobe Animation', 'Corel Draw', 'IbisPaint', 'Blender'].map((skill, j) => (
                  <span key={`${i}-${j}`} className="text-2xl md:text-3xl font-black text-white hover:text-[#FF90E8] transition-colors cursor-default drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)] whitespace-nowrap">
                    {skill}
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-32 px-6 bg-[#23A094] border-b-8 border-black relative overflow-hidden">
        <div className="absolute top-10 left-10 text-[15rem] text-black opacity-10 pointer-events-none font-black leading-none">*</div>
        <div className="absolute bottom-10 right-10 text-[15rem] text-black opacity-10 pointer-events-none font-black leading-none">#</div>
        
        <div className="max-w-7xl mx-auto text-black relative z-10">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-20">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] -rotate-2">
              Who The <br/> Heck Am I?
            </h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left: Bio & Photo */}
            <motion.div variants={scaleVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:w-1/2 flex flex-col gap-8 w-full">
              <div className="bg-white border-4 border-black p-5 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                <div className="aspect-[4/5] border-4 border-black overflow-hidden mb-6 relative">
                  <div className="absolute inset-0 bg-[#FF90E8] opacity-20 mix-blend-multiply z-10 pointer-events-none"></div>
                  <img src="https://placehold.co/800x1000/FFF4E0/000000?text=Profile+Photo+800x1000" alt="Artist Portrait" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex justify-between items-center bg-[#FFF4E0] border-4 border-black p-4">
                  <div>
                    <h3 className="font-black text-3xl uppercase tracking-tighter">YOUR NAME</h3>
                    <p className="font-bold text-sm uppercase opacity-80 mt-1">Creative Director</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFD500] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12">
                    <span className="font-black text-2xl">!</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Details */}
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:w-1/2 flex flex-col gap-10">
              <motion.div variants={fadeUpVariant} className="bg-[#FFF4E0] border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="absolute -top-6 -right-6 bg-[#FF90E8] border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12">
                  <Heart className="w-8 h-8 fill-white stroke-black stroke-2" />
                </div>
                <h3 className="text-4xl font-black uppercase mb-8 border-b-8 border-black pb-4 inline-block">My Story</h3>
                <div className="space-y-6 font-bold text-xl leading-relaxed">
                  <p>
                    I'm a self-taught multidisciplinary artist who decided that standard corporate design was too gray for my taste. So I started breaking rules.
                  </p>
                  <p>
                    With over 5 years in the creative industry, I've helped startups, bands, and massive brands find their unique visual voice—loud, colorful, and completely unapologetic.
                  </p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 pt-8 border-t-8 border-black">
                  <div>
                    <div className="text-5xl font-black text-[#FF90E8] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] stroke-black" style={{ WebkitTextStroke: '2px black' }}>120+</div>
                    <div className="text-sm font-black uppercase mt-3">Projects</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] stroke-black" style={{ WebkitTextStroke: '2px black' }}>15</div>
                    <div className="text-sm font-black uppercase mt-3">Countries</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-5xl font-black text-[#FFD500] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] stroke-black" style={{ WebkitTextStroke: '2px black' }}>12</div>
                    <div className="text-sm font-black uppercase mt-3">Awards</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION (NEW) */}
      <section id="services" className="py-32 px-6 bg-white border-b-8 border-black relative overflow-hidden">
        {/* Repeating Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(black 4px, transparent 4px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-24">
            <div className="inline-block bg-black text-white px-6 py-2 border-4 border-black font-black uppercase text-xl mb-6 shadow-[6px_6px_0px_0px_rgba(255,144,232,1)] rotate-1">What I Do</div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
              Services & Expertise
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Palette className="w-12 h-12"/>, title: "Illustration", desc: "Custom digital illustrations, editorial art, and poster designs that demand attention.", color: "bg-[#FF90E8]" },
              { icon: <Shapes className="w-12 h-12"/>, title: "Branding", desc: "Loud brand identities, logo design, and visual guidelines for modern companies.", color: "bg-[#23A094]" },
              { icon: <Code className="w-12 h-12"/>, title: "UI/UX Design", desc: "Web and app interfaces focusing on brutalist aesthetics and seamless experiences.", color: "bg-[#FFD500]" }
            ].map((skill, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, type: "spring", bounce: 0.4 } } }}
                key={i} 
                className={`${skill.color} border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full`}
              >
                <div className="bg-white border-4 border-black w-24 h-24 flex items-center justify-center rounded-full mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {skill.icon}
                </div>
                <h3 className="text-3xl font-black uppercase mb-4 leading-tight">{skill.title}</h3>
                <p className="font-bold text-lg flex-grow">{skill.desc}</p>
                <button className="mt-8 bg-black text-white border-4 border-black px-6 py-3 font-black uppercase flex items-center justify-between hover:bg-white hover:text-black transition-colors w-full group">
                  Details <MoveRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE TOOLKIT / GEAR (NEW) */}
      <section id="toolkit" className="py-24 px-6 bg-[#FF90E8] border-b-8 border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:w-1/2">
            <motion.h2 variants={fadeUpVariant} className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-white">
              The <br/> Arsenal
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="text-xl font-bold mb-10 max-w-md border-l-8 border-black pl-6">
              A master is only as good as their tools. Here's what I use to brew my visual magic on a daily basis.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
              {[
                { name: "Figma", icon: <Figma/> },
                { name: "Procreate", icon: <PenTool/> },
                { name: "Illustrator", icon: <Shapes/> },
                { name: "Mac Studio", icon: <Monitor/> }
              ].map((tool, i) => (
                <motion.div variants={scaleVariant} key={i} className="bg-white border-4 border-black p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD500] transition-colors cursor-default">
                  <div className="bg-black text-white p-2">{tool.icon}</div>
                  <span className="font-black uppercase tracking-wider">{tool.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div variants={scaleVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:w-1/2 w-full">
             <div className="bg-[#FFF4E0] border-8 border-black p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-2 hover:rotate-0 transition-transform">
               <img src="https://placehold.co/800x600/23A094/000000?text=Workspace+Setup" alt="Workspace Setup" className="w-full h-auto border-4 border-black grayscale" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* PORTFOLIO SECTION (INTERACTIVE) */}
      <section id="works" className="py-32 px-6 bg-[#FFF4E0] border-b-8 border-black">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
              Selected <br/> Works
            </h2>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-4 bg-white border-4 border-black p-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              {['All', 'Illustration', 'Digital Art', 'Branding', 'Web Design'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 font-black uppercase text-sm border-4 transition-all ${
                    activeFilter === filter 
                    ? 'bg-black text-white border-black' 
                    : 'bg-transparent text-black border-transparent hover:border-black hover:bg-[#FFD500]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((work) => (
                <motion.div 
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 ${work.color} border-4 border-black translate-x-4 translate-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-6 group-hover:translate-y-6 transition-all duration-300`}></div>
                    <img src={work.img} alt={work.title} className="relative z-10 w-full aspect-square object-cover border-4 border-black grayscale group-hover:grayscale-0 transition-all duration-500" />
                    
                    <div className="absolute top-4 right-4 z-20 bg-[#FFD500] border-4 border-black w-14 h-14 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-12 group-hover:rotate-0">
                      <ArrowUpRight className="w-8 h-8 stroke-[4]" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] group-hover:rotate-0 transition-transform">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black uppercase leading-none">{work.title}</h3>
                      <span className="font-black px-2 py-1 bg-black text-white text-[10px] uppercase whitespace-nowrap">{work.tag}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* HALL OF FAME / TESTIMONIALS (NEW) */}
      <section id="testimonials" className="py-32 px-6 bg-black text-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#FFD500] drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
              Hall of Fame
            </h2>
            <p className="text-xl font-bold mt-4 uppercase tracking-wider">What the clients scream about</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { text: "They completely blew our minds. The branding identity is so loud and distinct, it practically prints money for us now.", client: "CEO, Tech Startup", color: "bg-[#23A094]", rotate: "-rotate-2" },
              { text: "Finally, a designer who understands that we don't want another boring corporate website. 11/10 would hire again.", client: "Founder, Apparel Brand", color: "bg-[#FF90E8]", rotate: "rotate-2" }
            ].map((testi, i) => (
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.2, type: "spring" } } }}
                key={i} className={`${testi.color} border-8 border-white p-10 text-black ${testi.rotate} shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] hover:rotate-0 transition-transform`}
              >
                <MessageSquare className="w-12 h-12 mb-6" />
                <p className="text-2xl font-black uppercase leading-tight mb-8">"{testi.text}"</p>
                <div className="border-t-8 border-black pt-6 flex items-center justify-between">
                  <span className="font-black text-lg uppercase bg-white border-4 border-black px-4 py-1">{testi.client}</span>
                  <div className="flex text-[#FFD500] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-6 h-6 fill-current stroke-black" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT & FOOTER */}
      <section id="contact" className="pt-32 bg-[#FFD500] relative overflow-hidden">
        {/* Marquee Background */}
        <div className="absolute top-20 left-0 w-full whitespace-nowrap opacity-20 pointer-events-none -rotate-3">
          <div className="animate-marquee inline-block text-[12rem] font-black uppercase tracking-tighter leading-none">
            LET'S TALK LET'S TALK LET'S TALK LET'S TALK 
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center pb-32">
          <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16">
            <div className="inline-block bg-[#FF90E8] border-4 border-black p-4 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-12">
              <Send className="w-12 h-12 stroke-[3]" />
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-[6px_6px_0px_rgba(255,255,255,1)]">
              Got a project?
            </h2>
          </motion.div>
          
          <motion.form variants={scaleVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-white border-8 border-black p-8 md:p-12 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] text-left max-w-3xl mx-auto mb-20 rotate-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-xl font-black uppercase mb-3">Name</label>
                <input type="text" className="w-full bg-[#FFF4E0] border-4 border-black p-5 font-bold text-lg outline-none focus:bg-[#FF90E8] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="YOUR NAME" />
              </div>
              <div>
                <label className="block text-xl font-black uppercase mb-3">Email</label>
                <input type="email" className="w-full bg-[#FFF4E0] border-4 border-black p-5 font-bold text-lg outline-none focus:bg-[#23A094] focus:text-white focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="YOUR@EMAIL.COM" />
              </div>
            </div>
            <div className="mb-10">
              <label className="block text-xl font-black uppercase mb-3">Message</label>
              <textarea rows="5" className="w-full bg-[#FFF4E0] border-4 border-black p-5 font-bold text-lg outline-none focus:bg-black focus:text-white focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="TELL ME ABOUT YOUR PROJECT"></textarea>
            </div>
            <button type="button" className="w-full bg-black text-white border-4 border-black p-6 font-black uppercase text-2xl shadow-[8px_8px_0px_0px_rgba(35,160,148,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(35,160,148,1)] active:bg-[#FF90E8] active:text-black transition-all flex justify-center items-center gap-4 group">
              Send Message <ArrowUpRight className="w-8 h-8 stroke-[4] group-hover:rotate-45 transition-transform" />
            </button>
          </motion.form>

          {/* Socials & Footer */}
          <div className="flex flex-col items-center border-t-8 border-black pt-12">
            <div className="flex justify-center gap-6 mb-12">
              {[<Instagram key="1"/>, <Dribbble key="2"/>, <Twitter key="3"/>].map((icon, i) => (
                <a key={i} href="#" className="bg-white border-4 border-black w-16 h-16 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:bg-[#23A094] hover:text-white transition-all">
                  {React.cloneElement(icon, { className: "w-8 h-8 stroke-[3]" })}
                </a>
              ))}
            </div>

            <div className="bg-white border-4 border-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
              <p className="font-black text-lg uppercase flex items-center justify-center gap-2">
                © 2026 Artistik Portfolio. Designed with <Heart className="w-6 h-6 fill-black stroke-black" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Styles for Marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
