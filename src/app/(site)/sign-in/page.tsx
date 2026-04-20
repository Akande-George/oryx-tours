"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const demoAccounts = [
  { email: "traveler@oryx.test", password: "oryx123" },
  { email: "guest@oryx.test", password: "welcome123" },
];

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    setSubmitting(true);

    const account = demoAccounts.find(
      (item) => item.email === email.trim().toLowerCase(),
    );

    if (!account || account.password !== password) {
      setError("Invalid demo credentials. Try traveler@oryx.test / oryx123");
      setSubmitting(false);
      return;
    }

    // Simulate network delay while using demo credentials.
    await new Promise((resolve) => setTimeout(resolve, 400));

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-md">
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
                Need a booking account?{" "}
                <Link
                  className="font-medium text-foreground underline underline-offset-4"
                  href="/personalized"
                >
                  Contact concierge
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
