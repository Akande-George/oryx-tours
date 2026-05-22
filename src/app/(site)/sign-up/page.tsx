"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!formData.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      next.password = "Password is required";
    } else if (formData.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
    ) {
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
      const user = await signUp({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        password: formData.password,
        role: "customer",
      });
      router.push(roleHomePath[user.role]);
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
    <section className="py-10 sm:py-16">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <Card className="border border-white/60 bg-white/80 shadow-[0_24px_50px_-32px_rgba(92,70,39,0.45)] backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Save tours, manage bookings, and unlock concierge support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {errors.general ? (
                  <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errors.general}
                  </p>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(event) =>
                          updateField("firstName", event.target.value)
                        }
                        placeholder="John"
                        className="pl-9"
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
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(event) =>
                          updateField("lastName", event.target.value)
                        }
                        placeholder="Doe"
                        className="pl-9"
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
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="john.doe@example.com"
                      className="pl-9"
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
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="Create a strong password"
                      className="px-9"
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
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
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
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
                      }
                      placeholder="Re-enter your password"
                      className="px-9"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
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
                    <Label
                      htmlFor="acceptTerms"
                      className="text-sm font-normal"
                    >
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
                  className="w-full rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    className="font-medium text-foreground underline underline-offset-4"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
