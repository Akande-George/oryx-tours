import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
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

const experienceLinks = [
  { label: "Luxury retreats", href: "/tours" },
  { label: "Adventure escapes", href: "/tours" },
  { label: "Cultural tours", href: "/tours" },
  { label: "Airport transfers", href: "/transfers" },
  { label: "Personalized trips", href: "/personalized" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1f190f] text-[#e8dfcd]">
      {/* Decorative glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_85%_0%,rgba(207,160,124,0.18),transparent_60%),radial-gradient(45%_55%_at_5%_100%,rgba(58,139,92,0.18),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#cfa07c]/50 to-transparent"
      />

      <Container className="relative">
        {/* CTA strip */}
        <div className="flex flex-col gap-6 border-b border-white/10 py-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#cfa07c]">
              Ready when you are
            </p>
            <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
              Let&apos;s design your next journey.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 rounded-full bg-[#e8dfcd] py-1 pl-5 pr-1 text-sm font-semibold text-[#1f190f] transition-all hover:gap-3"
            >
              Book a tour
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f190f] transition-transform group-hover:scale-110">
                <ArrowRight className="h-4 w-4 text-[#e8dfcd]" />
              </span>
            </Link>
            <Link
              href="/personalized"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Plan a custom trip
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Oryx Tours" width={36} height={36} />
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#cfa07c]">
                Oryx Group
              </p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#e8dfcd]/70">
              Curated journeys across desert, coast, and heritage landscapes.
              Every experience is crafted with concierge-level care.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#e8dfcd]/80 transition-all duration-300 hover:-translate-y-1 hover:border-[#cfa07c] hover:bg-[#cfa07c] hover:text-[#1f190f]"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="text-sm">
            <p className="mb-4 font-semibold text-white">Experiences</p>
            <div className="space-y-1">
              {experienceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-1 py-1 text-[#e8dfcd]/70 transition-colors hover:text-white"
                >
                  <ArrowRight className="h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  <span className="-ml-5 transition-all duration-300 group-hover:ml-0">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-sm">
            <p className="mb-4 font-semibold text-white">Global headquarters</p>
            <div className="space-y-2.5 text-[#e8dfcd]/70">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-[3px] h-4 w-4 shrink-0 text-[#cfa07c]" />
                <span>
                  Office 705, 7th Floor, Building 8, Emrair Street, Zone 18, Old
                  Salata - Corniche, Doha, Qatar.
                </span>
              </p>
              <Link
                href="mailto:info@oryxgp.com"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#cfa07c]" />
                <span>info@oryxgp.com</span>
              </Link>
              <Link
                href="tel:+97444931726"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#cfa07c]" />
                <span>+974 4493 1726</span>
              </Link>
              <Link
                href="https://wa.me/97439998609"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-[#cfa07c]" />
                <span>+974 3999 8609</span>
              </Link>
              <Link
                href="https://www.oryxgp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Globe className="h-4 w-4 shrink-0 text-[#cfa07c]" />
                <span>www.oryxgp.com</span>
              </Link>
            </div>
          </div>

          <div className="text-sm">
            <p className="mb-4 font-semibold text-white">Africa headquarters</p>
            <div className="space-y-2.5 text-[#e8dfcd]/70">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-[3px] h-4 w-4 shrink-0 text-[#cfa07c]" />
                <span>
                  Office D02, 3rd Floor, The Statement Hotel, 1002 First Avenue,
                  Off Ahmadu Bello Way, Central Business District, F.C.T, Abuja,
                  Nigeria.
                </span>
              </p>
              <Link
                href="mailto:Oryx_africa@oryxgp.com"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-[#cfa07c]" />
                <span>Oryx_africa@oryxgp.com</span>
              </Link>
              <Link
                href="tel:+2347072342929"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-[#cfa07c]" />
                <span>+234 707 234 2929</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col items-center gap-3 py-6 text-center text-xs text-[#e8dfcd]/60 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} Oryx Group Events & Tourism. Crafted
            for modern travelers. All rights reserved.
          </p>
          <Link
            href="/terms"
            className="font-medium text-[#e8dfcd]/80 transition-colors hover:text-white"
          >
            Terms &amp; Conditions
          </Link>
        </Container>
      </div>
    </footer>
  );
}
