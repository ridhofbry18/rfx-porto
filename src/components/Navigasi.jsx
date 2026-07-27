'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, Youtube, Mail, Linkedin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/portofolio', key: 'portofolio', title: 'WORK' },
  { href: '/about', key: 'about', title: 'SERVICES' },
  { href: '/artikel', key: 'artikel', title: 'ARTICLES' },
  { href: '/kontak', key: 'kontak', title: 'CONTACT' },
]

const CustomLink = ({ href, title, isActive, className = "" }) => {
  return (
    <Link href={href} className={`${className} relative group text-white uppercase font-display font-bold tracking-widest text-sm hover:text-white/80 transition-colors`}>
      {title}
      <span className={`h-[2px] inline-block bg-white absolute left-0 -bottom-1 group-hover:w-full transition-[width] ease duration-300 ${isActive ? 'w-full' : 'w-0'}`}>
        &nbsp;
      </span>
    </Link>
  )
}

const CustomMobileLink = ({ href, title, isActive, className = "", toggle }) => {
  return (
    <Link href={href} onClick={toggle} className={`${className} relative group text-white font-display font-bold uppercase tracking-widest text-3xl my-4 hover:text-white/80 transition-colors`}>
      {title}
      <span className={`h-[3px] inline-block bg-white absolute left-0 -bottom-1 group-hover:w-full transition-[width] ease duration-300 ${isActive ? 'w-full' : 'w-0'}`}>
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

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center w-full">
      <header className={`relative pointer-events-auto w-full px-6 lg:px-12 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg py-4 lg:py-6' : 'bg-transparent pt-10 pb-5 lg:pt-14 lg:pb-6'}`}>
      
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <Link href="/" className="hover:scale-105 transition-transform duration-300 relative z-[100] w-24 sm:w-32 flex items-center">
             <img src="/logo.png" alt="RFX Visual" className="w-full h-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 relative z-[100]">
            {navLinks.map(link => (
              <CustomLink
                key={link.key}
                href={link.href}
                title={link.title}
                isActive={halamanAktif === link.key}
              />
            ))}
          </nav>

          {/* Hamburger Button (Mobile Only) */}
          <button className="md:hidden flex-col justify-center items-center flex text-white relative z-[100]" onClick={handleClick}>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1.5'}`}></span>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1.5'}`}></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-0 h-screen w-full flex flex-col justify-center z-[90] items-center bg-[#943838] text-white p-12"
            >
              <nav className="flex items-center flex-col justify-center gap-6">
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

              <nav className="flex items-center justify-center flex-wrap gap-8 mt-16">
                <motion.a href="https://instagram.com/rfx.visual" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-8 text-white/70 hover:text-white">
                  <Instagram className="w-full h-full" />
                </motion.a>
                <motion.a href="https://youtube.com/@rfxvisual" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-8 text-white/70 hover:text-white">
                  <Youtube className="w-full h-full" />
                </motion.a>
                <motion.a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" whileHover={{y: -3}} whileTap={{scale: 0.9}} className="w-8 text-white/70 hover:text-white">
                  <Linkedin className="w-full h-full" />
                </motion.a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}

export default Navigasi;
