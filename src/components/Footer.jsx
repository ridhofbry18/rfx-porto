import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portofolio', label: 'Projects' },
  { href: '/kontak', label: 'Contact' },
]

const Footer = () => {
  return (
    <footer className="relative z-10 w-full overflow-hidden border-t border-white/15 bg-black text-white">
      <div className="h-14 border-b border-white/10 [background:repeating-linear-gradient(90deg,#fff_0_26px,#000_26px_52px)] sm:h-16" />
      <div className="relative px-4 py-14 text-center sm:px-8 lg:px-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 opacity-50 [background:repeating-linear-gradient(90deg,rgba(255,255,255,.62)_0_1px,transparent_1px_14px)]" />
        <p className="font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">Ready to work?</p>
        <h2 className="mx-auto mt-4 max-w-7xl font-display text-[5rem] font-black uppercase leading-[0.78] tracking-[-0.08em] text-[#F6D232] sm:text-[9rem] md:text-[13rem] lg:text-[18rem]">
          Contact Me
        </h2>
        <a
          href="mailto:email@rfxvisual.my.id"
          className="group relative z-10 -mt-4 inline-flex items-center rounded-full border border-white/40 bg-black/90 py-3 pl-7 pr-4 text-3xl uppercase tracking-tight text-white shadow-[0_0_0_8px_rgba(255,255,255,0.04)] transition hover:border-[#F6D232] sm:-mt-10 sm:text-6xl"
        >
          Contact
          <span className="ml-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F6D232] text-black transition group-hover:translate-x-1 sm:h-20 sm:w-20">
            <ArrowRight className="h-9 w-9 sm:h-12 sm:w-12" />
          </span>
        </a>
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-white sm:gap-6 sm:text-sm">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              <Link href={link.href} className="transition hover:text-[#F6D232]">{link.label}</Link>
              {index < footerLinks.length - 1 && <span className="text-[#F6D232]">✦</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>
      <div className="grid border-y border-white/20 md:grid-cols-2">
        <p className="border-b border-white/20 px-6 py-8 text-lg uppercase tracking-wide text-zinc-200 md:border-b-0 md:border-r md:px-12">
          Got some exciting ideas? Let's connect and create something extraordinary together!
        </p>
        <div className="flex items-center overflow-hidden px-6 py-8 text-4xl font-light tracking-tight text-white md:px-12 lg:text-6xl">
          <span className="whitespace-nowrap">rfxvisual.my.id&nbsp;</span><span className="mx-5 text-[#F6D232]">✦</span><span className="whitespace-nowrap">email@rfxvisual.my.id</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 sm:px-10 md:flex-row">
        <Link href="/" className="w-28">
          <img src="/logo.png" alt="RFX Visual" className="h-auto w-full object-contain" />
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="https://behance.net/rfxvisual" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/60 px-4 py-1 text-sm uppercase tracking-widest transition hover:border-[#F6D232] hover:text-[#F6D232]">Behance</a>
          <a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/60 px-4 py-1 text-sm uppercase tracking-widest transition hover:border-[#F6D232] hover:text-[#F6D232]">LinkedIn</a>
          <a href="https://instagram.com/rfx.visual" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/60 px-4 py-1 text-sm uppercase tracking-widest transition hover:border-[#F6D232] hover:text-[#F6D232]">Instagram</a>
          <a href="https://x.com/rfxvisual" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/60 px-4 py-1 text-sm uppercase tracking-widest transition hover:border-[#F6D232] hover:text-[#F6D232]">X</a>
        </div>
        <div className="text-sm text-zinc-300">Crafted by <span className="font-display font-black uppercase tracking-widest text-[#F6D232]">RIDHO FEBRIYANSYAH</span></div>
      </div>
    </footer>
  )
}

export default Footer
