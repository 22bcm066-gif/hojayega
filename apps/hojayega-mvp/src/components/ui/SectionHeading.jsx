import React from 'react'
import { motion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, description, align = 'center', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`${align === 'center' ? 'mx-auto text-center' : 'text-left'} max-w-2xl ${className}`}
    >
      {eyebrow && (
        <span className="badge mb-4 bg-brand-50 text-brand-600">{eyebrow}</span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-neutral-500">{description}</p>}
    </motion.div>
  )
}
