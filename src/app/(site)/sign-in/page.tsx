"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, MapPin, Sparkles } from "lucide-react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { roleHomePath } from "@/lib/auth";
import { cn } from "@/lib/utils";

const demoAccounts = [
  {
    label: "Customer",
    email: "traveler@oryx.test",
    password: "oryx123",
    description: "Customer dashboard, bookings, saved tours.",
  },
  {
    label: "Admin",
    email: "admin@oryx.test",
    password: "admin123",
    description: "Admin command center: approvals, revenue, oversight.",
  },
  {
    label: "Partner",
    email: "partner@oryx.test",
    password: "partner123",
    description: "Operator dashboard: manage tours and earnings.",
  },
];

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`;

const collageImages = [
  { id: "1542401886-65d6c61db217", alt: "Pyramids at sunset" },
  { id: "1469854523086-cc02fe5d8800", alt: "Desert dunes" },
  { id: "1564507592333-c60657eea523", alt: "Hot air balloons" },
  { id: "1551845041-63e8e76836ea", alt: "Caravan at dawn" },
];

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemos, setShowDemos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await signIn({ email, password });
      if (rememberMe && typeof window !== "undefined") {
        window.localStorage.setItem("oryx-remember-me", "true");
      }
      const target =
        nextPath && nextPath.startsWith("/")
          ? nextPath
          : roleHomePath[user.role];
      router.push(target);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_15%_20%,rgba(58,139,92,0.18),transparent_60%),radial-gradient(45%_45%_at_85%_80%,rgba(107,15,42,0.14),transparent_70%)]"
      />
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-[0_40px_80px_-40px_rgba(92,70,39,0.55)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr]"
        >
          {/* Left - story collage */}
          <div className="relative hidden bg-[radial-gradient(80%_60%_at_20%_30%,rgba(207,232,218,0.6),transparent_70%),linear-gradient(160deg,#f4ede0_0%,#e7d6c1_100%)] p-6 lg:block">
            <div className="grid h-full grid-cols-2 grid-rows-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="overflow-hidden rounded-2xl"
              >
                <img
                  src={unsplash(collageImages[0].id)}
                  alt={collageImages[0].alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="flex flex-col justify-between rounded-2xl bg-primary p-5 text-primary-foreground"
              >
                <Sparkles className="size-5 opacity-80" />
                <div>
                  <p className="font-heading text-4xl font-semibold">4.9★</p>
                  <p className="mt-1 text-sm opacity-90">
                    Average rating from 12,400+ Oryx travelers worldwide.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="overflow-hidden rounded-2xl"
              >
                <img
                  src={unsplash(collageImages[1].id)}
                  alt={collageImages[1].alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="overflow-hidden rounded-2xl"
              >
                <img
                  src={unsplash(collageImages[2].id)}
                  alt={collageImages[2].alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col justify-between rounded-2xl bg-secondary p-5 text-secondary-foreground"
              >
                <MapPin className="size-5 opacity-80" />
                <div>
                  <p className="font-heading text-4xl font-semibold">150+</p>
                  <p className="mt-1 text-sm opacity-90">
                    Hand-crafted itineraries across deserts, deltas, and coasts.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="overflow-hidden rounded-2xl"
              >
                <img
                  src={unsplash(collageImages[3].id)}
                  alt={collageImages[3].alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>

          {/* Right - form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex flex-col justify-center bg-card p-8 sm:p-12"
          >
            <div className="mb-6 flex justify-end">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-medium text-primary hover:underline"
                  href="/sign-up"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mb-8 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Welcome back
              </p>
              <h1 className="font-heading text-3xl font-semibold leading-tight">
                Sign in to <span className="text-primary">Oryx Tours</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Pick up where you left off — concierge plans, saved tours, and
                booking history are waiting.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-11 pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="h-11 px-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked === true)
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal">
                  Remember me on this device
                </Label>
              </div>

              {error ? (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                className="h-11 w-full rounded-full text-sm font-semibold"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </Button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-border" />
                <span className="mx-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Or
                </span>
                <div className="flex-grow border-t border-border" />
              </div>

              <button
                type="button"
                onClick={() => setShowDemos((v) => !v)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background py-2.5 text-sm font-medium transition-colors hover:bg-accent/40"
              >
                {showDemos ? "Hide demo accounts" : "Try a demo account"}
              </button>

              <div
                className={cn(
                  "grid gap-2 overflow-hidden transition-all duration-500",
                  showDemos
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="min-h-0 space-y-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => fillDemo(account.email, account.password)}
                      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background/60 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{account.label}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {account.email}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Use →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <section className="py-10 sm:py-16">
          <Container>
            <p className="text-sm text-muted-foreground">Loading sign in...</p>
          </Container>
        </section>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
