"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import type { UserRole } from "@/lib/auth";

type SidebarLink = {
  label: string;
  href: string;
  roles: UserRole[];
};

const allLinks: SidebarLink[] = [
  { label: "Overview", href: "/dashboard", roles: ["customer"] },
  { label: "Bookings", href: "/dashboard/bookings", roles: ["customer"] },
  { label: "Saved tours", href: "/dashboard/saved", roles: ["customer"] },
  { label: "Partner workspace", href: "/partner", roles: ["partner", "admin"] },
  { label: "Admin command center", href: "/admin", roles: ["admin"] },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const role = user?.role;
  const visibleLinks = role
    ? allLinks.filter((link) => link.roles.includes(role))
    : [];

  return (
    <aside className="w-full max-w-xs space-y-6 rounded-2xl border border-white/60 bg-white/70 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Travel Lounge
        </p>
        <h2 className="text-lg font-semibold">
          {user ? `Welcome, ${user.name.split(" ")[0]}` : "Welcome back"}
        </h2>
        {role ? (
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary">
            {role} access
          </p>
        ) : null}
      </div>
      <nav className="space-y-2 text-sm">
        {visibleLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary",
                active && "bg-secondary text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
