'use client'

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      
      {/* Subtle Animated Grid */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />

      {/* Floating Red Blobs - Organic Movement */}
      <motion.div
        animate={{
          x: [0, 200, -150, 50, 0],
          y: [0, -150, 100, -50, 0],
          scale: [1, 1.3, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[10%] left-[5%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-logo-red/20 rounded-full blur-[120px] opacity-30 mix-blend-screen"
      />

      <motion.div
        animate={{
          x: [0, -250, 150, -100, 0],
          y: [0, 200, -100, 150, 0],
          scale: [1, 0.8, 1.4, 0.9, 1],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[5%] right-[5%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-logo-red/15 rounded-full blur-[140px] opacity-25 mix-blend-screen"
      />

      <motion.div
        animate={{
          x: [0, 100, -200, 150, 0],
          y: [0, 100, 200, -100, 0],
          scale: [1, 1.2, 0.8, 1.3, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[40%] left-[40%] w-[35vw] h-[35vw] max-w-[600px] max-h-[600px] bg-logo-red/10 rounded-full blur-[100px] opacity-20 mix-blend-screen"
      />

      {/* Static Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
