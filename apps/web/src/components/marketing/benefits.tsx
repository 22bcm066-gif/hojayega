import { ShieldCheck, Zap, Wallet, MapPin } from "lucide-react";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Verified, not anonymous",
    description: "Every helper completes Aadhaar, PAN, and face verification before they can accept a single task.",
  },
  {
    icon: Wallet,
    title: "Money held in escrow",
    description: "Payment is collected upfront and only released to your helper once you approve the completed work.",
  },
  {
    icon: Zap,
    title: "Minutes, not hours",
    description: "Nearby helpers get notified instantly. Most tasks in Ahmedabad are accepted within 8 minutes.",
  },
  {
    icon: MapPin,
    title: "Live tracking, always",
    description: "See exactly where your helper is, chat in-app, and get an OTP-verified proof of completion.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Built to be trusted</h2>
        <p className="mt-4 text-lg text-muted">
          HSTLE isn&apos;t a listings app — it&apos;s an end-to-end system that protects both sides of every task.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => (
          <div key={b.title} className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition-transform hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
              <b.icon className="h-5 w-5 text-brand-500" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{b.title}</h3>
            <p className="mt-2 text-sm text-muted">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
