import Link from "next/link";
import { Apple, Play, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadApp() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-accent-500 px-8 py-16 text-center shadow-raised sm:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]"
          aria-hidden
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white">
            <Smartphone className="h-3.5 w-3.5" /> iOS & Android
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Get HSTLE on your phone</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Live tracking, push notifications, and one-tap task posting — the full HSTLE experience is built
            mobile-first.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="#">
              <Button size="lg" className="w-full bg-white text-brand-700 hover:bg-white/90 sm:w-auto">
                <Apple className="h-5 w-5" /> Download for iOS
              </Button>
            </Link>
            <Link href="#">
              <Button size="lg" variant="outline" className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                <Play className="h-5 w-5" /> Get it on Android
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
