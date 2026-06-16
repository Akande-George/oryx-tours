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
  signOut: () => void;
  approvePartner: (accountId: string) => void;
  rejectPartner: (accountId: string) => void;
  updateMyProfile: (patch: ProfilePatch) => Promise<AuthUser>;
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
    const profile = await getProfileById(supabase, userId);
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

    const bootstrap = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (session?.user) {
        await loadCurrentProfile(session.user.id);
      } else {
        setAccounts([]);
        setUser(null);
      }

      setReady(true);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        throw new Error(error?.message ?? "Invalid email or password.");
      }

      const profile = await loadCurrentProfile(data.user.id);
      if (!profile) {
        throw new Error("Your account profile is not ready yet.");
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

  const approvePartner = useCallback(
    (accountId: string) => {
      void updateAccountStatus(accountId, "active");
    },
    [updateAccountStatus],
  );

  const rejectPartner = useCallback(
    (accountId: string) => {
      void updateAccountStatus(accountId, "rejected");
    },
    [updateAccountStatus],
  );

  const signOut = useCallback(() => {
    void supabase.auth.signOut();
    setUser(null);
    setAccounts([]);
  }, []);

  const updateMyProfile = useCallback(
    async (patch: ProfilePatch) => {
      if (!user) throw new Error("Not signed in");
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
