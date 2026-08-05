import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900 px-8 py-16 text-center sm:px-16 sm:py-20"
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
            Got something that needs doing?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-neutral-300">
            Post it in under a minute — whatever it is, someone nearby is ready to help.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link to="/post-task" className="btn-primary px-7 py-4 text-[15px]">
              Post a Task
              <ArrowRight size={17} />
            </Link>
            <Link to="/browse-tasks" className="btn bg-white/10 px-7 py-4 text-[15px] text-white hover:bg-white/20">
              Browse Tasks
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
