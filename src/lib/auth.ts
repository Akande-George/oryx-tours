export type UserRole = "customer" | "admin" | "partner";

export type AccountStatus = "active" | "pending" | "rejected";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  operatorId?: string;
  status: AccountStatus;
};

export type StoredAccount = AuthUser & {
  password: string;
  companyName?: string;
};

export const AUTH_STORAGE_KEY = "oryx-auth-user";
export const ACCOUNTS_STORAGE_KEY = "oryx-auth-accounts";

export const seedAccounts: StoredAccount[] = [
  {
    id: "user-customer",
    name: "Amina Travel",
    email: "traveler@oryx.test",
    password: "oryx123",
    role: "customer",
    status: "active",
  },
  {
    id: "user-admin",
    name: "Oryx Admin",
    email: "admin@oryx.test",
    password: "admin123",
    role: "admin",
    status: "active",
  },
  {
    id: "user-partner",
    name: "Dune Operator",
    email: "partner@oryx.test",
    password: "partner123",
    role: "partner",
    status: "active",
    operatorId: "op-001",
    companyName: "Dune Voyages",
  },
];

export const roleHomePath: Record<UserRole, string> = {
  customer: "/dashboard",
  admin: "/admin",
  partner: "/partner",
};

export function loadAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return seedAccounts;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        ACCOUNTS_STORAGE_KEY,
        JSON.stringify(seedAccounts),
      );
      return seedAccounts;
    }
    const parsed = JSON.parse(raw) as StoredAccount[];
    if (!Array.isArray(parsed) || !parsed.length) return seedAccounts;
    return parsed.map((account) => ({
      ...account,
      status: account.status ?? ("active" as AccountStatus),
    }));
  } catch {
    return seedAccounts;
  }
}

export function saveAccounts(accounts: StoredAccount[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export function loadCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function persistCurrentUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
