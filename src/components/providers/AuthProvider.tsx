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
};

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signIn: (args: SignInArgs) => Promise<AuthUser>;
  signUp: (args: SignUpArgs) => Promise<AuthUser>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Reading from localStorage requires the client; hydrate on mount.
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
      const nextUser: AuthUser = {
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
      };
      persistCurrentUser(nextUser);
      setUser(nextUser);
      return nextUser;
    },
    [accounts],
  );

  const signUp = useCallback(
    async ({ name, email, password, role = "customer" }: SignUpArgs) => {
      const list = accounts.length ? accounts : loadAccounts();
      const normalizedEmail = email.trim().toLowerCase();
      if (list.some((account) => account.email.toLowerCase() === normalizedEmail)) {
        throw new Error("An account with this email already exists.");
      }
      const newAccount: StoredAccount = {
        id: `user-${Date.now()}`,
        name: name.trim() || "Oryx Traveler",
        email: normalizedEmail,
        password,
        role,
      };
      const next = [...list, newAccount];
      setAccounts(next);
      saveAccounts(next);
      const nextUser: AuthUser = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role,
      };
      persistCurrentUser(nextUser);
      setUser(nextUser);
      return nextUser;
    },
    [accounts],
  );

  const signOut = useCallback(() => {
    persistCurrentUser(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, signIn, signUp, signOut }),
    [user, ready, signIn, signUp, signOut],
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
