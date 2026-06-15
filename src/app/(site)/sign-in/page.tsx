"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { roleHomePath } from "@/lib/auth";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="mb-6 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Welcome back
            </p>
            <h1 className="font-heading text-2xl font-semibold leading-tight">
              Sign in to <span className="text-primary">Oryx Tours</span>
            </h1>
          </div>

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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot?
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
                  className="h-10 px-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="rememberMe" className="text-xs font-normal">
                Remember me
              </Label>
            </div>

            {error ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-10 w-full rounded-full text-sm font-semibold"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </Container>
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <section className="py-10">
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
