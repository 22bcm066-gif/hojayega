"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What kind of tasks can I post?",
    a: "Anything legal — grocery pickup, medicine delivery, queue standing at government offices, document pickup/drop, small handyman jobs like electrician or plumber visits, furniture assembly, shopping, and more. We keep an active list of restricted categories that helpers cannot accept for safety reasons.",
  },
  {
    q: "How does escrow actually work?",
    a: "When you post a task, your payment is captured immediately and held by HSTLE — not the helper. It only releases to the helper's wallet after you review their proof of completion and approve the task. If something goes wrong, you can raise a dispute before approving.",
  },
  {
    q: "How are helpers verified?",
    a: "Every helper submits Aadhaar, PAN, and a live selfie for face verification before they can accept their first task. Our admin team manually reviews each submission. Helpers with verified bank accounts and consistent ratings are marked as Top Rated.",
  },
  {
    q: "What if the helper doesn't show up or does a bad job?",
    a: "You can raise a dispute directly from the task screen. Our trust & safety team reviews the evidence — chat history, photos, and location data — and resolves it with a full refund, partial refund, or release to the helper, typically within 24 hours.",
  },
  {
    q: "Which city is HSTLE live in?",
    a: "We're focused entirely on Ahmedabad at launch, concentrating on the highest-frequency task categories to build a dense, reliable helper network before expanding to other cities.",
  },
  {
    q: "How much does HSTLE cost?",
    a: "You set the price you're willing to pay when posting a task. HSTLE takes a commission from the helper's payout to run verification, support, and the escrow system — there's no separate fee charged to customers beyond the task price.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Frequently asked questions</h2>
      </div>
      <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface shadow-soft">
        {FAQS.map((faq, i) => (
          <div key={faq.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium text-foreground">{faq.q}</span>
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i && <p className="px-6 pb-5 text-sm text-muted">{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
