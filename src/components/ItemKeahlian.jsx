'use client'

import React, { useState, useEffect } from 'react'

const ItemKeahlian = ({ keahlian }) => {
  const [ref, setRef] = useState(null);
  const [terlihat, setTerlihat] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTerlihat(true);
      }
    }, { threshold: 0.1 });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <div ref={setRef} className="space-y-3 group relative z-10 w-full">
      <div className="flex justify-between items-end">
        <span className="text-xl font-black tracking-tighter uppercase group-hover:text-red-500 transition-colors duration-500 italic">
          {keahlian.title}
        </span>
        <span className="text-xs font-mono text-zinc-500">
          {terlihat ? keahlian.level : 0}%
        </span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px_#dc2626]" 
          style={{ width: terlihat ? `${keahlian.level}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export default ItemKeahlian;
