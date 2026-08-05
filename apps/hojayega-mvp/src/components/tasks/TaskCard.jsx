import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, Wifi, ArrowRight } from 'lucide-react'
import CategoryTag from '../ui/CategoryTag.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import { formatBudget, formatDeadline } from '../../lib/utils.js'

export default function TaskCard({ task, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6 }}
      className="card group flex h-full flex-col p-6 transition-shadow duration-300 hover:shadow-card-hover"
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <CategoryTag category={task.category} />
        <StatusBadge status={task.status} />
      </div>

      <h3 className="mb-2 text-lg font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-600">
        {task.title}
      </h3>
      <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-500">{task.description}</p>

      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          {task.taskType === 'Online' ? <Wifi size={14} /> : <MapPin size={14} />}
          {task.taskType === 'Online' ? 'Online' : task.location?.split(',')[0] || 'Physical'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} />
          {formatDeadline(task.deadline)}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
        <div>
          <p className="text-xs text-neutral-400">Budget</p>
          <p className="text-xl font-bold text-brand-600">{formatBudget(task.budget)}</p>
        </div>
        <Link
          to={`/task/${task.id}`}
          className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-800 transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-glow"
        >
          View Details
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  )
}
