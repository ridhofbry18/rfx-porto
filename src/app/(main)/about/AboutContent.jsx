'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import AnimatedText from '@/components/AnimatedText'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import ItemKeahlian from '@/components/ItemKeahlian'
import Tilt from 'react-parallax-tilt'
import { useData } from '@/components/DataProvider'

const AnimatedNumbers = ({ value }) => {
  return <span className="inline-block text-5xl sm:text-6xl md:text-7xl font-bold font-display">{value}</span>
}

const Skills = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  return (
    <>
      <h2 className="font-bold font-display text-6xl sm:text-7xl md:text-8xl mt-32 md:mt-64 w-full text-center tracking-tight uppercase">Skills</h2>
      <div className="w-full relative flex flex-col items-center justify-center mt-8 md:mt-16 max-w-2xl mx-auto space-y-4 md:space-y-6 px-4">
        {skills.map(skill => (
          <ItemKeahlian key={skill.id} keahlian={skill} />
        ))}
      </div>
    </>
  )
}

const Details = ({ icon, year, title, company, description, isLeft }) => {
  const ref = useRef(null)
  return (
    <li ref={ref} className={`mb-16 w-full flex justify-center md:justify-between items-center relative`}>
      {/* Spacer for desktop layout */}
      <div className={`hidden md:block w-5/12 ${isLeft ? 'order-1' : 'order-3'}`}></div>
      
      {/* Liquid glowing node - always active and pulsing */}
      <div className="absolute left-[30px] md:left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center z-10 md:order-2">
        <div className="w-4 h-4 rounded-full bg-logo-red shadow-[0_0_20px_rgba(232,69,77,1)] border-2 border-[#0a0a0a] animate-pulse"></div>
        {/* Outer glowing ripple */}
        <div className="absolute w-8 h-8 rounded-full bg-logo-red-light/40 animate-ping"></div>
      </div>
      
      {/* The Card */}
      <div className={`w-full md:w-5/12 z-20 pl-16 md:pl-0 ${isLeft ? 'order-3 md:order-1' : 'order-3'}`}>
        <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={2500}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="p-6 md:p-8 bg-logo-red/5 backdrop-blur-2xl border border-logo-red/20 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-logo-red/10 rounded-full blur-[50px] -z-10" />
            
            <h3 className="capitalize font-bold text-xl sm:text-2xl font-display text-white tracking-tight">
              {title} <span className="text-logo-red capitalize block md:inline mt-1 md:mt-0">@{company}</span>
            </h3>
            <span className="capitalize font-semibold text-zinc-400 text-xs sm:text-sm block mt-2 tracking-wider">
              {year}
            </span>
            <p className="font-medium w-full text-sm sm:text-base mt-4 text-zinc-300 leading-relaxed text-justify">
              {description}
            </p>
          </motion.div>
        </Tilt>
      </div>
    </li>
  )
}

const Experience = ({ experiences }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"]
  })

  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="my-32 md:my-64">
      <h2 className="font-bold font-display text-6xl sm:text-7xl md:text-8xl mb-16 md:mb-32 w-full text-center tracking-tight uppercase">
        Journey
      </h2>

      <div ref={ref} className="w-full max-w-5xl mx-auto relative px-4">
        {/* Background Track */}
        <div className="absolute left-[30px] md:left-1/2 -translate-x-[1px] top-0 w-[2px] h-full bg-white/10 z-0" />
        
        {/* Liquid Fill Timeline Line */}
        <motion.div 
          style={{ scaleY: scrollYProgress }}
          className="absolute left-[30px] md:left-1/2 -translate-x-[1px] top-0 w-[2px] h-full bg-gradient-to-b from-logo-red-light via-logo-red to-logo-red-dark origin-top z-0 shadow-[0_0_15px_rgba(232,69,77,0.8)]" 
        />
        
        <ul className="w-full flex flex-col items-center justify-between">
          {experiences.map((exp, index) => (
            <Details 
              key={exp.id}
              year={exp.year}
              title={exp.title}
              company={exp.company}
              description={exp.description}
              icon={exp.icon}
              isLeft={index % 2 === 0}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

const WebsiteCarousel = ({ daftarWebsite }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!daftarWebsite || daftarWebsite.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % daftarWebsite.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [daftarWebsite]);

  if (!daftarWebsite || daftarWebsite.length === 0) return null;

  return (
    <div className="my-32 max-w-5xl mx-auto px-4">
      <h2 className="font-bold font-display text-5xl sm:text-6xl md:text-8xl mb-12 w-full text-center tracking-tight uppercase text-logo-red-light">
        Websites Built
      </h2>
      
      <div className="w-full max-w-3xl mx-auto rounded-3xl overflow-hidden border border-logo-red/20 bg-logo-red/5 backdrop-blur-2xl shadow-2xl relative h-[250px] sm:h-[350px] md:h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <a href={daftarWebsite[currentIndex].link_web} target="_blank" rel="noopener noreferrer" className="w-full h-full relative group">
              <img 
                src={daftarWebsite[currentIndex].link_preview || 'https://placehold.co/800x400/111/222?text=Website'} 
                alt={daftarWebsite[currentIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent flex flex-col justify-end p-8">
                <span className="text-logo-red font-bold text-xs uppercase tracking-widest mb-2">Visit Website</span>
                <h3 className="text-white font-bold font-display text-2xl sm:text-3xl">{daftarWebsite[currentIndex].title}</h3>
              </div>
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

const AboutContent = () => {
  const { configSitus, skills, experiences, daftarWebsite } = useData()

  return (
    <>
      <TransitionEffect />
      <main className="flex w-full flex-col items-center justify-center text-white min-h-screen">
        <Layout className="pt-32 pb-16">
          <AnimatedText text="ABOUT ME." className="mb-12 md:mb-20 !text-5xl sm:!text-6xl md:!text-7xl lg:!text-8xl font-display uppercase tracking-wider" />
          
          <div className="grid w-full grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
            {/* Biography Panel */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start justify-center order-2 lg:order-1 px-4">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.01} transitionSpeed={2000} className="w-full">
                <div className="w-full p-8 sm:p-10 bg-logo-red/5 backdrop-blur-2xl border border-logo-red/20 rounded-3xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-logo-red/10 rounded-full blur-[60px] pointer-events-none" />
                  
                  <h2 className="mb-6 text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-zinc-500 font-display flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-logo-red"></span> Biography
                  </h2>
                  <p className="font-medium text-zinc-300 text-base sm:text-lg leading-relaxed mb-8 text-justify" style={{ textIndent: '2rem' }}>
                    {configSitus?.homeDescription || "Hai, saya RFX Visual. Saya adalah seorang seniman visual, videografer, dan editor yang fokus pada menciptakan karya digital berkualitas."}
                  </p>
                  
                  {/* Distinct Quote Section */}
                  <div className="pl-6 border-l-4 border-logo-red py-2 relative">
                    <div className="absolute -left-2 top-0 text-4xl text-logo-red/30 font-serif leading-none">"</div>
                    <p className="italic font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 text-lg sm:text-xl">
                      {configSitus?.aboutQuote || "Setiap frame memiliki ceritanya sendiri."}
                    </p>
                  </div>
                </div>
              </Tilt>
            </div>

            {/* Profile Image */}
            <div className="lg:col-span-4 relative h-max rounded-3xl border border-solid border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md p-4 sm:p-6 order-1 lg:order-2 shadow-[0_0_30px_rgba(211,34,42,0.15)] mx-auto w-full max-w-sm lg:max-w-none group">
              <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-logo-red transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1" />
              <img 
                src={configSitus?.aboutImage || "https://placehold.co/400x500/111/222?text=About+Image"} 
                alt="RFX Visual About" 
                className="w-full h-auto rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 border border-white/5 object-cover" 
              />
            </div>

            {/* Stats */}
            <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-center justify-center sm:justify-around lg:justify-between order-3 gap-10 sm:gap-4 lg:gap-0 mt-8 lg:mt-0">
              <div className="flex flex-col items-center lg:items-end justify-center w-full">
                <AnimatedNumbers value={configSitus?.statClients || '40+'} />
                <h2 className="text-sm sm:text-base md:text-lg font-medium capitalize text-zinc-500/75 text-center lg:text-right mt-2">Satisfied Clients</h2>
              </div>
              <div className="flex flex-col items-center lg:items-end justify-center w-full">
                <AnimatedNumbers value={configSitus?.statProjects || '50+'} />
                <h2 className="text-sm sm:text-base md:text-lg font-medium capitalize text-zinc-500/75 text-center lg:text-right mt-2">Projects Completed</h2>
              </div>
              <div className="flex flex-col items-center lg:items-end justify-center w-full">
                <AnimatedNumbers value={configSitus?.statYears || '4+'} />
                <h2 className="text-sm sm:text-base md:text-lg font-medium capitalize text-zinc-500/75 text-center lg:text-right mt-2">Years of Experience</h2>
              </div>
            </div>
          </div>

          <Skills skills={skills} />
          <Experience experiences={experiences} />
          <WebsiteCarousel daftarWebsite={daftarWebsite} />
        </Layout>
      </main>
    </>
  )
}

export default AboutContent;
