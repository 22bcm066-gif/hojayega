import React from 'react'
import { Circle, Handshake, CheckCircle2 } from 'lucide-react'

const CONFIG = {
  Open: { icon: Circle, classes: 'bg-green-50 text-green-700', dot: 'fill-green-500 text-green-500' },
  Accepted: { icon: Handshake, classes: 'bg-amber-50 text-amber-700', dot: 'fill-amber-500 text-amber-500' },
  Completed: { icon: CheckCircle2, classes: 'bg-neutral-100 text-neutral-600', dot: 'fill-neutral-400 text-neutral-400' },
}

export default function StatusBadge({ status, className = '' }) {
  const cfg = CONFIG[status] || CONFIG.Open
  const Icon = cfg.icon
  return (
    <span className={`badge ${cfg.classes} ${className}`}>
      <Icon size={12} className={status === 'Open' ? cfg.dot : ''} strokeWidth={2.5} />
      {status}
    </span>
  )
}
