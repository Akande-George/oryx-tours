import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SearchBar } from "@/components/molecules/SearchBar";
import { Container } from "@/components/layout/Container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_70%)] py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f8e6c8] via-[#f7f1e4] to-[#f1d1aa]" />
      <Container className="grid items-center gap-12 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Luxury travel, refined
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Design the journey that matches your pace and palette.
          </h1>
          <p className="text-lg text-muted-foreground">
            From dune sanctuaries to coastal charters, Oryx crafts bespoke
            experiences with a private guide, curated dining, and seamless
            transfers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/personalized"
              className={buttonVariants({ className: "rounded-full" })}
            >
              Plan a journey
            </Link>
            <Link
              href="/tours"
              className={buttonVariants({
                variant: "outline",
                className: "rounded-full",
              })}
            >
              Explore signature tours <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="space-y-6">
          <SearchBar />
          <div className="grid gap-4 rounded-2xl border border-white/60 bg-white/70 p-6 text-sm shadow-[0_24px_50px_-32px_rgba(92,70,39,0.5)] backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Concierge availability
              </span>
              <span className="font-semibold text-primary">24/7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average response</span>
              <span className="font-semibold text-primary">32 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Members traveling</span>
              <span className="font-semibold text-primary">4,580+</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
