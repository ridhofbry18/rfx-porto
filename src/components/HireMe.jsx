import React from 'react'

const CircularText = ({ className = "" }) => {
  return (
    <svg className={className} viewBox="0 0 200 200">
      <path
        id="circlePath"
        d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
        fill="transparent"
      />
      <text fill="currentColor" className="text-[25px] font-bold uppercase tracking-widest">
        <textPath href="#circlePath" startOffset="0%">
          Visual Artist • Videographer • Editor •
        </textPath>
      </text>
    </svg>
  )
}

const HireMe = () => {
  return (
    <div className="fixed left-4 bottom-4 md:left-auto md:right-8 md:bottom-8 flex items-center justify-center overflow-hidden z-40">
      <div className="w-24 md:w-36 h-auto flex items-center justify-center relative">
        <CircularText className="fill-white animate-spin-slow opacity-80 hover:opacity-100 transition-opacity" />
        <a 
          href={`https://wa.me/6285731021469`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-logo-red text-white shadow-[0_0_15px_rgba(211,34,42,0.6)] border-2 border-solid border-transparent w-12 h-12 md:w-16 md:h-16 rounded-full font-bold text-[8px] md:text-xs hover:bg-white hover:text-logo-red transition-colors uppercase tracking-widest"
        >
          Hire Me
        </a>
      </div>
    </div>
  )
}

export default HireMe;
