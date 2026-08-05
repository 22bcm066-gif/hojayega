export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatBudget(amount) {
  const n = Number(amount) || 0
  return `₹${n.toLocaleString('en-IN')}`
}

export function formatDeadline(deadline) {
  if (!deadline?.date) return 'Flexible'
  const d = new Date(`${deadline.date}T${deadline.time || '00:00'}`)
  if (Number.isNaN(d.getTime())) return 'Flexible'
  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  const timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${dateStr}, ${timeStr}`
}

export function formatRelativeTime(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = Math.max(0, now - then)
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function todayISODate() {
  return new Date().toISOString().slice(0, 10)
}
