import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { MOCK_TASKS } from '../data/mockTasks.js'

const STORAGE_KEY = 'hojayega:tasks:v1'

const TasksContext = createContext(null)

function loadStoredTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return null
  } catch {
    return null
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Storage can fail in private-browsing/quota-exceeded situations.
    // The app keeps working from in-memory state either way.
  }
}

function makeId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => loadStoredTasks() ?? MOCK_TASKS)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((data) => {
    const newTask = {
      id: makeId(),
      status: 'Open',
      createdAt: new Date().toISOString(),
      helper: null,
      ...data,
    }
    setTasks((prev) => [newTask, ...prev])
    return newTask
  }, [])

  const acceptTask = useCallback((taskId, helper) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: 'Accepted', helper, acceptedAt: new Date().toISOString() }
          : task,
      ),
    )
  }, [])

  const completeTask = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: 'Completed', completedAt: new Date().toISOString() }
          : task,
      ),
    )
  }, [])

  const getTask = useCallback((taskId) => tasks.find((task) => task.id === taskId), [tasks])

  const resetToSeed = useCallback(() => {
    setTasks(MOCK_TASKS)
  }, [])

  const value = useMemo(
    () => ({ tasks, addTask, acceptTask, completeTask, getTask, resetToSeed }),
    [tasks, addTask, acceptTask, completeTask, getTask, resetToSeed],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider')
  return ctx
}
