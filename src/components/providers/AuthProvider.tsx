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
import {
  AuthUser,
  StoredAccount,
  UserRole,
  loadAccounts,
  loadCurrentUser,
  persistCurrentUser,
  saveAccounts,
} from "@/lib/auth";

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
  | { kind: "pending"; account: StoredAccount };

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  accounts: StoredAccount[];
  signIn: (args: SignInArgs) => Promise<AuthUser>;
  signUp: (args: SignUpArgs) => Promise<SignUpResult>;
  signOut: () => void;
  approvePartner: (accountId: string) => void;
  rejectPartner: (accountId: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const toAuthUser = (account: StoredAccount): AuthUser => ({
  id: account.id,
  name: account.name,
  email: account.email,
  role: account.role,
  status: account.status,
  operatorId: account.operatorId,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccounts(loadAccounts());
    setUser(loadCurrentUser());
    setReady(true);
  }, []);

  const signIn = useCallback(
    async ({ email, password }: SignInArgs) => {
      const list = accounts.length ? accounts : loadAccounts();
      const match = list.find(
        (account) =>
          account.email.toLowerCase() === email.trim().toLowerCase() &&
          account.password === password,
      );
      if (!match) {
        throw new Error("Invalid email or password.");
      }
      if (match.status === "pending") {
        throw new Error(
          "Your partner application is awaiting admin approval.",
        );
      }
      if (match.status === "rejected") {
        throw new Error(
          "Your partner application was rejected. Contact support for details.",
        );
      }
      const nextUser = toAuthUser(match);
      persistCurrentUser(nextUser);
      setUser(nextUser);
      return nextUser;
    },
    [accounts],
  );

  const signUp = useCallback(
    async ({
      name,
      email,
      password,
      role = "customer",
      companyName,
    }: SignUpArgs): Promise<SignUpResult> => {
      const list = accounts.length ? accounts : loadAccounts();
      const normalizedEmail = email.trim().toLowerCase();
      if (
        list.some((account) => account.email.toLowerCase() === normalizedEmail)
      ) {
        throw new Error("An account with this email already exists.");
      }
      const id = `user-${Date.now()}`;
      const newAccount: StoredAccount = {
        id,
        name: name.trim() || "Oryx Traveler",
        email: normalizedEmail,
        password,
        role,
        status: role === "partner" ? "pending" : "active",
        operatorId: role === "partner" ? `op-${id}` : undefined,
        companyName: role === "partner" ? companyName?.trim() : undefined,
      };
      const next = [...list, newAccount];
      setAccounts(next);
      saveAccounts(next);

      if (role === "partner") {
        return { kind: "pending", account: newAccount };
      }
      const nextUser = toAuthUser(newAccount);
      persistCurrentUser(nextUser);
      setUser(nextUser);
      return { kind: "signed-in", user: nextUser };
    },
    [accounts],
  );

  const updateAccountStatus = useCallback(
    (accountId: string, status: StoredAccount["status"]) => {
      setAccounts((prev) => {
        const next = prev.map((account) =>
          account.id === accountId ? { ...account, status } : account,
        );
        saveAccounts(next);
        return next;
      });
    },
    [],
  );

  const approvePartner = useCallback(
    (accountId: string) => updateAccountStatus(accountId, "active"),
    [updateAccountStatus],
  );

  const rejectPartner = useCallback(
    (accountId: string) => updateAccountStatus(accountId, "rejected"),
    [updateAccountStatus],
  );

  const signOut = useCallback(() => {
    persistCurrentUser(null);
    setUser(null);
  }, []);

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
    }),
    [user, ready, accounts, signIn, signUp, signOut, approvePartner, rejectPartner],
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
