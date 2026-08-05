import Link from "next/link";
import { Wallet, ShieldCheck, Clock, TrendingUp } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Button } from "@/components/ui/button";

const PERKS = [
  { icon: Wallet, title: "Get paid instantly", description: "Payment releases to your wallet the moment a customer approves your work — withdraw to your bank anytime." },
  { icon: Clock, title: "Work on your schedule", description: "Go online whenever you're free. Accept only the tasks and categories you want." },
  { icon: TrendingUp, title: "Grow your earnings", description: "Top-rated helpers get priority visibility on nearby tasks and unlock higher-value categories." },
  { icon: ShieldCheck, title: "Backed by HSTLE", description: "In-app SOS, dispute support, and a trust & safety team have your back on every task." },
];

export default function BecomeAHelperPage() {
  return (
    <>
      <MarketingNav />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted shadow-soft">
            Earn on your own schedule
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Become a verified HSTLE helper</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            Complete a one-time verification, then start accepting nearby tasks — grocery runs, deliveries, queue
            standing, and handyman work — and get paid the moment each one is approved.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/login?next=/helper/onboarding">
              <Button size="lg">Start verification</Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
            {PERKS.map((perk) => (
              <div key={perk.title} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                  <perk.icon className="h-5 w-5 text-brand-500" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{perk.title}</h3>
                <p className="mt-2 text-sm text-muted">{perk.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-surface p-8 text-left shadow-soft">
            <h2 className="text-lg font-semibold text-foreground">What you&apos;ll need</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:text-brand-300">1</span>
                Aadhaar card (front & back)
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:text-brand-300">2</span>
                PAN card
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:text-brand-300">3</span>
                A live selfie for face verification
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:text-brand-300">4</span>
                A bank account in your own name for payouts
              </li>
            </ol>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
