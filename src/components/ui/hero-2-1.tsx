"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/molecules/SearchBar";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=2400&auto=format&fit=crop";

const Hero2 = () => {
  return (
    <section className="relative isolate overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="Happy tourists enjoying a guided journey"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/65 to-black/85"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_15%,rgba(207,160,124,0.25),transparent_60%),radial-gradient(40%_40%_at_15%_85%,rgba(58,139,92,0.25),transparent_70%)]"
      />

      <Container className="relative z-10 pt-24 pb-24 text-center text-white">
        <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
          <Sparkles className="h-4 w-4 text-amber-200" />
          <span className="text-sm font-medium text-white/90">
            Curated by Oryx concierge
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-10"
        >
          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
            Design the journey that matches your pace and palette.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            From dune sanctuaries to coastal charters, Oryx Group crafts
            bespoke experiences with a private guide, curated dining, and
            seamless transfers.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/personalized"
              className={cn(
                buttonVariants({
                  className: "h-12 rounded-full px-8 text-base",
                }),
                "shadow-[0_18px_40px_-15px_rgba(207,160,124,0.55)]",
              )}
            >
              Plan a journey
            </Link>
            <Link
              href="/tours"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className:
                    "h-12 rounded-full border-white/40 bg-white/10 px-8 text-base text-white hover:bg-white/20 hover:text-white",
                }),
              )}
            >
              Explore signature tours <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-16 w-full max-w-3xl text-left">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <SearchBar />
          </div>
        </div>
      </Container>
    </section>
  );
};

export { Hero2 };
