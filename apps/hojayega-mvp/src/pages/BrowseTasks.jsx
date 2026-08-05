import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchX } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition.jsx'
import TaskFilters from '../components/tasks/TaskFilters.jsx'
import TaskCard from '../components/tasks/TaskCard.jsx'
import { useTasks } from '../context/TasksContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const DEFAULT_FILTERS = {
  search: '',
  category: 'all',
  taskType: 'all',
  budgetRange: 'all',
  sort: 'newest',
}

function inBudgetRange(budget, range) {
  switch (range) {
    case 'lt300':
      return budget < 300
    case '300-600':
      return budget >= 300 && budget <= 600
    case '600-1000':
      return budget > 600 && budget <= 1000
    case 'gt1000':
      return budget > 1000
    default:
      return true
  }
}

export default function BrowseTasks() {
  useDocumentTitle('Browse Tasks')
  const { tasks } = useTasks()
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: categoryFromUrl || 'all',
  })

  const filteredTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase()

    let result = tasks.filter((task) => {
      if (filters.category !== 'all' && task.category !== filters.category) return false
      if (filters.taskType !== 'all' && task.taskType !== filters.taskType) return false
      if (!inBudgetRange(task.budget, filters.budgetRange)) return false
      if (query) {
        const haystack = `${task.title} ${task.description} ${task.category} ${task.location}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })

    result = result.sort((a, b) => {
      if (filters.sort === 'budget-high') return b.budget - a.budget
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return result
  }, [tasks, filters])

  return (
    <PageTransition>
      <section className="bg-brand-radial pb-6 pt-14 sm:pt-16">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 max-w-2xl"
          >
            <span className="badge mb-4 bg-brand-50 text-brand-600">Browse Tasks</span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Find a task worth doing
            </h1>
            <p className="mt-3 text-lg text-neutral-500">
              Filter by category, budget or task type — and accept what fits you.
            </p>
          </motion.div>

          <TaskFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredTasks.length}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </div>
      </section>

      <section className="section !pt-10">
        <div className="container-page">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              <motion.div
                key="grid"
                layout
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredTasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card flex flex-col items-center gap-4 px-6 py-20 text-center"
              >
                <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-500">
                  <SearchX size={28} />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">No tasks match your filters</h3>
                  <p className="mt-2 text-neutral-500">Try adjusting your search, category or budget range.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  )
}
