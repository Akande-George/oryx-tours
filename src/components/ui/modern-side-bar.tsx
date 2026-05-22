"use client";

import { useEffect, useState, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LogOut,
  Map,
  Menu,
  Shield,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import type { UserRole } from "@/lib/auth";

interface NavigationItem {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
  roles: UserRole[];
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Overview", icon: Home, href: "/dashboard", roles: ["customer"] },
  { id: "customer-tours", name: "Tours", icon: Heart, href: "/dashboard/tours", roles: ["customer"] },
  { id: "customer-bookings", name: "Bookings", icon: Calendar, href: "/dashboard/bookings", roles: ["customer"] },
  { id: "customer-spending", name: "Spending", icon: Wallet, href: "/dashboard/spending", roles: ["customer"] },
  { id: "partner", name: "Partner workspace", icon: Users, href: "/partner", roles: ["partner", "admin"] },
  { id: "admin", name: "Admin overview", icon: Shield, href: "/admin", roles: ["admin"] },
  { id: "admin-tours", name: "Tours", icon: Map, href: "/admin/tours", roles: ["admin"] },
  { id: "admin-fleet", name: "Fleet", icon: Car, href: "/admin/fleet", roles: ["admin"] },
  { id: "admin-bookings", name: "Bookings", icon: Calendar, href: "/admin/bookings", roles: ["admin"] },
  { id: "admin-revenue", name: "Revenue", icon: BarChart3, href: "/admin/revenue", roles: ["admin"] },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleItems = user
    ? navigationItems.filter((item) => item.roles.includes(user.role))
    : [];

  const closeOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
    router.refresh();
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="fixed left-4 top-20 z-30 rounded-full border border-white/60 bg-white/80 p-2.5 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur md:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="h-4 w-4 text-foreground" />
        ) : (
          <Menu className="h-4 w-4 text-foreground" />
        )}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] flex-col border-r border-white/60 bg-white/80 backdrop-blur transition-all duration-300 ease-in-out md:sticky md:top-16 md:z-auto md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-24" : "w-72",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-white/60 bg-white/40 p-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5",
              isCollapsed && "mx-auto",
            )}
          >
            <Image src="/logo.png" alt="Oryx Tours" width={36} height={36} />
            {!isCollapsed ? (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  Oryx Tours
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Travel lounge
                </span>
              </div>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            className="hidden rounded-md p-1.5 transition-colors hover:bg-muted md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={closeOnMobile}
                    title={isCollapsed ? item.name : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      isCollapsed && "justify-center px-2",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {!isCollapsed ? (
                      <span
                        className={cn(
                          "flex-1 truncate",
                          isActive && "font-medium text-foreground",
                        )}
                      >
                        {item.name}
                      </span>
                    ) : null}
                    {isCollapsed ? (
                      <span className="invisible absolute left-full ml-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                        {item.name}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-white/60">
          <div
            className={cn(
              "border-b border-white/60 bg-white/40",
              isCollapsed ? "px-2 py-3" : "p-3",
            )}
          >
            {user ? (
              isCollapsed ? (
                <div className="flex justify-center">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 rounded-lg bg-white/70 px-3 py-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                      {user.role}
                    </p>
                  </div>
                </div>
              )
            ) : null}
          </div>

          <div className="p-3">
            <button
              type="button"
              onClick={handleSignOut}
              title={isCollapsed ? "Sign out" : undefined}
              className={cn(
                "group relative flex w-full items-center rounded-lg text-sm text-destructive transition-colors hover:bg-destructive/10",
                isCollapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2.5",
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed ? <span>Sign out</span> : null}
              {isCollapsed ? (
                <span className="invisible absolute left-full ml-2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  Sign out
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
