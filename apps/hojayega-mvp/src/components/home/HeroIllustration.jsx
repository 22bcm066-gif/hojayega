import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, MapPin, Star, Zap } from 'lucide-react'

export default function HeroIllustration() {
  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-lg items-center justify-center sm:h-[480px]">
      {/* Ambient blobs */}
      <div className="absolute -left-10 top-4 h-56 w-56 animate-blob rounded-full bg-brand-100/70 blur-3xl" />
      <div className="absolute -right-6 bottom-6 h-64 w-64 animate-blob rounded-full bg-brand-200/50 blur-3xl [animation-delay:2s]" />

      {/* Main illustration card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 h-[340px] w-[300px] rounded-[2.5rem] bg-brand-gradient p-1.5 shadow-glow sm:h-[400px] sm:w-[340px]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-gradient-to-b from-white to-brand-50">
          <svg viewBox="0 0 300 400" className="absolute inset-0 h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* road */}
            <path d="M0 330 Q150 300 300 330 L300 400 L0 400 Z" fill="#FFE4D0" />
            <path d="M0 330 Q150 300 300 330" stroke="#FF6B00" strokeWidth="3" strokeDasharray="10 10" opacity="0.4" />
            {/* buildings */}
            <rect x="18" y="230" width="46" height="110" rx="8" fill="#FFDCC0" />
            <rect x="70" y="200" width="40" height="140" rx="8" fill="#FFC79E" />
            <rect x="230" y="215" width="52" height="125" rx="8" fill="#FFDCC0" />
            {/* scooter body */}
            <g transform="translate(95,225)">
              <ellipse cx="55" cy="118" rx="70" ry="10" fill="#FF6B00" opacity="0.12" />
              <circle cx="20" cy="112" r="16" fill="#2B2320" />
              <circle cx="20" cy="112" r="7" fill="#FFF8F3" />
              <circle cx="92" cy="112" r="16" fill="#2B2320" />
              <circle cx="92" cy="112" r="7" fill="#FFF8F3" />
              <path d="M20 112 L50 60 L95 60 L92 112" stroke="#FF6B00" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="40" y="35" width="34" height="30" rx="8" fill="#FF8C42" />
              <path d="M50 60 L38 30" stroke="#FF6B00" strokeWidth="7" strokeLinecap="round" />
              <circle cx="36" cy="24" r="12" fill="#2B2320" />
              <rect x="66" y="70" width="26" height="24" rx="6" fill="#FFFFFF" stroke="#FF6B00" strokeWidth="3" />
            </g>
          </svg>

          {/* Floating status chip */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="glass absolute left-5 top-8 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-soft"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={16} />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-neutral-800">Task Accepted</p>
              <p className="text-[10px] text-neutral-500">by Rahul, 1.2 km away</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="glass absolute right-4 top-32 flex items-center gap-2 rounded-2xl px-3 py-2 shadow-soft"
          >
            <MapPin size={14} className="text-brand-500" />
            <p className="text-[11px] font-semibold text-neutral-700">Andheri → Bandra</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="glass absolute bottom-10 left-8 flex items-center gap-1.5 rounded-2xl px-3 py-2 shadow-soft"
          >
            <Star size={13} className="fill-brand-400 text-brand-400" />
            <Star size={13} className="fill-brand-400 text-brand-400" />
            <Star size={13} className="fill-brand-400 text-brand-400" />
            <Star size={13} className="fill-brand-400 text-brand-400" />
            <Star size={13} className="fill-brand-400 text-brand-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Floating budget card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute -right-2 top-6 z-20 hidden w-40 rounded-2xl bg-white p-4 shadow-card sm:block"
      >
        <p className="text-xs text-neutral-400">Task Budget</p>
        <p className="mt-1 text-2xl font-bold text-brand-600">₹350</p>
        <p className="mt-1 text-[11px] text-neutral-400">Deliver medicines</p>
      </motion.div>

      {/* Floating quick badge */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="absolute -left-4 bottom-2 z-20 flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-white shadow-card sm:-left-8"
      >
        <Zap size={16} className="text-brand-400" />
        <div>
          <p className="text-xs font-semibold leading-none">Matched in 4 mins</p>
          <p className="mt-1 text-[10px] text-neutral-400">Average across Mumbai</p>
        </div>
      </motion.div>
    </div>
  )
}
