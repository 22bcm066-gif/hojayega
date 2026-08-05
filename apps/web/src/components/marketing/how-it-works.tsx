import { FileEdit, UserCheck, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: FileEdit,
    title: "Post your task",
    description: "Describe what you need done, add photos, set your price, and choose a location and time.",
  },
  {
    icon: UserCheck,
    title: "A verified helper accepts",
    description: "A nearby KYC-verified helper claims the task. Track them live and chat right in the app.",
  },
  {
    icon: CheckCircle2,
    title: "Approve & release payment",
    description: "Review the proof of completion, approve the work, and your payment releases from escrow instantly.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">How HSTLE works</h2>
          <p className="mt-4 text-lg text-muted">Three steps. No phone calls, no haggling, no chasing people down.</p>
        </div>
        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="absolute top-8 left-0 right-0 hidden h-px bg-border md:block" aria-hidden />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-background ring-4 ring-surface">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
              <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-500">Step {i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
