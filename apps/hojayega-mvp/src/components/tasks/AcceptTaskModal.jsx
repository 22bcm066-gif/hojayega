import React, { useState } from 'react'
import { Wallet, Clock, MapPin, User, Phone, Handshake } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import { formatBudget, formatDeadline } from '../../lib/utils.js'

export default function AcceptTaskModal({ open, onClose, task, onAccept }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})

  if (!task) return null

  function handleSubmit(e) {
    e.preventDefault()
    const next = {}
    if (!name.trim()) next.name = 'Enter your name.'
    if (!/^[+\d][\d\s-]{7,14}$/.test(phone.trim())) next.phone = 'Enter a valid phone number.'
    setErrors(next)
    if (Object.keys(next).length) return

    onAccept({ name: name.trim(), phone: phone.trim() })
    setName('')
    setPhone('')
    setErrors({})
  }

  return (
    <Modal open={open} onClose={onClose} title="Accept this task">
      <div className="mb-6 space-y-3 rounded-2xl bg-brand-50/60 p-5">
        <p className="font-semibold text-neutral-900">{task.title}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
          <span className="inline-flex items-center gap-1.5">
            <Wallet size={14} className="text-brand-500" />
            {formatBudget(task.budget)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-brand-500" />
            {formatDeadline(task.deadline)}
          </span>
          {task.taskType === 'Physical' && task.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-brand-500" />
              {task.location}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="label-field">
            Your Name <span className="text-brand-500">*</span>
          </label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arjun Verma"
              className="input-field pl-11"
            />
          </div>
          {errors.name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="label-field">
            Phone Number <span className="text-brand-500">*</span>
          </label>
          <div className="relative">
            <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="input-field pl-11"
            />
          </div>
          {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone}</p>}
        </div>

        <button type="submit" className="btn-primary w-full py-3.5">
          <Handshake size={17} />
          Accept Task
        </button>
      </form>
    </Modal>
  )
}
