"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  getProfileById,
  getProfiles,
  updateProfile,
  updateProfileStatus,
} from "@/lib/supabase/data";
import { toast } from "@/components/molecules/Toaster";
import type { AuthProfile, AuthUser, UserRole } from "@/lib/auth";

type SignInArgs = { email: string; password: string };
type SignUpArgs = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyName?: string;
};

export type SignUpResult =
  | { kind: "signed-in"; user: AuthUser }
  | { kind: "pending"; account: AuthProfile };

type ProfilePatch = Partial<Pick<AuthProfile, "name" | "companyName">>;

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  accounts: AuthProfile[];
  signIn: (args: SignInArgs) => Promise<AuthUser>;
  signUp: (args: SignUpArgs) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  approvePartner: (accountId: string) => void;
  rejectPartner: (accountId: string) => void;
  updateMyProfile: (patch: ProfilePatch) => Promise<AuthUser>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  setRecoverySession: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const supabase = createSupabaseBrowserClient();

const toAuthUser = (profile: AuthProfile): AuthUser => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  role: profile.role,
  status: profile.status,
  operatorId: profile.operatorId,
  companyName: profile.companyName,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AuthProfile[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const loadCurrentProfile = useCallback(async (userId: string) => {
    console.log("[auth] loadCurrentProfile", userId);
    const profile = await getProfileById(supabase, userId);
    console.log("[auth] profile fetched", profile);
    if (!profile) {
      return null;
    }

    setUser(toAuthUser(profile));
    if (profile.role === "admin") {
      setAccounts(await getProfiles(supabase));
    } else {
      setAccounts([profile]);
    }

    return profile;
  }, []);

  useEffect(() => {
    let active = true;

    // Safety net: if anything below hangs (Supabase fetch never resolves,
    // RLS recursion, network freeze), force ready=true after a few seconds
    // so the user is never stuck on "Preparing your workspace".
    const safetyTimer = window.setTimeout(() => {
      if (active) {
        console.warn(
          "[auth] bootstrap timed out — forcing ready=true so the app is usable",
        );
        setReady(true);
      }
    }, 5000);

    const withTimeout = <T,>(
      promise: PromiseLike<T>,
      ms: number,
      label: string,
    ) =>
      Promise.race<T>([
        Promise.resolve(promise),
        new Promise<T>((_, reject) =>
          window.setTimeout(
            () => reject(new Error(`${label} timed out after ${ms}ms`)),
            ms,
          ),
        ),
      ]);

    const bootstrap = async () => {
      console.log("[auth] bootstrap start");
      try {
        const {
          data: { session },
        } = await withTimeout(
          supabase.auth.getSession(),
          4000,
          "getSession",
        );

        if (!active) return;
        console.log("[auth] session", session?.user?.id ?? "(none)");

        if (session?.user) {
          await withTimeout(
            loadCurrentProfile(session.user.id),
            4000,
            "loadCurrentProfile",
          );
        } else {
          setAccounts([]);
          setUser(null);
        }
      } catch (e) {
        console.error("[auth] bootstrap failed", e);
      } finally {
        window.clearTimeout(safetyTimer);
        if (active) {
          console.log("[auth] bootstrap ready=true");
          setReady(true);
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setAccounts([]);
        return;
      }

      await loadCurrentProfile(session.user.id);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadCurrentProfile]);

  const refreshAccounts = useCallback(async (profile: AuthProfile | null) => {
    if (!profile) {
      setAccounts([]);
      return;
    }

    if (profile.role === "admin") {
      setAccounts(await getProfiles(supabase));
      return;
    }

    setAccounts([profile]);
  }, []);

  const signIn = useCallback(
    async ({ email, password }: SignInArgs) => {
      console.log("[auth] signIn start", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        console.error("[auth] signIn failed", error);
        throw new Error(error?.message ?? "Invalid email or password.");
      }

      let profile = await loadCurrentProfile(data.user.id);
      if (!profile) {
        // Self-heal: the profiles row never landed (no trigger / RLS issue).
        // Create a minimal customer profile from the auth user metadata
        // so the user isn't stuck in a redirect loop.
        console.warn("[auth] no profile row — creating fallback");
        const meta = data.user.user_metadata ?? {};
        const fallback: AuthProfile = {
          id: data.user.id,
          email: data.user.email ?? email.trim().toLowerCase(),
          name: (meta.name as string) ?? data.user.email?.split("@")[0] ?? "Oryx Traveler",
          role: (meta.role as AuthProfile["role"]) ?? "customer",
          status: "active",
          operatorId: meta.operatorId as string | undefined,
          companyName: meta.companyName as string | undefined,
        };
        const { error: insertErr } = await supabase
          .from("profiles")
          .upsert(fallback);
        if (insertErr) {
          console.error("[auth] fallback profile insert failed", insertErr);
          throw new Error(
            `Account profile not ready: ${insertErr.message}`,
          );
        }
        profile = fallback;
      }
      if (profile.status === "rejected") {
        await supabase.auth.signOut();
        throw new Error(
          "Your partner application was rejected. Contact support for details.",
        );
      }
      await refreshAccounts(profile);
      const nextUser = toAuthUser(profile);
      setUser(nextUser);
      console.log("[auth] signIn ok", nextUser.role);
      return nextUser;
    },
    [loadCurrentProfile, refreshAccounts],
  );

  const signUp = useCallback(
    async ({
      name,
      email,
      password,
      role = "customer",
      companyName,
    }: SignUpArgs): Promise<SignUpResult> => {
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim() || "Oryx Traveler";
      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo,
          data: {
            name: trimmedName,
            role,
            companyName: role === "partner" ? companyName?.trim() : undefined,
          },
        },
      });

      if (error || !data.user) {
        throw new Error(error?.message ?? "Unable to create account.");
      }

      const profile =
        (await getProfileById(supabase, data.user.id)) ??
        ({
          id: data.user.id,
          name: trimmedName,
          email: normalizedEmail,
          role,
          status: role === "partner" ? "pending" : "active",
          operatorId:
            role === "partner"
              ? data.user.user_metadata?.operatorId
              : undefined,
          companyName: role === "partner" ? companyName?.trim() : undefined,
        } satisfies AuthProfile);

      if (!data.session) {
        throw new Error(
          "Check your email to confirm your account, then sign in again.",
        );
      }

      await refreshAccounts(profile);
      const nextUser = toAuthUser(profile);
      setUser(nextUser);
      void fetch("/api/users/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          role: profile.role,
          userId: profile.id,
          companyName: profile.companyName,
        }),
      }).catch(() => {});
      return { kind: "signed-in", user: nextUser };
    },
    [refreshAccounts],
  );

  const updateAccountStatus = useCallback(
    async (accountId: string, status: AuthProfile["status"]) => {
      const ok = await updateProfileStatus(supabase, accountId, status);
      if (ok) {
        setAccounts(await getProfiles(supabase));
      }
    },
    [],
  );

  const notifyPartnerStatus = (
    profileId: string,
    status: "active" | "rejected",
  ) => {
    void fetch("/api/notifications/partner-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, status }),
    }).catch(() => {});
  };

  const approvePartner = useCallback(
    async (accountId: string) => {
      await updateAccountStatus(accountId, "active");
      notifyPartnerStatus(accountId, "active");
      toast.success("Partner approved");
    },
    [updateAccountStatus],
  );

  const rejectPartner = useCallback(
    async (accountId: string) => {
      await updateAccountStatus(accountId, "rejected");
      notifyPartnerStatus(accountId, "rejected");
      toast.info("Partner rejected");
    },
    [updateAccountStatus],
  );

  const signOut = useCallback(async () => {
    console.log("[auth] signOut start");

    // Wipe local React state immediately so any UI listening to `user`
    // re-renders as signed out right away — don't wait for the network call.
    setUser(null);
    setAccounts([]);
    toast.info("Signed out");

    if (typeof window !== "undefined") {
      // Clear known app keys; leave unrelated keys alone.
      try {
        window.localStorage.removeItem("oryx-remember-me");
        // Sweep any leftover supabase auth tokens (defensive).
        for (let i = window.localStorage.length - 1; i >= 0; i--) {
          const k = window.localStorage.key(i);
          if (k && (k.startsWith("sb-") || k.includes("supabase"))) {
            window.localStorage.removeItem(k);
          }
        }
        window.sessionStorage.clear();
      } catch {
        /* ignore storage errors */
      }

      // Fire-and-forget the Supabase signout so a hung / expired-token
      // session can't block the navigation. If it ever resolves later
      // (after we've navigated away) it doesn't matter.
      void supabase.auth.signOut().catch((e) => {
        console.error("[auth] supabase signOut failed", e);
      });

      // Force a full reload so React/zustand state, route guards, and the
      // sidebar all reset cleanly. Avoids the "Redirecting to Sign in"
      // limbo when client-side routing races RLS-driven user state.
      window.location.replace("/sign-in");
    }
  }, []);

  const updateMyProfile = useCallback(
    async (patch: ProfilePatch) => {
      if (!user) {
        toast.error("Not signed in");
        throw new Error("Not signed in");
      }
      const updated = await updateProfile(supabase, user.id, patch);
      const nextUser = toAuthUser(updated);
      setUser(nextUser);
      setAccounts((prev) =>
        prev.length
          ? prev.map((p) => (p.id === updated.id ? updated : p))
          : [updated],
      );
      return nextUser;
    },
    [user],
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    // We route this through our /api/auth/password-reset endpoint so
    // Resend (with our branded template) sends the email instead of
    // Supabase's built-in mailer.
    const res = await fetch("/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    let payload: { ok?: boolean; error?: string } = {};
    try {
      payload = (await res.json()) as { ok?: boolean; error?: string };
    } catch {
      /* ignore — body may be empty */
    }
    if (!res.ok) {
      console.error("[auth] password reset request failed", payload);
      throw new Error(payload.error ?? `HTTP ${res.status}`);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.error("[auth] updateUser(password) failed", error);
      throw new Error(error.message);
    }
  }, []);

  const setRecoverySession = useCallback(
    async (accessToken: string, refreshToken: string) => {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error || !data.session?.user) {
        console.error("[auth] setSession (recovery) failed", error);
        throw new Error(error?.message ?? "Invalid or expired reset link");
      }
      // Load the profile so the rest of the app sees the user as signed in.
      await loadCurrentProfile(data.session.user.id);
    },
    [loadCurrentProfile],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      accounts,
      signIn,
      signUp,
      signOut,
      approvePartner,
      rejectPartner,
      updateMyProfile,
      requestPasswordReset,
      updatePassword,
      setRecoverySession,
    }),
    [
      user,
      ready,
      accounts,
      signIn,
      signUp,
      signOut,
      approvePartner,
      rejectPartner,
      updateMyProfile,
      requestPasswordReset,
      updatePassword,
      setRecoverySession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
