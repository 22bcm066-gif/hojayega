import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import TaskCard from '../tasks/TaskCard.jsx'
import { useTasks } from '../../context/TasksContext.jsx'

export default function FeaturedTasks() {
  const { tasks } = useTasks()

  const featured = useMemo(
    () =>
      [...tasks]
        .filter((t) => t.status === 'Open')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [tasks],
  )

  return (
    <section className="section bg-brand-radial">
      <div className="container-page">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Live right now"
            title="Featured tasks near you"
            description="A snapshot of real tasks people have posted on HoJayega."
            className="mx-0"
          />
          <Link
            to="/browse-tasks"
            className="btn-secondary shrink-0 px-5 py-3 text-sm"
          >
            View all tasks
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
