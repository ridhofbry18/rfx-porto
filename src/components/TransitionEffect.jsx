'use client'

import React from 'react'
import { motion } from 'framer-motion'

const TransitionEffect = () => {
  return (
    <>
      <motion.div 
        className="fixed inset-0 z-[200] bg-black/40 pointer-events-none"
        initial={{ opacity: 1, backdropFilter: "blur(40px)" }}
        animate={{ opacity: 0, backdropFilter: "blur(0px)" }}
        exit={{ opacity: 1, backdropFilter: "blur(40px)" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} // smooth ease out
      />
    </>
  )
}

export default TransitionEffect;
