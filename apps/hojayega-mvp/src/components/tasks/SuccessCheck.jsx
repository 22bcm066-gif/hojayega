import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function SuccessCheck({ size = 96 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#DCFCE7"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#22C55E"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      </motion.svg>
      <motion.div
        className="absolute inset-0 grid place-items-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 18 }}
      >
        <span className="grid place-items-center rounded-full bg-green-500 p-3.5 text-white">
          <Check size={size * 0.32} strokeWidth={3} />
        </span>
      </motion.div>
    </div>
  )
}
