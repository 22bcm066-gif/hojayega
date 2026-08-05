import React from 'react'
import { motion } from 'framer-motion'
import { MapPinned, Zap, Wallet2, ShieldCheck, PhoneCall, Users2 } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'

const FEATURES = [
  { icon: MapPinned, title: 'Local Tasks', description: 'Only see tasks and helpers actually near you — no irrelevant noise.' },
  { icon: Zap, title: 'Fast Matching', description: 'Most tasks find a helper within minutes of being posted.' },
  { icon: Wallet2, title: 'Set Your Own Budget', description: 'You decide what the task is worth — full control, every time.' },
  { icon: ShieldCheck, title: 'No Hidden Charges', description: 'What you offer is what the helper gets. No platform cuts.' },
  { icon: PhoneCall, title: 'Direct Contact', description: 'Talk directly to your helper — no chat layers, no delays.' },
  { icon: Users2, title: 'Community Powered', description: 'Built by and for people who just want things done, together.' },
]

export default function Features() {
  return (
    <section className="section bg-brand-radial">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why HoJayega"
          title="Everything you need, nothing you don't"
          description="A simple, honest way to get everyday work done — and to earn by helping others."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="card group flex items-start gap-4 p-6"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-gradient group-hover:text-white">
                <f.icon size={22} />
              </span>
              <div>
                <h3 className="text-[17px] font-bold text-neutral-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
