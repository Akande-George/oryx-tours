"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import type { UserRole } from "@/lib/auth";
import { Container } from "@/components/layout/Container";

type RouteGuardProps = {
  children: ReactNode;
  allow?: UserRole[];
};

function GuardSplash({ label }: { label: string }) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="relative h-10 w-10">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        <span className="absolute inset-1 rounded-full bg-primary" />
      </div>
      <p className="text-sm font-medium tracking-wide text-muted-foreground">
        {label}
      </p>
    </Container>
  );
}

export function RouteGuard({ children, allow }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/sign-in?next=${next}`);
      return;
    }
    if (allow && !allow.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [ready, user, allow, router, pathname]);

  if (!ready) return <GuardSplash label="Preparing your workspace" />;
  if (!user) return <GuardSplash label="Redirecting to sign in" />;
  if (allow && !allow.includes(user.role)) {
    return <GuardSplash label="This area is restricted" />;
  }

  return <>{children}</>;
}
