import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Search, Compass } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <PageTransition>
      <section className="flex min-h-[75vh] items-center bg-brand-radial">
        <div className="container-page text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-md"
          >
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-brand-gradient text-white shadow-glow">
              <Compass size={34} />
            </span>
            <h1 className="mt-8 font-display text-6xl font-extrabold text-neutral-900">404</h1>
            <p className="mt-3 text-xl font-semibold text-neutral-800">This page hasn&apos;t Ho Jayega-ed yet.</p>
            <p className="mt-2 text-neutral-500">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/" className="btn-primary px-6 py-3">
                <Home size={16} />
                Back Home
              </Link>
              <Link to="/browse-tasks" className="btn-secondary px-6 py-3">
                <Search size={16} />
                Browse Tasks
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
