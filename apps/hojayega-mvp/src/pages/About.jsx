import React from 'react'
import { motion } from 'framer-motion'
import { Target, HeartHandshake, Compass, ClipboardEdit, Users, Wallet } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition.jsx'
import CtaBanner from '../components/home/CtaBanner.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
}

const VALUES = [
  {
    icon: Target,
    title: 'What HoJayega is',
    text:
      'HoJayega is a local task marketplace. Anyone can post a real-world task they need done — a delivery, a queue to be held, groceries to be picked up, furniture to be assembled — and people nearby can browse and accept it. No agencies, no long onboarding, just people helping people.',
  },
  {
    icon: Compass,
    title: 'How it works',
    text:
      'A task is posted with a clear budget and deadline. A helper nearby accepts it and gets the poster’s contact details instantly. Once the work is done, the customer pays the helper directly — there’s no payment gateway sitting in between, and no platform fee eating into either side.',
  },
  {
    icon: HeartHandshake,
    title: 'Why it exists',
    text:
      'Everyday life is full of small tasks that take disproportionate time — standing in a queue, running an errand across town, waiting for a delivery. HoJayega exists so that time can be handed off to someone nearby who has a little to spare, for a fair price both sides agree on.',
  },
]

const STEPS = [
  { icon: ClipboardEdit, label: 'Post a task with a budget and deadline' },
  { icon: Users, label: 'A helper nearby accepts and reaches out' },
  { icon: Wallet, label: 'Pay directly once it’s done — no middleman' },
]

export default function About() {
  useDocumentTitle('About')

  return (
    <PageTransition>
      <section className="bg-brand-radial pb-20 pt-16 sm:pt-24">
        <div className="container-page">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="mx-auto max-w-2xl text-center">
            <span className="badge mb-4 bg-brand-50 text-brand-600">About HoJayega</span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Everyday tasks, handled by people nearby
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-500">
              HoJayega was built on a simple idea — the person who can do a task fastest is often just a
              few streets away.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-[2.5rem] bg-neutral-900 px-8 py-14 text-center sm:px-16"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-brand-400/20 blur-3xl" />
            <p className="relative text-sm font-semibold uppercase tracking-widest text-brand-400">Our mission</p>
            <p className="relative mt-4 font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
              &ldquo;Helping people get everyday work done quickly by connecting them with nearby
              helpers.&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -6 }}
                className="card p-8"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                  <v.icon size={24} />
                </span>
                <h2 className="mt-6 text-xl font-bold text-neutral-900">{v.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">{v.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="card mt-8 flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between"
          >
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex flex-1 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon size={19} />
                </span>
                <p className="text-sm font-semibold text-neutral-700">{s.label}</p>
                {i < STEPS.length - 1 && <span className="hidden text-neutral-300 sm:block">→</span>}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <CtaBanner />
    </PageTransition>
  )
}
