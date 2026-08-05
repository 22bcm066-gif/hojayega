import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ClipboardEdit,
  Wifi,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  User,
  Phone,
  NotebookPen,
  ArrowRight,
  Eye,
  Plus,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition.jsx'
import SuccessCheck from '../components/tasks/SuccessCheck.jsx'
import { CATEGORY_NAMES } from '../data/categories.js'
import { useTasks } from '../context/TasksContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { todayISODate } from '../lib/utils.js'

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  taskType: 'Physical',
  location: '',
  deadlineDate: '',
  deadlineTime: '',
  budget: '',
  name: '',
  phone: '',
  notes: '',
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="label-field">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

export default function PostTask() {
  useDocumentTitle('Post a Task')
  const { addTask } = useTasks()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [postedTask, setPostedTask] = useState(null)

  const update = (key) => (e) => {
    const value = e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((err) => ({ ...err, [key]: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = 'Please give your task a title.'
    if (!form.description.trim()) next.description = 'Add a short description of what needs to be done.'
    if (!form.category) next.category = 'Select a category.'
    if (form.taskType === 'Physical' && !form.location.trim()) next.location = 'Location is required for physical tasks.'
    if (!form.deadlineDate) next.deadlineDate = 'Pick a deadline date.'
    if (!form.deadlineTime) next.deadlineTime = 'Pick a deadline time.'
    if (!form.budget || Number(form.budget) <= 0) next.budget = 'Enter a valid budget in ₹.'
    if (!form.name.trim()) next.name = 'Your name is required.'
    if (!/^[+\d][\d\s-]{7,14}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) {
      document.getElementById('post-task-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    const task = addTask({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      taskType: form.taskType,
      location: form.taskType === 'Physical' ? form.location.trim() : '',
      deadline: { date: form.deadlineDate, time: form.deadlineTime },
      budget: Number(form.budget),
      postedBy: { name: form.name.trim(), phone: form.phone.trim() },
      notes: form.notes.trim(),
    })

    setPostedTask(task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function postAnother() {
    setForm(EMPTY_FORM)
    setErrors({})
    setPostedTask(null)
  }

  if (postedTask) {
    return (
      <PageTransition>
        <section className="section flex min-h-[70vh] items-center bg-brand-radial">
          <div className="container-page">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card mx-auto flex max-w-xl flex-col items-center p-10 text-center sm:p-14"
            >
              <SuccessCheck />
              <h1 className="mt-8 text-2xl font-bold text-neutral-900 sm:text-3xl">
                Your task has been posted successfully.
              </h1>
              <p className="mt-3 text-neutral-500">
                <strong className="text-neutral-800">&ldquo;{postedTask.title}&rdquo;</strong> is now live on
                Browse Tasks. You&apos;ll be able to see it accepted from your task details page.
              </p>

              <div className="mt-9 flex w-full flex-col gap-3 sm:flex-row">
                <Link to={`/task/${postedTask.id}`} className="btn-primary w-full py-3.5">
                  <Eye size={17} />
                  View My Task
                </Link>
                <Link to="/browse-tasks" className="btn-secondary w-full py-3.5">
                  Browse All Tasks
                  <ArrowRight size={16} />
                </Link>
              </div>
              <button type="button" onClick={postAnother} className="btn-ghost mt-4 text-sm">
                <Plus size={15} />
                Post another task
              </button>
            </motion.div>
          </div>
        </section>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <section className="section bg-brand-radial !pb-10">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="badge mb-4 bg-brand-50 text-brand-600">
              <ClipboardEdit size={13} />
              Post a Task
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Tell us what needs to get done
            </h1>
            <p className="mt-3 text-lg text-neutral-500">
              Fill this out in under a minute — helpers nearby will see it right away.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <motion.form
            id="post-task-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            noValidate
            className="card mx-auto max-w-3xl space-y-7 p-6 sm:p-10"
          >
            <Field label="Task Title" required error={errors.title}>
              <input
                type="text"
                value={form.title}
                onChange={update('title')}
                placeholder="e.g. Deliver medicines from Andheri to Bandra"
                className="input-field"
                maxLength={100}
              />
            </Field>

            <Field label="Description" required error={errors.description}>
              <textarea
                value={form.description}
                onChange={update('description')}
                placeholder="Add all the details a helper would need to know..."
                rows={4}
                className="input-field resize-none"
                maxLength={800}
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Category" required error={errors.category}>
                <select value={form.category} onChange={update('category')} className="input-field cursor-pointer">
                  <option value="" disabled>
                    Select a category
                  </option>
                  {CATEGORY_NAMES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field label="Task Type" required>
                <div className="flex gap-3">
                  {['Physical', 'Online'].map((type) => (
                    <label
                      key={type}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        form.taskType === type
                          ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-sm'
                          : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="taskType"
                        value={type}
                        checked={form.taskType === type}
                        onChange={update('taskType')}
                        className="sr-only"
                      />
                      {type === 'Online' ? <Wifi size={16} /> : <MapPin size={16} />}
                      {type}
                    </label>
                  ))}
                </div>
              </Field>
            </div>

            {form.taskType === 'Physical' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <Field label="Location" required error={errors.location}>
                  <div className="relative">
                    <MapPin size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={update('location')}
                      placeholder="e.g. Andheri West, Mumbai"
                      className="input-field pl-11"
                    />
                  </div>
                </Field>
              </motion.div>
            )}

            <div className="grid gap-6 sm:grid-cols-3">
              <Field label="Deadline Date" required error={errors.deadlineDate}>
                <div className="relative">
                  <Calendar size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="date"
                    value={form.deadlineDate}
                    min={todayISODate()}
                    onChange={update('deadlineDate')}
                    className="input-field pl-11"
                  />
                </div>
              </Field>

              <Field label="Deadline Time" required error={errors.deadlineTime}>
                <div className="relative">
                  <Clock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="time"
                    value={form.deadlineTime}
                    onChange={update('deadlineTime')}
                    className="input-field pl-11"
                  />
                </div>
              </Field>

              <Field label="Budget (₹)" required error={errors.budget}>
                <div className="relative">
                  <IndianRupee size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="number"
                    min="1"
                    value={form.budget}
                    onChange={update('budget')}
                    placeholder="500"
                    className="input-field pl-11"
                  />
                </div>
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Your Name" required error={errors.name}>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="e.g. Priya Nair"
                    className="input-field pl-11"
                  />
                </div>
              </Field>

              <Field label="Phone Number" required error={errors.phone}>
                <div className="relative">
                  <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="+91 98765 43210"
                    className="input-field pl-11"
                  />
                </div>
              </Field>
            </div>

            <Field label="Additional Notes">
              <div className="relative">
                <NotebookPen size={16} className="pointer-events-none absolute left-4 top-4 text-neutral-400" />
                <textarea
                  value={form.notes}
                  onChange={update('notes')}
                  placeholder="Anything else the helper should know? (optional)"
                  rows={3}
                  className="input-field resize-none pl-11"
                  maxLength={400}
                />
              </div>
            </Field>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-4 text-base"
            >
              Post Task
              <ArrowRight size={18} />
            </motion.button>
            <p className="text-center text-xs text-neutral-400">
              By posting, you agree that this is a demo MVP — no real payments are processed on HoJayega.
            </p>
          </motion.form>
        </div>
      </section>
    </PageTransition>
  )
}
