"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/molecules/Toaster";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, updatePassword, signOut, setRecoverySession } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenReady, setTokenReady] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Supabase puts the recovery tokens in the URL hash, e.g.
  //   #access_token=...&refresh_token=...&type=recovery
  // We parse them and establish the session explicitly — relying on the
  // client to auto-detect the hash is unreliable with the SSR client.
  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      // Already signed in (e.g. came back to the page) — allow reset.
      if (user) {
        setTokenReady(true);
        setVerifying(false);
        return;
      }

      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);

      if (params.get("error") || params.get("error_description")) {
        if (!cancelled) {
          setTokenError(
            "This reset link is invalid or has expired. Request a new one.",
          );
          setVerifying(false);
        }
        return;
      }

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        if (!cancelled) {
          setTokenError(
            "We couldn't verify the reset link. Open it directly from your email or request a new one.",
          );
          setVerifying(false);
        }
        return;
      }

      try {
        await setRecoverySession(accessToken, refreshToken);
        if (cancelled) return;
        // Clean the tokens out of the URL bar.
        window.history.replaceState(null, "", window.location.pathname);
        setTokenReady(true);
      } catch (e) {
        if (!cancelled) {
          setTokenError(
            (e as Error).message ||
              "This reset link is invalid or has expired. Request a new one.",
          );
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };

    void verify();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("Password too short", "Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      toast.success(
        "Password updated",
        "You're signed in with the new password.",
      );
      router.push("/dashboard");
    } catch (e) {
      toast.error("Couldn't update password", (e as Error).message);
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
              Set a new password
            </p>
            <h1 className="font-heading text-2xl font-semibold leading-tight">
              Choose a new password
            </h1>
          </div>

          {verifying ? (
            <p className="text-sm text-muted-foreground">
              Verifying reset link…
            </p>
          ) : tokenError ? (
            <div className="space-y-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <p>{tokenError}</p>
              <Link
                href="/forgot-password"
                className="inline-block font-semibold underline"
              >
                Request a new reset link
              </Link>
            </div>
          ) : tokenReady ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">
                  New password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="h-10 px-9"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-xs">
                  Confirm new password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder="Re-enter the password"
                    className="h-10 px-9"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-10 w-full rounded-full text-sm font-semibold"
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update password"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  void signOut();
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel and sign out
              </button>
            </form>
          ) : null}
        </motion.div>
      </Container>
    </section>
  );
}
