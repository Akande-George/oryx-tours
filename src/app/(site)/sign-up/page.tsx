"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  Eye,
  EyeOff,
  HeartHandshake,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { roleHomePath } from "@/lib/auth";

type AccountType = "customer" | "partner";

type FormData = {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

const initialForm: FormData = {
  accountType: "customer",
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

const collageImages = [
  { src: "/corniche-022.jpg", alt: "Doha Corniche skyline" },
  { src: "/an-incredible-view-of.jpg", alt: "Coastal Qatar view" },
  { src: "/banana-island-resort-058.jpg", alt: "Banana Island Resort" },
  { src: "/20220127-1643268462-571.jpg", alt: "Qatar heritage detail" },
];

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingPartner, setPendingPartner] = useState<{ name: string; email: string } | null>(null);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!formData.firstName.trim()) next.firstName = "First name is required";
    if (!formData.lastName.trim()) next.lastName = "Last name is required";
    if (formData.accountType === "partner" && !formData.companyName.trim()) {
      next.companyName = "Company name is required for partner accounts";
    }
    if (!formData.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      next.password = "Password is required";
    } else if (formData.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      next.password = "Use upper + lower case and a number";
    }
    if (!formData.confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      next.confirmPassword = "Passwords don't match";
    }
    if (!formData.acceptTerms) {
      next.acceptTerms = "You must accept the terms";
    }
    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      const result = await signUp({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        password: formData.password,
        role: formData.accountType,
        companyName:
          formData.accountType === "partner"
            ? formData.companyName.trim()
            : undefined,
      });
      if (result.kind === "pending") {
        setPendingPartner({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: result.account.email,
        });
        setIsLoading(false);
        return;
      }
      router.push(roleHomePath[result.user.role]);
      router.refresh();
    } catch (err) {
      setErrors({
        general:
          err instanceof Error ? err.message : "Unable to create account.",
      });
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_20%,rgba(58,139,92,0.18),transparent_60%),radial-gradient(45%_45%_at_15%_80%,rgba(107,15,42,0.14),transparent_70%)]"
      />
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-[0_40px_80px_-40px_rgba(92,70,39,0.55)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]"
        >
          {/* Left - form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex flex-col justify-center bg-card p-8 sm:p-12"
          >
            <div className="mb-6 flex justify-end">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className="font-medium text-primary hover:underline"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mb-8 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Join Oryx Tours
              </p>
              <h1 className="font-heading text-3xl font-semibold leading-tight">
                Begin your <span className="text-primary">next journey</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Save tours, manage bookings, and unlock concierge support across
                every destination.
              </p>
            </div>

            {pendingPartner ? (
              <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-sm">
                <h2 className="text-lg font-semibold text-foreground">
                  Application received
                </h2>
                <p className="text-muted-foreground">
                  Thanks, {pendingPartner.name}. Your partner application for{" "}
                  <strong>{pendingPartner.email}</strong> is now awaiting admin
                  approval. We&apos;ll email you as soon as it&apos;s reviewed.
                </p>
                <p className="text-xs text-muted-foreground">
                  You won&apos;t be able to sign in until your account is
                  approved.
                </p>
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/"
                    className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                  >
                    Back to home
                  </Link>
                  <Link
                    href="/sign-in"
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Go to sign in
                  </Link>
                </div>
              </div>
            ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {errors.general ? (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errors.general}
                </p>
              ) : null}

              <div className="space-y-2">
                <Label>Account type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["customer", "partner"] as AccountType[]).map((type) => {
                    const active = formData.accountType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateField("accountType", type)}
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${active ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"}`}
                      >
                        <p className="font-semibold capitalize">
                          {type === "customer" ? "Traveler" : "Partner operator"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {type === "customer"
                            ? "Book tours and transfers."
                            : "List tours and a fleet. Requires admin approval."}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.accountType === "partner" ? (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company / operator name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(event) =>
                      updateField("companyName", event.target.value)
                    }
                    placeholder="Dune Voyages"
                    className="h-11"
                    disabled={isLoading}
                  />
                  {errors.companyName ? (
                    <p className="text-xs text-destructive">
                      {errors.companyName}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(event) =>
                        updateField("firstName", event.target.value)
                      }
                      placeholder="John"
                      className="h-11 pl-9"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.firstName ? (
                    <p className="text-xs text-destructive">
                      {errors.firstName}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(event) =>
                        updateField("lastName", event.target.value)
                      }
                      placeholder="Doe"
                      className="h-11 pl-9"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.lastName ? (
                    <p className="text-xs text-destructive">
                      {errors.lastName}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="john.doe@example.com"
                    className="h-11 pl-9"
                    disabled={isLoading}
                  />
                </div>
                {errors.email ? (
                  <p className="text-xs text-destructive">{errors.email}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="Create a strong password"
                    className="h-11 px-9"
                    disabled={isLoading}
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
                {errors.password ? (
                  <p className="text-xs text-destructive">{errors.password}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    placeholder="Re-enter your password"
                    className="h-11 px-9"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) =>
                      updateField("acceptTerms", checked === true)
                    }
                  />
                  <Label htmlFor="acceptTerms" className="text-sm font-normal">
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="font-medium text-foreground underline underline-offset-2"
                    >
                      Terms and Privacy Policy
                    </Link>
                    .
                  </Label>
                </div>
                {errors.acceptTerms ? (
                  <p className="text-xs text-destructive">
                    {errors.acceptTerms}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-full text-sm font-semibold"
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating account..."
                  : formData.accountType === "partner"
                    ? "Submit partner application"
                    : "Create account"}
              </Button>
            </form>
            )}
          </motion.div>

          {/* Right - story collage */}
          <div className="relative hidden bg-[radial-gradient(80%_60%_at_80%_30%,rgba(207,232,218,0.6),transparent_70%),linear-gradient(160deg,#f4ede0_0%,#e7d6c1_100%)] p-6 lg:block">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex aspect-square flex-col justify-between rounded-2xl bg-primary p-5 text-primary-foreground"
              >
                <Compass className="size-5 opacity-80" />
                <div>
                  <p className="font-heading text-3xl font-semibold">
                    Concierge
                  </p>
                  <p className="mt-1 text-sm opacity-90">
                    A dedicated planner crafts each itinerary around you.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="aspect-square overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collageImages[0].src}
                  alt={collageImages[0].alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="aspect-square overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collageImages[1].src}
                  alt={collageImages[1].alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="aspect-square overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collageImages[2].src}
                  alt={collageImages[2].alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="aspect-square overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collageImages[3].src}
                  alt={collageImages[3].alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex aspect-square flex-col justify-between rounded-2xl bg-secondary p-5 text-secondary-foreground"
              >
                <HeartHandshake className="size-5 opacity-80" />
                <div>
                  <p className="font-heading text-3xl font-semibold">
                    Members only
                  </p>
                  <p className="mt-1 text-sm opacity-90">
                    Saved tours, priority booking, and partner-led perks.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
