import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/browse-tasks', label: 'Browse Tasks' },
  { to: '/post-task', label: 'Post Task' },
  { to: '/about', label: 'About' },
]

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-neutral-100 bg-white">
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-50 blur-3xl" />

      <div className="container-page relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-neutral-500">
              Whatever it is. <span className="font-semibold text-brand-500">Ho Jayega.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-400">
              A local marketplace connecting people who need everyday tasks done with helpers nearby.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">Explore</h4>
            <ul className="space-y-3">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[15px] text-neutral-600 transition-colors hover:text-brand-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@hojayega.in"
                  className="inline-flex items-center gap-2 text-[15px] text-neutral-600 transition-colors hover:text-brand-600"
                >
                  <Mail size={15} />
                  hello@hojayega.in
                </a>
              </li>
              <li>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1 text-[15px] text-neutral-600 transition-colors hover:text-brand-600"
                >
                  About HoJayega
                  <ArrowUpRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">Follow along</h4>
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 hover:shadow-soft"
                >
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 text-sm text-neutral-400 sm:flex-row">
          <p>© {new Date().getFullYear()} HoJayega. All rights reserved.</p>
          <p>Made for everyday task-getting-done, everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
