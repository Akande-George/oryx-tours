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

  if (!ready) {
    return (
      <Container className="py-20 text-sm text-muted-foreground">
        Loading your workspace...
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-20 text-sm text-muted-foreground">
        Redirecting to sign in...
      </Container>
    );
  }

  if (allow && !allow.includes(user.role)) {
    return (
      <Container className="py-20 text-sm text-muted-foreground">
        Access not permitted for this role.
      </Container>
    );
  }

  return <>{children}</>;
}
