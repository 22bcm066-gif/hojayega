import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo({ className = '', dark = false }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="HoJayega home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient shadow-glow transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 13 L9.5 18.5 L20 6"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-neutral-900'}`}>
        Ho<span className="text-brand-500">Jayega</span>
      </span>
    </Link>
  )
}
