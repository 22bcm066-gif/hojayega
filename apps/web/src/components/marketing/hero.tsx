import Link from "next/link";
import { ShieldCheck, Star, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--brand-100),transparent)]"
        aria-hidden
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-2 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Now live in Ahmedabad
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Anything legal.
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">Handled.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Post a task, and a KYC-verified helper nearby picks it up — groceries, document pickups, queue standing,
            small repairs, and more. Your money stays in escrow until the job is done right.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Post your first task
              </Button>
            </Link>
            <Link href="/become-a-helper">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Become a helper
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" /> KYC-verified helpers
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" /> Escrow-protected payments
            </span>
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent-400" /> 4.9 average rating
            </span>
          </div>
        </div>

        <div className="relative animate-fade-in-up [animation-delay:120ms]">
          <div className="mx-auto max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-raised">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">Task #HSTLE-AHM-4F82K1</p>
              <TaskStatusBadge status="HELPER_EN_ROUTE" />
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">Grocery pickup — Satellite</p>
            <p className="mt-1 text-sm text-muted">D-Mart Satellite → Home, Prahladnagar</p>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-surface-raised p-3">
              <Avatar name="Ravi Patel" size="md" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Ravi Patel</p>
                <p className="flex items-center gap-1 text-xs text-muted">
                  <Star className="h-3 w-3 fill-accent-400 text-accent-400" /> 4.92 · 312 tasks
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-300">
                <Clock3 className="h-3.5 w-3.5" /> 8 min
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-success/40 bg-success-bg px-3 py-2.5">
              <span className="text-xs font-medium text-success">₹230 held in escrow</span>
              <ShieldCheck className="h-4 w-4 text-success" />
            </div>
          </div>

          <div className="absolute -right-6 -top-6 hidden rotate-3 rounded-xl border border-border bg-surface p-3 shadow-raised sm:block">
            <p className="text-xs font-medium text-muted">Completion OTP</p>
            <p className="font-mono text-lg font-semibold tracking-[0.3em] text-foreground">7 5 2 9</p>
          </div>
        </div>
      </div>
    </section>
  );
}
