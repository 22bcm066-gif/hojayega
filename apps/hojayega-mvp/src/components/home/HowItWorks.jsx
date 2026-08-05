import React from 'react'
import { motion } from 'framer-motion'
import { ClipboardEdit, Users, Wallet } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'

const STEPS = [
  {
    icon: ClipboardEdit,
    step: '01',
    title: 'Post your task',
    description: 'Describe what you need done, set your budget and deadline. Takes less than a minute.',
  },
  {
    icon: Users,
    step: '02',
    title: 'Someone nearby accepts it',
    description: 'A helper close to you picks it up and shares their contact details with you instantly.',
  },
  {
    icon: Wallet,
    step: '03',
    title: 'Pay directly after completion',
    description: 'Once the task is done to your satisfaction, pay the helper directly via UPI. No middleman.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps. That's it."
          description="No complicated onboarding, no long forms. Just get things done."
        />

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent md:block" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -8 }}
              className="card relative flex flex-col items-start p-8 text-left"
            >
              <span className="absolute right-6 top-6 font-display text-4xl font-extrabold text-brand-50">
                {s.step}
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                <s.icon size={26} strokeWidth={2} />
              </span>
              <h3 className="mt-6 text-xl font-bold text-neutral-900">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
