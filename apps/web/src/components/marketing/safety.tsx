import { ShieldCheck, ScanFace, Landmark, PhoneCall } from "lucide-react";

const PILLARS = [
  {
    icon: ScanFace,
    title: "Aadhaar + PAN + face match",
    description: "Every helper's government ID and live selfie are verified before approval — no exceptions.",
  },
  {
    icon: Landmark,
    title: "Bank-verified payouts",
    description: "Helper earnings only go to a verified bank account in their own name, reducing fraud and disputes.",
  },
  {
    icon: ShieldCheck,
    title: "Escrow on every task",
    description: "Funds are held by HSTLE, not the helper, and only released after you approve the completed work.",
  },
  {
    icon: PhoneCall,
    title: "In-app SOS & support",
    description: "One tap connects you to our trust & safety team, with your live location and task details attached.",
  },
];

export function Safety() {
  return (
    <section id="safety" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-success-bg px-3 py-1 text-xs font-medium text-success">
              <ShieldCheck className="h-3.5 w-3.5" /> Trust & safety
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Safety isn&apos;t a feature. It&apos;s the foundation.
            </h2>
            <p className="mt-4 text-lg text-muted">
              We restrict task categories to what can be safely verified and moderated, and every rupee is protected
              until the work is actually done.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-background p-5 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                  <p.icon className="h-5 w-5 text-brand-500" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-xs text-muted">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
