export type UserRole = "customer" | "admin" | "partner";

export type AccountStatus = "active" | "pending" | "rejected";

export type AuthProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  operatorId?: string;
  status: AccountStatus;
  companyName?: string;
};

export type AuthUser = AuthProfile;

export const roleHomePath: Record<UserRole, string> = {
  customer: "/dashboard",
  admin: "/admin",
  partner: "/partner",
};
