import Link from "next/link";
import Image from "next/image";
import { Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V10.5H5.67v7.84h2.67ZM7 9.34a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1Zm11.34 9V14a3.5 3.5 0 0 0-3.5-3.5 3.04 3.04 0 0 0-2.74 1.5v-1.5H9.67c.04.7 0 7.84 0 7.84h2.67v-4.38c0-.24.02-.48.09-.66.2-.48.63-.98 1.36-.98.96 0 1.34.73 1.34 1.8v4.22h2.67Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.7c0-.86.27-1.45 1.5-1.45H16.5V4.6c-.26-.04-1.18-.11-2.24-.11-2.22 0-3.76 1.36-3.76 3.85V10.5H8v3h2.5V21h3Z" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.5 3v2.7a4.6 4.6 0 0 0 3.5 3.5v2.7a7.3 7.3 0 0 1-3.5-1.04v5.6a5.74 5.74 0 1 1-5.74-5.74c.27 0 .53.02.79.06v2.78a3 3 0 1 0 2.2 2.9V3h2.75Z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/oryx-group-events-and-tourisim/",
    Icon: LinkedinIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/oryxeventsandtourism",
    Icon: InstagramIcon,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@oryxeventsandtourisim",
    Icon: TiktokIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Ay2i79n3f/",
    Icon: FacebookIcon,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/70 backdrop-blur">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Oryx Tours" width={36} height={36} />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Oryx Tours
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Curated journeys across desert, coast, and heritage landscapes.
            Every experience is crafted with concierge-level care.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/80 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold">Experiences</p>
          <div className="space-y-2 text-muted-foreground">
            <Link
              href="/tours"
              className="block hover:text-foreground"
            >
              Luxury retreats
            </Link>
            <Link
              href="/tours"
              className="block hover:text-foreground"
            >
              Adventure escapes
            </Link>
            <Link
              href="/tours"
              className="block hover:text-foreground"
            >
              Cultural tours
            </Link>
            <Link
              href="/transfers"
              className="block hover:text-foreground"
            >
              Airport transfers
            </Link>
          </div>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold">Global headquarters</p>
          <div className="space-y-2.5 text-muted-foreground">
            <p className="flex items-start gap-2.5 leading-relaxed">
              <MapPin className="mt-[3px] h-4 w-4 shrink-0" />
              <span>
                Office 705, 7th Floor, Building 8, Emrair Street, Zone 18, Old
                Salata - Corniche, Doha, Qatar.
              </span>
            </p>
            <Link
              href="mailto:info@oryxgp.com"
              className="flex items-center gap-2.5 hover:text-foreground"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span>info@oryxgp.com</span>
            </Link>
            <Link
              href="tel:+97444931726"
              className="flex items-center gap-2.5 hover:text-foreground"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>+974 4493 1726</span>
            </Link>
            <Link
              href="https://wa.me/97439998609"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>+974 3999 8609</span>
            </Link>
            <Link
              href="https://www.oryxgp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-foreground"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span>www.oryxgp.com</span>
            </Link>
          </div>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold">Africa headquarters</p>
          <div className="space-y-2.5 text-muted-foreground">
            <p className="flex items-start gap-2.5 leading-relaxed">
              <MapPin className="mt-[3px] h-4 w-4 shrink-0" />
              <span>
                Office D02, 3rd Floor, The Statement Hotel, 1002 First Avenue,
                Off Ahmadu Bello Way, Central Business District, F.C.T, Abuja,
                Nigeria.
              </span>
            </p>
            <Link
              href="mailto:Oryx_africa@oryxgp.com"
              className="flex items-center gap-2.5 hover:text-foreground"
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span>Oryx_africa@oryxgp.com</span>
            </Link>
            <Link
              href="tel:+2347072342929"
              className="flex items-center gap-2.5 hover:text-foreground"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>+234 707 234 2929</span>
            </Link>
          </div>
        </div>
      </Container>
      <div className="flex flex-col items-center gap-3 border-t border-white/60 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} Oryx Group Events & Tourism. Crafted
          for modern travelers. All rights reserved.
        </p>
        <Link
          href="/terms"
          className="font-medium hover:text-foreground"
        >
          Terms & Conditions
        </Link>
      </div>
    </footer>
  );
}
