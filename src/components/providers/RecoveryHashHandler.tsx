"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Safety net for password-recovery links. If Supabase redirects the recovery
// link to the Site URL (e.g. the redirect target wasn't allow-listed), the
// access/refresh tokens land in the hash of whatever page we're on — usually
// the home page. Detect that and forward to /auth/reset-password, preserving
// the hash so the reset form can establish the session.
export function RecoveryHashHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname === "/auth/reset-password") return;

    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const isRecovery =
      params.get("type") === "recovery" && params.get("access_token");

    if (isRecovery) {
      router.replace(`/auth/reset-password${hash}`);
    }
  }, [pathname, router]);

  return null;
}
