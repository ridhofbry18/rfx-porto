'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, Youtube, Mail, Menu, X, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/', key: 'beranda', title: 'Beranda' },
  { href: '/about', key: 'about', title: 'About' },
  { href: '/portofolio', key: 'portofolio', title: 'Karya' },
  { href: '/artikel', key: 'artikel', title: 'Artikel' },
  { href: '/kontak', key: 'kontak', title: 'Kontak' },
]

const CustomLink = ({ href, title, isActive, className = "" }) => {
  return (
    <Link href={href} className={`${className} relative group text-white uppercase font-bold tracking-widest text-xs hover:text-logo-red transition-colors`}>
      {title}
      <span className={`h-[2px] inline-block bg-logo-red absolute left-0 -bottom-1 group-hover:w-full transition-[width] ease duration-300 ${isActive ? 'w-full' : 'w-0'}`}>
        &nbsp;
      </span>
    </Link>
  )
}

const CustomMobileLink = ({ href, title, isActive, className = "", toggle }) => {
  return (
    <Link href={href} onClick={toggle} className={`${className} relative group text-white font-bold uppercase tracking-widest text-2xl my-4 hover:text-logo-red transition-colors`}>
      {title}
      <span className={`h-[2px] inline-block bg-logo-red absolute left-0 -bottom-1 group-hover:w-full transition-[width] ease duration-300 ${isActive ? 'w-full' : 'w-0'}`}>
        &nbsp;
      </span>
    </Link>
  )
}

const Navigasi = ({ configSitus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const getActiveKey = () => {
    if (pathname === '/') return 'beranda'
    const segment = pathname.split('/')[1]
    return segment || 'beranda'
  }

  const halamanAktif = getActiveKey()

  const handleClick = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 sm:pt-6 pointer-events-none flex justify-center">
      <header className={`relative pointer-events-auto w-full max-w-5xl px-6 py-3 lg:px-8 lg:py-4 font-medium flex items-center justify-between transition-all duration-500 rounded-full ${scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(211,34,42,0.15)]' : 'bg-[#0a0a0a]/40 backdrop-blur-lg border border-white/5 shadow-xl'}`}>
      
        {/* Logo and Hamburger Container (Universal) */}
        <div className="w-full flex justify-between items-center relative">
          {/* Logo */}
          <Link href="/" className="w-24 sm:w-28 lg:w-32 hover:scale-105 transition-transform duration-300 flex items-center relative z-10">
             <img src="/logo.png" alt="RFX Visual" className="w-full h-auto object-contain drop-shadow-[0_0_10px_rgba(211,34,42,0.5)]" />
          </Link>

          {/* Desktop Socials (Hidden on Mobile) - Perfectly Centered */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.a href="https://instagram.com/rfx.visual" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-5 text-zinc-400 hover:text-[#E1306C]">
              <Instagram />
            </motion.a>
            <motion.a href="https://youtube.com/@rfxvisual" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-5 text-zinc-400 hover:text-logo-red">
              <Youtube />
            </motion.a>
            <motion.a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-5 text-zinc-400 hover:text-[#0A66C2]">
              <Linkedin />
            </motion.a>
            <motion.a href={`mailto:${configSitus?.email || 'email@rfxvisual.my.id'}`} target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-5 text-zinc-400 hover:text-blue-500">
              <Mail />
            </motion.a>
          </nav>

          {/* Hamburger Button */}
          <button className="flex-col justify-center items-center flex text-white bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md hover:bg-logo-red/20 hover:border-logo-red/50 transition-colors relative z-10" onClick={handleClick}>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </button>
        </div>

        {/* Universal Menu Overlay */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[120%] left-0 right-0 flex flex-col justify-between z-[150] items-center bg-[#0a0a0a]/90 text-white rounded-3xl backdrop-blur-3xl py-12 border border-white/10 shadow-2xl"
          >
            <nav className="flex items-center flex-col justify-center gap-2">
              {navLinks.map(link => (
                <CustomMobileLink
                  key={link.key}
                  href={link.href}
                  title={link.title}
                  isActive={halamanAktif === link.key}
                  toggle={handleClick}
                />
              ))}
            </nav>

            <nav className="flex items-center justify-center flex-wrap gap-8 mt-10 md:hidden">
              <motion.a href="https://instagram.com/rfx.visual" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-6 text-zinc-400 hover:text-[#E1306C]">
                <Instagram className="w-full h-full" />
              </motion.a>
              <motion.a href="https://youtube.com/@rfxvisual" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-6 text-zinc-400 hover:text-logo-red">
                <Youtube className="w-full h-full" />
              </motion.a>
              <motion.a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-6 text-zinc-400 hover:text-[#0A66C2]">
                <Linkedin className="w-full h-full" />
              </motion.a>
              <motion.a href={`mailto:${configSitus?.email || 'email@rfxvisual.my.id'}`} target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-6 text-zinc-400 hover:text-blue-500">
                <Mail className="w-full h-full" />
              </motion.a>
            </nav>
          </motion.div>
        )}
      </header>
    </div>
  )
}

export default Navigasi;
