"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Overview", href: "/dashboard" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "Saved tours", href: "/dashboard/saved" },
  { label: "Partner", href: "/partner" },
  { label: "Admin", href: "/admin" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full max-w-xs space-y-6 rounded-2xl border border-white/60 bg-white/70 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Travel Lounge
        </p>
        <h2 className="text-lg font-semibold">Welcome back</h2>
      </div>
      <nav className="space-y-2 text-sm">
        {links.map((link) => {
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
