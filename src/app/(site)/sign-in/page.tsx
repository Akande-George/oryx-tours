"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await signIn({ email, password });
      const target =
        nextPath && nextPath.startsWith("/") ? nextPath : roleHomePath[user.role];
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
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Sign in to Oryx</CardTitle>
              <CardDescription>
                Access your bookings, saved tours, and concierge updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                  />
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
              </form>

              <div className="mt-4 text-sm text-muted-foreground">
                New to Oryx?{" "}
                <Link
                  className="font-medium text-foreground underline underline-offset-4"
                  href="/sign-up"
                >
                  Create an account
                </Link>
              </div>
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
