import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/70 backdrop-blur">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Oryx Tours
          </p>
          <p className="text-sm text-muted-foreground">
            Curated journeys across desert, coast, and heritage landscapes.
            Every experience is crafted with concierge-level care.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Experiences</p>
          <Link href="/tours">Luxury retreats</Link>
          <Link href="/tours">Adventure escapes</Link>
          <Link href="/tours">Cultural tours</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Company</p>
          <Link href="/">About Oryx</Link>
          <Link href="/personalized">Personalized planning</Link>
          <Link href="/dashboard">Travel lounge</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Support</p>
          <Link href="/">Contact concierge</Link>
          <Link href="/transfers">Airport transfers</Link>
          <Link href="/checkout">Payments</Link>
        </div>
      </Container>
      <div className="border-t border-white/60 py-6 text-center text-xs text-muted-foreground">
        Crafted for modern travelers. All rights reserved.
      </div>
    </footer>
  );
}
