"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { roleHomePath } from "@/lib/auth";

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

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_1fr]">
          <Card className="border border-white/60 bg-white/80 shadow-[0_24px_50px_-32px_rgba(92,70,39,0.45)] backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="px-9"
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
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
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
                    Remember me
                  </Label>
                </div>

                {error && (
                  <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  className="w-full rounded-full"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="font-medium text-foreground underline underline-offset-4"
                    href="/sign-up"
                  >
                    Create one
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-white/60 bg-white/70 shadow-[0_24px_50px_-32px_rgba(92,70,39,0.45)] backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg">Demo credentials</CardTitle>
              <CardDescription>
                Click any account to autofill the form. No backend required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account.email, account.password)}
                  className="w-full rounded-xl border border-white/70 bg-white/80 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{account.label}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Tap to use
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {account.description}
                  </p>
                  <div className="mt-3 grid gap-1 text-xs">
                    <span>
                      <span className="text-muted-foreground">Email: </span>
                      <span className="font-medium">{account.email}</span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Password: </span>
                      <span className="font-medium">{account.password}</span>
                    </span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
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
