import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Clock,
  Wifi,
  Wallet,
  User,
  Phone,
  Share2,
  Handshake,
  CheckCircle2,
  ArrowLeft,
  PhoneCall,
  MessageCircle,
  Link2,
  FileText,
} from 'lucide-react'
import PageTransition from '../components/layout/PageTransition.jsx'
import CategoryTag from '../components/ui/CategoryTag.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import AcceptTaskModal from '../components/tasks/AcceptTaskModal.jsx'
import PaymentQR from '../components/tasks/PaymentQR.jsx'
import SuccessCheck from '../components/tasks/SuccessCheck.jsx'
import { useTasks } from '../context/TasksContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { formatBudget, formatDeadline, formatRelativeTime, initials } from '../lib/utils.js'

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-500 shadow-sm">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-xs text-neutral-400">{label}</p>
        <p className="text-sm font-semibold text-neutral-800">{value}</p>
      </div>
    </div>
  )
}

export default function TaskDetails() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { getTask, acceptTask, completeTask } = useTasks()
  const task = getTask(taskId)

  useDocumentTitle(task ? task.title : 'Task not found')

  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  if (!task) {
    return (
      <PageTransition>
        <section className="section flex min-h-[60vh] items-center">
          <div className="container-page text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Task not found</h1>
            <p className="mt-2 text-neutral-500">This task may have been removed or the link is incorrect.</p>
            <Link to="/browse-tasks" className="btn-primary mt-6 inline-flex px-6 py-3">
              <ArrowLeft size={16} />
              Back to Browse Tasks
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  function handleAccept(helper) {
    acceptTask(task.id, helper)
    setModalOpen(false)
  }

  function handleComplete() {
    completeTask(task.id)
    setCelebrate(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleShare() {
    const url = window.location.href
    const shareData = {
      title: task.title,
      text: `Check out this task on HoJayega: ${task.title}`,
      url,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — silently ignore, sharing is a non-critical action
    }
  }

  return (
    <PageTransition>
      <section className="bg-brand-radial pb-10 pt-10 sm:pt-14">
        <div className="container-page">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-brand-600"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card p-6 sm:p-9"
            >
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <CategoryTag category={task.category} />
                <StatusBadge status={task.status} />
                <span className="ml-auto text-xs text-neutral-400">Posted {formatRelativeTime(task.createdAt)}</span>
              </div>

              <h1 className="text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl">{task.title}</h1>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-neutral-600">
                {task.description}
              </p>

              {task.notes && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-dashed border-neutral-200 p-4">
                  <FileText size={16} className="mt-0.5 shrink-0 text-neutral-400" />
                  <p className="text-sm leading-relaxed text-neutral-500">{task.notes}</p>
                </div>
              )}

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetaItem icon={Wallet} label="Budget" value={formatBudget(task.budget)} />
                <MetaItem icon={Clock} label="Deadline" value={formatDeadline(task.deadline)} />
                <MetaItem
                  icon={task.taskType === 'Online' ? Wifi : MapPin}
                  label="Task Type"
                  value={task.taskType}
                />
                <MetaItem icon={MapPin} label="Location" value={task.taskType === 'Online' ? 'Remote' : task.location || '—'} />
              </div>

              <div className="mt-7 flex items-center gap-3 border-t border-neutral-100 pt-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {initials(task.postedBy?.name) || 'U'}
                </span>
                <div>
                  <p className="text-xs text-neutral-400">Task posted by</p>
                  <p className="text-sm font-semibold text-neutral-800">{task.postedBy?.name || 'Anonymous'}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {task.status === 'Open' && (
                  <button type="button" onClick={() => setModalOpen(true)} className="btn-primary flex-1 py-3.5">
                    <Handshake size={17} />
                    Accept Task
                  </button>
                )}
                <button type="button" onClick={handleShare} className="btn-secondary flex-1 py-3.5">
                  {copied ? <Link2 size={16} /> : <Share2 size={16} />}
                  {copied ? 'Link copied!' : 'Share Task'}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {task.status === 'Open' && (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card flex flex-col items-center gap-3 p-8 text-center"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-500">
                      <Handshake size={24} />
                    </span>
                    <h3 className="font-bold text-neutral-900">Nobody has accepted this yet</h3>
                    <p className="text-sm text-neutral-500">
                      Be the first to help — accept it now and connect with {task.postedBy?.name?.split(' ')[0] || 'the poster'} directly.
                    </p>
                  </motion.div>
                )}

                {(task.status === 'Accepted' || task.status === 'Completed') && (
                  <motion.div
                    key="accepted"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                      Helper Details
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                        {initials(task.helper?.name) || 'H'}
                      </span>
                      <div>
                        <p className="font-semibold text-neutral-900">{task.helper?.name}</p>
                        <p className="text-sm text-neutral-500">{task.helper?.phone}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${task.helper?.phone?.replace(/\s/g, '')}`}
                        className="btn-secondary justify-center py-2.5 text-sm"
                      >
                        <PhoneCall size={15} />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${task.helper?.phone?.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary justify-center py-2.5 text-sm"
                      >
                        <MessageCircle size={15} />
                        Message
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {task.status === 'Accepted' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">Payment</h3>
                  <PaymentQR seed={task.id} amount={task.budget} payeeName={task.helper?.name} />
                  <button type="button" onClick={handleComplete} className="btn-primary mt-5 w-full py-3.5">
                    <CheckCircle2 size={17} />
                    Mark Task Completed
                  </button>
                </motion.div>
              )}

              {task.status === 'Completed' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card flex flex-col items-center gap-2 p-8 text-center"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 size={26} />
                  </span>
                  <h3 className="font-bold text-neutral-900">Task Completed</h3>
                  <p className="text-sm text-neutral-500">Payment Completed · Thank you for using HoJayega</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <AcceptTaskModal open={modalOpen} onClose={() => setModalOpen(false)} task={task} onAccept={handleAccept} />

      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCelebrate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-w-sm flex-col items-center rounded-3xl bg-white p-10 text-center shadow-2xl"
            >
              <SuccessCheck size={110} />
              <h2 className="mt-7 text-2xl font-bold text-neutral-900">Task Completed</h2>
              <p className="mt-2 font-semibold text-green-600">Payment Completed</p>
              <p className="mt-3 text-neutral-500">Thank you for using HoJayega</p>
              <button type="button" onClick={() => setCelebrate(false)} className="btn-primary mt-8 w-full py-3">
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
