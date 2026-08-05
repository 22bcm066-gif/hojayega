import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Hero } from "@/components/marketing/hero";
import { Benefits } from "@/components/marketing/benefits";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PopularTasks } from "@/components/marketing/popular-tasks";
import { Testimonials } from "@/components/marketing/testimonials";
import { Safety } from "@/components/marketing/safety";
import { Faq } from "@/components/marketing/faq";
import { DownloadApp } from "@/components/marketing/download-app";

export default function Home() {
  return (
    <>
      <MarketingNav />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <HowItWorks />
        <PopularTasks />
        <Testimonials />
        <Safety />
        <Faq />
        <DownloadApp />
      </main>
      <MarketingFooter />
    </>
  );
}
