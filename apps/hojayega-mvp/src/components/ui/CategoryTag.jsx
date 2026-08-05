import React from 'react'
import { getCategory } from '../../data/categories.js'

export default function CategoryTag({ category, className = '' }) {
  const cfg = getCategory(category)
  const Icon = cfg?.icon
  const color = cfg?.color || '#FF6B00'

  return (
    <span
      className={`badge ${className}`}
      style={{ backgroundColor: `${color}14`, color }}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {category}
    </span>
  )
}
