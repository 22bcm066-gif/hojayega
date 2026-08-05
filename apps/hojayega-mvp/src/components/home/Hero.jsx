import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import HeroIllustration from './HeroIllustration.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] },
  }),
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-radial">
      <div className="container-page grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="badge border border-brand-200 bg-white/80 text-brand-600 shadow-sm">
              <Sparkles size={13} />
              Mumbai&apos;s local task marketplace
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.4rem]"
          >
            Whatever it is.
            <br />
            <span className="text-gradient">Ho Jayega.</span>
          </motion.h1>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-xl space-y-1.5 text-lg leading-relaxed text-neutral-500"
          >
            <p>Need someone to deliver something? Wait in a queue? Pick up groceries?</p>
            <p>Assemble furniture? Run an errand? Post your task in under a minute —</p>
            <p className="font-semibold text-neutral-700">someone nearby will get it done.</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row"
          >
            <Link to="/post-task" className="btn-primary px-7 py-4 text-[15px]">
              Post a Task
              <ArrowRight size={17} />
            </Link>
            <Link to="/browse-tasks" className="btn-secondary px-7 py-4 text-[15px]">
              <Search size={17} />
              Browse Tasks
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-neutral-500"
          >
            <div>
              <span className="text-xl font-bold text-neutral-900">1,200+</span> tasks completed
            </div>
            <div className="h-4 w-px bg-neutral-200" />
            <div>
              <span className="text-xl font-bold text-neutral-900">4.8/5</span> average rating
            </div>
            <div className="h-4 w-px bg-neutral-200" />
            <div>
              <span className="text-xl font-bold text-neutral-900">0%</span> platform fee
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  )
}
