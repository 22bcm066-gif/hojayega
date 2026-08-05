import React, { useMemo } from 'react'
import { QrCode } from 'lucide-react'

// Deterministic pseudo-QR pattern (visual placeholder only — not a real,
// scannable code). Swap this component for a real UPI QR image/generator
// once payments are wired up.
function makePattern(seed, size = 11) {
  let s = 0
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967295
  }
  const cells = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const isFinder =
        (x < 3 && y < 3) || (x > size - 4 && y < 3) || (x < 3 && y > size - 4)
      cells.push(isFinder ? (x === 1 && y === 1 ? 0 : 1) : rand() > 0.56 ? 1 : 0)
    }
  }
  return cells
}

export default function PaymentQR({ seed = 'hojayega', amount, payeeName = 'Helper' }) {
  const size = 11
  const cells = useMemo(() => makePattern(seed, size), [seed])
  const cellSize = 100 / size

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-brand-200 bg-brand-50/50 p-6 text-center">
      <div className="relative h-44 w-44 overflow-hidden rounded-2xl bg-white p-3 shadow-card sm:h-52 sm:w-52">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <rect width="100" height="100" fill="white" />
          {cells.map((on, idx) => {
            if (!on) return null
            const x = (idx % size) * cellSize
            const y = Math.floor(idx / size) * cellSize
            return <rect key={idx} x={x} y={y} width={cellSize} height={cellSize} fill="#1C1917" />
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-brand-500 shadow">
            <QrCode size={18} />
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-neutral-800">Scan to pay {payeeName} via UPI</p>
        {amount ? <p className="text-2xl font-bold text-brand-600">₹{Number(amount).toLocaleString('en-IN')}</p> : null}
        <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-neutral-500">
          Pay the helper directly after successful completion. This is a demo placeholder QR — no real
          transaction is processed.
        </p>
      </div>
    </div>
  )
}
