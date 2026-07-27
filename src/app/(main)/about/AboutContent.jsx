'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useMotionValueEvent } from 'framer-motion'
import AnimatedText from '@/components/AnimatedText'
import TransitionEffect from '@/components/TransitionEffect'
import ItemKeahlian from '@/components/ItemKeahlian'
import Tilt from 'react-parallax-tilt'
import { useData } from '@/components/DataProvider'

const AnimatedNumbers = ({ value }) => {
  return <span className="inline-block text-5xl sm:text-7xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">{value}</span>
}

// --- SCREEN 1: BIOGRAPHY (The Entrance) ---
const ScreenBio = ({ configSitus, widthVw }) => {
  return (
    <div style={{ width: `${widthVw}vw` }} className="h-full flex flex-row items-center justify-start relative shrink-0">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-logo-red/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Text Content Screen (100vw on mobile, 50% on desktop) */}
      <div className="w-[100vw] md:w-auto md:flex-1 h-full flex flex-col items-start justify-center px-8 sm:px-12 md:px-20 shrink-0 z-10 pt-10 md:pt-0">
        <AnimatedText text="ABOUT ME." className="!text-6xl sm:!text-8xl md:!text-9xl font-display uppercase tracking-widest text-left mb-6 drop-shadow-2xl whitespace-nowrap" />

        <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] text-logo-red font-display flex items-center gap-4 mb-4 md:mb-6">
          <span className="w-8 md:w-12 h-[2px] bg-logo-red"></span> BIOGRAPHY
        </h2>

        <p className="font-medium text-zinc-300 text-sm sm:text-base md:text-xl leading-relaxed mb-6 md:mb-10 text-justify bg-black/40 p-5 md:p-8 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
          {configSitus?.homeDescription || "Hai, saya RFX Visual. Saya adalah seorang seniman visual, videografer, dan editor yang fokus pada menciptakan karya digital berkualitas."}
        </p>

        <div className="pl-4 md:pl-6 border-l-4 border-logo-red py-2 relative">
          <div className="absolute -left-3 top-0 text-3xl md:text-5xl text-logo-red/30 font-serif leading-none">"</div>
          <p className="italic font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 text-base sm:text-lg md:text-2xl">
            {configSitus?.aboutQuote || "Setiap frame memiliki ceritanya sendiri."}
          </p>
        </div>
      </div>

      {/* Image Screen (100vw on mobile, 50% on desktop) */}
      <div className="w-[100vw] md:w-auto md:flex-1 h-full flex items-center justify-center px-10 md:px-20 shrink-0 z-10">
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.05} transitionSpeed={2000} className="w-full max-w-[280px] sm:max-w-sm md:max-w-xl">
          <div className="relative w-full aspect-[3/4] p-3 md:p-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(232,69,77,0.2)] rounded-3xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-logo-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
            <img
              src={configSitus?.aboutImage || "https://placehold.co/800x1000/111/222?text=About+Image"}
              alt="RFX Visual About"
              className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </Tilt>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 md:bottom-10 right-6 md:right-20 flex items-center gap-4 text-zinc-500 animate-pulse z-20">
        <span className="uppercase tracking-widest text-[10px] md:text-xs font-bold">Scroll</span>
        <div className="w-10 md:w-16 h-[1px] bg-zinc-500 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-zinc-500 rotate-45" />
        </div>
      </div>
    </div>
  )
}

// --- SCREEN 2: HORIZONTAL TIMELINE ---
const ScreenJourney = ({ experiences, scrollYProgress, startVw, widthVw, maxTranslateVw }) => {
  const fallback = useMotionValue(0);
  const progress = scrollYProgress || fallback;

  if (!experiences || experiences.length === 0) return <div style={{ width: `${widthVw}vw` }} className="shrink-0" />;

  return (
    <div style={{ width: `${widthVw}vw` }} className="h-full flex flex-col items-center justify-center relative shrink-0">

      <div className="absolute top-20 md:top-32 w-full text-center">
        <h2 className="text-4xl md:text-7xl font-display font-black text-white/10 uppercase tracking-[0.5em]">The Journey</h2>
      </div>

      <div className="w-full h-[60vh] relative flex items-center px-10 md:px-32">
        {/* Horizontal Line Track (Hidden on mobile to prevent overlapping text) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 hidden md:block" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-logo-red-dark via-logo-red to-transparent opacity-50 blur-sm hidden md:block" />

        <div className="flex items-center gap-10 md:gap-32 w-full z-10 relative">
          {experiences.map((exp, index) => {
            const isTop = index % 2 === 0;
            
            // Dynamic scroll-linked lighting logic based on exact vw positions
            const cardStartVw = startVw - 50 + (index * (widthVw / experiences.length));
            const start = cardStartVw / maxTranslateVw;
            const peak = start + (30 / maxTranslateVw);
            const end = peak + (30 / maxTranslateVw);

            const opacity = useTransform(progress, [start, peak, end], [0.3, 1, 0.3]);
            const scale = useTransform(progress, [start, peak, end], [0.9, 1.05, 0.9]);
            const borderColor = useTransform(progress, [start, peak, end], ["rgba(255,255,255,0.05)", "rgba(232,69,77,0.8)", "rgba(255,255,255,0.05)"]);
            const shadow = useTransform(progress, [start, peak, end], ["0px 0px 0px rgba(232,69,77,0)", "0px 10px 40px rgba(232,69,77,0.4)", "0px 0px 0px rgba(232,69,77,0)"]);
            
            const dotColor = useTransform(progress, [start, peak, end], ["rgba(255,255,255,0.2)", "rgba(232,69,77,1)", "rgba(255,255,255,0.2)"]);
            const dotScale = useTransform(progress, [start, peak, end], [1, 1.5, 1]);

            return (
              <div key={exp.id} className="relative flex flex-col items-center w-[250px] md:w-[350px] shrink-0 group">

                {/* Node (Hidden on mobile) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-20 hidden md:flex items-center justify-center">
                  <motion.div 
                    style={scrollYProgress ? { backgroundColor: dotColor, scale: dotScale } : { backgroundColor: "rgba(232,69,77,1)", scale: 1 }} 
                    className="w-4 h-4 rounded-full border border-black shadow-[0_0_15px_rgba(232,69,77,0.5)]"
                  />
                </div>

                {/* Card */}
                <motion.div 
                  style={scrollYProgress ? { opacity, scale, borderColor, boxShadow: shadow } : { opacity: 1, scale: 1, borderColor: "rgba(255,255,255,0.1)", boxShadow: "none" }}
                  className={`w-full p-6 md:p-8 bg-[#0a0a0a]/90 backdrop-blur-xl border-[2px] rounded-3xl ${isTop ? 'mb-40 md:mb-64' : 'mt-40 md:mt-64'}`}
                >
                  <h3 className="capitalize font-bold text-xl md:text-2xl font-display text-white tracking-tight">
                    {exp.title}
                  </h3>
                  <span className="text-logo-red font-bold text-sm block mt-1 uppercase tracking-widest">{exp.company}</span>
                  <span className="capitalize font-semibold text-zinc-500 text-xs block mt-2 tracking-wider border-b border-white/10 pb-3">
                    {exp.year}
                  </span>
                  <p className="font-medium text-sm mt-4 text-zinc-400 leading-relaxed text-justify line-clamp-4 group-hover:line-clamp-none transition-all">
                    {exp.description}
                  </p>
                </motion.div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Wrapper to control each skill's scrollbar animation
const SkillCardWrapper = ({ skill, progress, start, end, isMobile }) => {
  const [isActive, setIsActive] = useState(false);
  
  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest >= start && !isActive) setIsActive(true);
    else if (latest < start && isActive) setIsActive(false);
  });

  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.div 
      style={!isMobile ? { opacity } : { opacity: 1 }} 
      className="w-full md:w-[45%]"
    >
      <ItemKeahlian keahlian={skill} forceTerlihat={!isMobile ? isActive : undefined} />
    </motion.div>
  )
}

// --- SCREEN 3: SKILLS GALLERY ---
const ScreenSkills = ({ skills, scrollYProgress, startVw, widthVw, maxTranslateVw }) => {
  const fallback = useMotionValue(0);
  const progress = scrollYProgress || fallback;

  if (!skills || skills.length === 0) return <div style={{ width: `${widthVw}vw` }} className="shrink-0" />;

  // Container Pop-up animation
  const popStart = (startVw - 50) / maxTranslateVw;
  const popEnd = popStart + (20 / maxTranslateVw);
  const containerOpacity = useTransform(progress, [popStart, popEnd], [0, 1]);
  const containerScale = useTransform(progress, [popStart, popEnd], [0.8, 1]);

  return (
    <div style={{ width: `${widthVw}vw` }} className="h-full flex flex-col items-center justify-center p-8 md:p-20 relative shrink-0 overflow-hidden">

      {/* Decorative large text */}
      <h2 className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-[13vh] font-display font-black text-white/[0.03] whitespace-nowrap">
        HOBBIES
      </h2>

      <motion.div 
        style={{ opacity: containerOpacity, scale: containerScale }} 
        className="z-10 w-full max-w-5xl flex flex-col items-center"
      >
        <h2 className="font-bold font-display text-5xl md:text-7xl mb-16 w-full text-center tracking-tight uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          My <span className="text-logo-red">Skills</span>
        </h2>

        {/* Carousel pop-up items sequentially */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 w-full">
          {skills.map((skill, index) => {
            const start = popEnd + (index * (15 / maxTranslateVw));
            const end = start + (15 / maxTranslateVw);
            
            return (
              <SkillCardWrapper 
                key={skill.id} 
                skill={skill} 
                progress={progress} 
                start={start} 
                end={end} 
                isMobile={false}
              />
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

// --- SCREEN 4: WEBSITES & STATS ---
const ScreenStatsWebsites = ({ daftarWebsite, configSitus }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!daftarWebsite || daftarWebsite.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % daftarWebsite.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [daftarWebsite]);

  return (
    <div className="w-[100vw] h-full flex flex-col items-center justify-center p-8 md:p-20 relative shrink-0">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-20">

        {/* STATS PANEL */}
        <div className="flex flex-col justify-center gap-12">
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-widest mb-4">
            By The <span className="text-logo-red">Numbers</span>
          </h2>

          <div className="flex flex-col gap-8 border-l-2 border-white/10 pl-8">
            <div className="flex flex-col items-start group">
              <AnimatedNumbers value={configSitus?.statClients || '40+'} />
              <h2 className="text-sm md:text-lg font-medium uppercase tracking-widest text-zinc-500 group-hover:text-logo-red transition-colors mt-2">Satisfied Clients</h2>
            </div>
            <div className="flex flex-col items-start group">
              <AnimatedNumbers value={configSitus?.statProjects || '50+'} />
              <h2 className="text-sm md:text-lg font-medium uppercase tracking-widest text-zinc-500 group-hover:text-logo-red transition-colors mt-2">Projects Completed</h2>
            </div>
            <div className="flex flex-col items-start group">
              <AnimatedNumbers value={configSitus?.statYears || '4+'} />
              <h2 className="text-sm md:text-lg font-medium uppercase tracking-widest text-zinc-500 group-hover:text-logo-red transition-colors mt-2">Years of Experience</h2>
            </div>
          </div>
        </div>

        {/* WEBSITES CAROUSEL */}
        {daftarWebsite && daftarWebsite.length > 0 && (
          <div className="flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-zinc-400 mb-8 font-display">Featured Websites</h2>

            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-[#050505] relative group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <a href={daftarWebsite[currentIndex].link_web} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img
                      src={daftarWebsite[currentIndex].link_preview || 'https://placehold.co/800x600/111/222?text=Website'}
                      alt={daftarWebsite[currentIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
                      <span className="inline-block px-4 py-1.5 bg-logo-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full w-max mb-4 shadow-[0_0_15px_rgba(232,69,77,0.5)]">Live Site</span>
                      <h3 className="text-white font-bold font-display text-3xl md:text-4xl drop-shadow-lg">{daftarWebsite[currentIndex].title}</h3>
                    </div>
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// --- MAIN WRAPPER ---
const AboutContent = () => {
  const { configSitus, skills, experiences, daftarWebsite } = useData()
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bioVw = isMobile ? 200 : 100;
  const journeyVw = isMobile ? 250 : 150;
  const skillsVw = isMobile ? 150 : 100;
  const totalVw = bioVw + journeyVw + skillsVw + 100; // e.g. Desktop: 450, Mobile: 700
  const maxTranslateVw = totalVw - 100; // e.g. Desktop: 350, Mobile: 600

  // Calculate horizontal scroll percentage based on wrapper width
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Use identical calc format so Framer Motion can interpolate accurately
  const x = useTransform(scrollYProgress, [0, 1], ["calc(0vw - 0vw)", `calc(0vw - ${maxTranslateVw}vw)`]);

  return (
    <>
      <TransitionEffect />
      <main className="bg-[#050505] text-white">

        {/* Unified View: Cinematic Horizontal Scroll for ALL devices */}
        <section ref={containerRef} className="relative w-full" style={{ height: `${totalVw}vh` }}>
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center pt-24 lg:pt-0 bg-[url('/bg-noise.png')] bg-repeat opacity-95">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-logo-red/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

            <motion.div style={{ x, width: `${totalVw}vw` }} className="flex h-full items-center">
              <ScreenBio configSitus={configSitus} widthVw={bioVw} />
              <ScreenJourney experiences={experiences} scrollYProgress={scrollYProgress} startVw={bioVw} widthVw={journeyVw} maxTranslateVw={maxTranslateVw} />
              <ScreenSkills skills={skills} scrollYProgress={scrollYProgress} startVw={bioVw + journeyVw} widthVw={skillsVw} maxTranslateVw={maxTranslateVw} />
              <ScreenStatsWebsites daftarWebsite={daftarWebsite} configSitus={configSitus} />
            </motion.div>
          </div>
        </section>

      </main>
    </>
  )
}

export default AboutContent;
