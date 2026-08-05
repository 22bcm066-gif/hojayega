import React from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORY_NAMES } from '../../data/categories.js'

export const BUDGET_RANGES = [
  { id: 'all', label: 'Any Budget' },
  { id: 'lt300', label: 'Under ₹300' },
  { id: '300-600', label: '₹300 – ₹600' },
  { id: '600-1000', label: '₹600 – ₹1,000' },
  { id: 'gt1000', label: 'Above ₹1,000' },
]

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'budget-high', label: 'Highest Budget' },
]

export default function TaskFilters({ filters, onChange, resultCount, onReset }) {
  const { search, category, taskType, budgetRange, sort } = filters

  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })

  const hasActiveFilters =
    search || category !== 'all' || taskType !== 'all' || budgetRange !== 'all' || sort !== 'newest'

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={set('search')}
            placeholder="Search tasks — e.g. groceries, RTO, delivery..."
            className="input-field pl-11"
            aria-label="Search tasks"
          />
          {search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <select value={category} onChange={set('category')} className="input-field cursor-pointer text-sm" aria-label="Filter by category">
            <option value="all">All Categories</option>
            {CATEGORY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={taskType} onChange={set('taskType')} className="input-field cursor-pointer text-sm" aria-label="Filter by task type">
            <option value="all">All Types</option>
            <option value="Online">Online</option>
            <option value="Physical">Physical</option>
          </select>

          <select value={budgetRange} onChange={set('budgetRange')} className="input-field cursor-pointer text-sm" aria-label="Filter by budget">
            {BUDGET_RANGES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>

          <select value={sort} onChange={set('sort')} className="input-field cursor-pointer text-sm" aria-label="Sort tasks">
            {SORT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-1 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <SlidersHorizontal size={14} />
            <strong className="text-neutral-800">{resultCount}</strong> task{resultCount === 1 ? '' : 's'} found
          </span>
          {hasActiveFilters && (
            <button type="button" onClick={onReset} className="font-semibold text-brand-600 hover:text-brand-700">
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
