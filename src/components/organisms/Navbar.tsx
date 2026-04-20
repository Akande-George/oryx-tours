"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
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
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "Transfers", href: "/transfers" },
  { label: "Personalized", href: "/personalized" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={`/logo.png`} width={40} height={150} alt="logo" />
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
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Explore</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm">
                  {link.label}
                </Link>
              ))}
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
                href="/booking"
                className={buttonVariants({ className: "rounded-full" })}
              >
                Book a tour
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
