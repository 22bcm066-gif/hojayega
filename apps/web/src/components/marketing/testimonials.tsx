import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    name: "Meera Shah",
    role: "Customer · Vastrapur",
    quote:
      "I had a passport renewal appointment and no way to stand in that RTO queue for 3 hours. Posted it on HSTLE, someone picked it up in 12 minutes, and I got live photo updates the whole time.",
    rating: 5,
  },
  {
    name: "Kunal Desai",
    role: "Helper · 340 tasks completed",
    quote:
      "I do 4-5 tasks a day between my regular job hours. The escrow means I never chase anyone for payment — it's already there before I even start.",
    rating: 5,
  },
  {
    name: "Ananya Trivedi",
    role: "Customer · Bopal",
    quote:
      "Used it for grocery pickup and later for furniture assembly. Both helpers were verified, on time, and the chat + tracking made it feel safe the entire time.",
    rating: 4.8,
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Ahmedabad is already hustling</h2>
        <p className="mt-4 text-lg text-muted">Real tasks, completed by real verified people nearby.</p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(t.rating) ? "fill-accent-400 text-accent-400" : "text-border-strong"}`} />
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm text-muted">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-5 flex items-center gap-3">
              <Avatar name={t.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
