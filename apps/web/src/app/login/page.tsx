"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const { requestOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      await requestOtp(fullPhone);
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const result = await verifyOtp(fullPhone, otp, name || undefined);
      if (next) {
        router.push(next);
      } else {
        router.push(result.user.isHelper ? "/helper" : "/dashboard");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-10">
        <Logo />
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-7 shadow-raised animate-fade-in-up">
        {step === "phone" ? (
          <>
            <h1 className="text-xl font-semibold text-foreground">Log in or sign up</h1>
            <p className="mt-1.5 text-sm text-muted">We&apos;ll text you a one-time code to verify it&apos;s you.</p>
            <form onSubmit={handleSendOtp} className="mt-6">
              <Label htmlFor="phone">Mobile number</Label>
              <div className="flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-3.5 focus-within:ring-2 focus-within:ring-brand-400">
                <span className="text-sm text-muted">+91</span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-0 px-0 focus:ring-0"
                  autoFocus
                />
              </div>
              {error && <p className="mt-2 text-sm text-danger">{error}</p>}
              <Button type="submit" className="mt-5 w-full" loading={loading}>
                Send OTP
              </Button>
            </form>
          </>
        ) : (
          <>
            <button onClick={() => setStep("phone")} className="mb-3 flex items-center gap-1 text-sm text-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Change number
            </button>
            <h1 className="text-xl font-semibold text-foreground">Enter the code</h1>
            <p className="mt-1.5 text-sm text-muted">Sent to {fullPhone}</p>
            <form onSubmit={handleVerify} className="mt-6">
              <Label htmlFor="otp">6-digit OTP</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center font-mono text-lg tracking-[0.5em]"
                autoFocus
              />

              <Label htmlFor="name" className="mt-4">
                Your name <span className="font-normal text-muted">(new here?)</span>
              </Label>
              <Input id="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />

              {error && <p className="mt-2 text-sm text-danger">{error}</p>}
              <Button type="submit" className="mt-5 w-full" loading={loading}>
                Verify & continue
              </Button>
            </form>
          </>
        )}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5" /> Your number is only used for task updates & verification.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
