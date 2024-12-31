
'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function ShimmerEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
          initial={{ x: '-100%' }}
          animate={{
            x: '100%',
            transition: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 3,
              ease: 'linear',
              delay: index * 0.5,
            },
          }}
        />
      ))}
    </div>
  )
}

