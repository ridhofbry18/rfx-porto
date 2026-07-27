import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, MessageSquare, ArrowUp, Instagram, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react'

// Complex Solid Fire Waves
const solidFlame1 = "M0,400 L0,150 Q 50,200 80,100 Q 120,250 150,200 Q 200,300 220,150 Q 270,300 300,250 Q 350,350 400,200 Q 450,320 550,300 L 1050,300 Q 1150,320 1200,200 Q 1250,350 1300,250 Q 1330,300 1380,150 Q 1400,300 1450,200 Q 1480,250 1520,100 Q 1550,200 1600,150 L1600,400 Z";
const solidFlame2 = "M0,400 L0,140 Q 60,210 90,110 Q 110,240 160,190 Q 210,310 230,160 Q 260,290 310,260 Q 340,360 410,210 Q 460,330 550,300 L 1050,300 Q 1140,330 1190,210 Q 1260,360 1310,260 Q 1320,310 1390,160 Q 1390,290 1460,210 Q 1470,240 1530,110 Q 1540,210 1600,140 L1600,400 Z";

// Mascot Head Outline Paths
const mascotPath1 = "M 600,300 Q 620,220 650,240 Q 670,140 700,180 Q 720,80 770,120 Q 800,20 850,90 Q 880,50 920,120 Q 960,110 950,180 Q 1000,180 970,240 Q 1000,280 980,300";
const mascotPath2 = "M 600,300 Q 610,210 660,250 Q 660,130 710,190 Q 730,70 780,130 Q 790,30 860,100 Q 890,60 910,130 Q 970,100 940,190 Q 1010,170 960,250 Q 990,290 980,300";

const MascotFireEdge = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-[250px] sm:h-[350px] pointer-events-none z-30 -translate-y-[99%]">
      <svg viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 left-0 w-full h-full">
        {/* Solid background fire */}
        <motion.path
          animate={{ d: [solidFlame1, solidFlame2, solidFlame1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          fill="#943838"
        />

        {/* Mascot Outline */}
        <motion.path
          animate={{ d: [mascotPath1, mascotPath2, mascotPath1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          stroke="#943838" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Left Eye */}
        <motion.path
          d="M 700,240 Q 725,220 750,240"
          stroke="#943838" strokeWidth="10" fill="none" strokeLinecap="round"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.95, 0.98, 1] }}
          style={{ originY: "240px" }}
        />
        {/* Right Eye */}
        <motion.path
          d="M 830,240 Q 855,220 880,240"
          stroke="#943838" strokeWidth="10" fill="none" strokeLinecap="round"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.95, 0.98, 1], delay: 0.1 }}
          style={{ originY: "240px" }}
        />

        {/* Exclamation Mark */}
        <motion.g
          animate={{ rotate: [-10, 10, -10], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ originX: "870px", originY: "180px" }}
        >
          <path d="M 870,50 L 900,40 L 880,140 L 860,130 Z" stroke="#943838" strokeWidth="10" fill="#111111" strokeLinejoin="round" />
          <circle cx="875" cy="170" r="12" stroke="#943838" strokeWidth="10" fill="#111111" />
        </motion.g>

        {/* Teeth */}
        <motion.path
          d="M 760,300 L 780,300 L 780,330 C 780,340 760,340 760,330 Z"
          fill="#111111"
          animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.path
          d="M 795,300 L 815,300 L 815,330 C 815,340 795,340 795,330 Z"
          fill="#111111"
          animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
        />

        {/* Left Paw */}
        <motion.path
          d="M 640,290 L 690,305 L 680,335 L 630,320 Z"
          fill="#111111"
          animate={{ rotate: [0, -10, 0] }} style={{ originX: '665px', originY: '310px' }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        {/* Right Paw */}
        <motion.path
          d="M 940,305 L 990,290 L 1000,320 L 950,335 Z"
          fill="#111111"
          animate={{ rotate: [0, 10, 0] }} style={{ originX: '965px', originY: '310px' }}
          transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
        />
      </svg>
    </div>
  )
}

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portofolio', label: 'Projects' },
  { href: '/kontak', label: 'Contact' },
]

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-40 w-full bg-[#943838] flex flex-col items-center pt-16 sm:pt-24 pb-8 px-4 md:px-8 mt-[250px] sm:mt-[350px]">

      {/* Full Width Rigged Mascot Fire Edge */}
      <MascotFireEdge />

      {/* Background Typography */}
      <div className="absolute top-10 sm:top-20 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none select-none z-0">
        <h1 className="text-[35vw] sm:text-[30vw] font-display font-black tracking-tighter text-[#111111] leading-none whitespace-nowrap">
          RFX VISUAL
        </h1>
      </div>

      {/* 3D Floating Object */}
      <div className="absolute top-10 sm:top-20 left-1/2 -translate-x-1/2 z-10 w-[95%] sm:w-[90%] max-w-[700px] pointer-events-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex justify-center">
        <img
          src="/hero_3d_character.png"
          alt="3D Object"
          className="w-[80%] h-auto object-contain opacity-90 mix-blend-luminosity brightness-75 contrast-125"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
        />
      </div>

      {/* Central Card */}
      <div className="relative z-20 w-full max-w-[850px] bg-[#111111] rounded-[2rem] sm:rounded-[3rem] px-6 py-12 sm:p-24 flex flex-col items-center text-center shadow-2xl border-4 border-[#111111] mt-32 sm:mt-48 transition-transform hover:-translate-y-2">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
          <span className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#943838] text-[#111111] text-2xl sm:text-3xl font-black shrink-0">©</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-[#943838] tracking-tight">RFX VISUAL</h2>
        </div>
        <p className="text-[#943838] text-lg sm:text-2xl font-medium tracking-wide uppercase">Malang Visual Artist</p>

        {/* Social Icons */}
        <div className="flex items-center gap-3 sm:gap-4 mt-8 sm:mt-12">
          <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#943838] text-[#111111] flex items-center justify-center hover:bg-white transition-colors">
            <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" rel="noreferrer" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#943838] text-[#111111] flex items-center justify-center hover:bg-white transition-colors">
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="https://instagram.com/rfx.visual" target="_blank" rel="noreferrer" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#943838] text-[#111111] flex items-center justify-center hover:bg-white transition-colors">
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#943838] text-[#111111] flex items-center justify-center hover:bg-white transition-colors">
            <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>

      {/* Bottom Navigation Dock */}
      <div className="relative z-20 w-full max-w-[850px] bg-[#111111] rounded-[2rem] lg:rounded-full p-4 lg:p-5 mt-4 flex flex-col lg:flex-row items-center justify-between shadow-2xl border-4 border-[#111111] gap-4 lg:gap-0">

        {/* Nav Links */}
        <div className="flex items-center gap-1 md:gap-2 flex-wrap lg:flex-nowrap justify-center lg:justify-start">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 lg:px-5 py-2 lg:py-2.5 rounded-full hover:bg-[#943838] text-[#943838] hover:text-[#111111] font-display text-xs md:text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap"
            >
              {link.label}
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 opacity-50" />
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <a
            href="mailto:contact@rfxvisual.com"
            className="flex items-center gap-2 px-5 md:px-6 lg:px-7 py-2.5 lg:py-3 rounded-full bg-[#943838] text-[#111111] font-display text-xs md:text-sm font-black uppercase tracking-wider hover:bg-white transition-colors whitespace-nowrap"
          >
            Email Me <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
          </a>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 md:px-5 py-2.5 lg:py-3 rounded-full border-2 border-[#943838] text-[#943838] font-display text-xs md:text-sm font-black uppercase tracking-wider hover:bg-[#943838] hover:text-[#111111] transition-colors group whitespace-nowrap"
          >
            Go Up <ArrowUp className="w-3 h-3 md:w-4 md:h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

    </footer>
  )
}

export default Footer
