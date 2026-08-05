import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'
import { CATEGORIES } from '../../data/categories.js'

export default function CategoriesGrid() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Popular categories"
          title="Whatever the task, there's a category for it"
          description="From a five-minute errand to a full afternoon of help — browse by what you need."
        />

        <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                to={`/browse-tasks?category=${encodeURIComponent(cat.name)}`}
                className="card group flex h-full flex-col items-start gap-4 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  style={{ backgroundColor: `${cat.color}14`, color: cat.color }}
                >
                  <cat.icon size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-neutral-900">{cat.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-400 line-clamp-2">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link
              to="/browse-tasks"
              className="group flex h-full flex-col items-start justify-between gap-4 rounded-3xl bg-brand-gradient p-6 text-white shadow-glow transition-all duration-300 hover:-translate-y-1.5"
            >
              <div>
                <h3 className="font-bold">See all tasks</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/80">Browse every open task on HoJayega right now.</p>
              </div>
              <span className="text-sm font-semibold transition-transform group-hover:translate-x-1">Browse →</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
