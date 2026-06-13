import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 font-medium py-6 px-4 sm:px-6 md:px-12 flex items-center justify-between text-zinc-400 z-10 relative bg-[#050505]">
      <div className="flex w-full items-center justify-between flex-col md:flex-row gap-2 md:gap-0 text-center md:text-left">
        <span className="text-xs sm:text-sm">{new Date().getFullYear()} &copy; All Rights Reserved.</span>
        <div className="flex items-center text-xs sm:text-sm">
          by&nbsp;<span className="underline underline-offset-2 text-white font-display uppercase tracking-widest font-bold">RFX Visual</span>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <a href="https://instagram.com/rfx.visual" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-[#E1306C] transition-colors">Instagram</a>
          <a href="https://youtube.com/@rfxvisual" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-logo-red transition-colors">YouTube</a>
          <a href="https://www.linkedin.com/in/muhammad-ridho-febriyansyah-693b083a5" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-[#0A66C2] transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
