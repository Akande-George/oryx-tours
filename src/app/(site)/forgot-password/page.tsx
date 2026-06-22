"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/molecules/Toaster";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success(
        "Reset email sent",
        "Check your inbox for the password reset link.",
      );
    } catch (e) {
      toast.error("Couldn't send reset email", (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_15%_20%,rgba(58,139,92,0.18),transparent_60%),radial-gradient(45%_45%_at_85%_80%,rgba(107,15,42,0.14),transparent_70%)]"
      />
      <Container className="max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/60 bg-white/90 p-7 shadow-[0_30px_60px_-30px_rgba(92,70,39,0.45)] backdrop-blur"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex items-center justify-center rounded-2xl bg-white p-3 shadow-[0_10px_30px_-15px_rgba(92,70,39,0.45)] ring-1 ring-black/5">
              <Image
                src="/logo.png"
                alt="Oryx Group"
                width={72}
                height={110}
                priority
                className="h-20 w-auto"
              />
            </div>
          </div>

          <div className="mb-6 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Reset password
            </p>
            <h1 className="font-heading text-2xl font-semibold leading-tight">
              Forgot your password?
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the email tied to your account and we&apos;ll send you a
              secure link to set a new one.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Check your inbox</p>
              <p>
                If an account exists for{" "}
                <span className="font-medium">{email}</span> you&apos;ll get an
                email with a reset link within a minute or two. The link
                expires after 60 minutes.
              </p>
              <p className="text-xs text-emerald-800/80">
                Not seeing it? Check spam, or{" "}
                <button
                  type="button"
                  className="font-semibold underline"
                  onClick={() => setSent(false)}
                >
                  resend
                </button>
                .
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-10 pl-9"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-10 w-full rounded-full text-sm font-semibold"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Remembered it?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/sign-in"
            >
              Back to sign in
            </Link>
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
