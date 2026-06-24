"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/atoms";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/AuthProvider";
import { roleHomePath } from "@/lib/auth";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "General logistics", href: "/transfers" },
  { label: "Personalized", href: "/personalized" },
];

const customerLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tours", href: "/dashboard/tours" },
];

export function Navbar() {
  const router = useRouter();
  const { user, ready, signOut } = useAuth();

  const roleLinks = user?.role === "customer" ? customerLinks : [];

  const navLinks = [...publicLinks, ...roleLinks];

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
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={`/logo.png`} width={40} height={150} alt="Oryx Tours" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {ready && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="rounded-full pl-2 pr-4"
                  />
                }
              >
                <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials || <User className="h-3.5 w-3.5" />}
                </span>
                <span className="text-sm">{user.name.split(" ")[0]}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                      <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                        {user.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(roleHomePath[user.role])}
                >
                  My workspace
                </DropdownMenuItem>
                {user.role === "customer" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/bookings")}
                  >
                    My bookings
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push("/booking")}>
                  Book a tour
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={buttonVariants({
                  variant: "outline",
                  className: "rounded-full",
                })}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={buttonVariants({
                  variant: "ghost",
                  className: "rounded-full",
                })}
              >
                Sign up
              </Link>
            </>
          )}
          <Link
            href="/booking"
            className={buttonVariants({ className: "rounded-full" })}
          >
            Book a tour
          </Link>
        </div>
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" className="md:hidden" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="flex w-[280px] flex-col">
            <SheetHeader>
              <SheetTitle>Explore</SheetTitle>
            </SheetHeader>
            <nav className="mt-2 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
              {ready && user ? (
                <>
                  <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="truncate text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="mt-1 uppercase tracking-[0.2em] text-primary">
                      {user.role}
                    </p>
                  </div>
                  <Link
                    href="/booking"
                    className={buttonVariants({
                      className: "w-full rounded-full",
                    })}
                  >
                    Book a tour
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/booking"
                    className={buttonVariants({
                      className: "w-full rounded-full",
                    })}
                  >
                    Book a tour
                  </Link>
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      variant: "outline",
                      className: "w-full rounded-full",
                    })}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "w-full rounded-full",
                    })}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
