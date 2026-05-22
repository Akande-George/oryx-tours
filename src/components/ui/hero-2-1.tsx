"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/molecules/SearchBar";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";

const Hero2 = () => {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#f8e6c8] via-[#f7f1e4] to-[#f1d1aa]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_70%)]" />

      <div className="pointer-events-none absolute -right-60 -top-10 z-0 flex flex-col items-end opacity-70 blur-xl">
        <div className="h-[10rem] w-[60rem] rounded-full bg-gradient-to-b from-[#f6d2a3] to-[#e8b98b] blur-[6rem]" />
        <div className="h-[10rem] w-[90rem] rounded-full bg-gradient-to-b from-[#6b0f2a] to-[#cfa07c] blur-[6rem]" />
        <div className="h-[10rem] w-[60rem] rounded-full bg-gradient-to-b from-[#3a8b5c] to-[#cfe8da] blur-[6rem]" />
      </div>

      <Container className="relative z-10 pt-16 pb-20 text-center">
        <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur">
          <span className="text-sm font-medium text-foreground">
            Curated by Oryx concierge
          </span>
          <ArrowRight className="h-4 w-4 text-foreground" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-10"
        >
          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-tight text-foreground md:text-6xl lg:text-7xl">
            Design the journey that matches your pace and palette.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            From dune sanctuaries to coastal charters, Oryx crafts bespoke
            experiences with a private guide, curated dining, and seamless
            transfers.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/personalized"
              className={buttonVariants({
                className: "h-12 rounded-full px-8 text-base",
              })}
            >
              Plan a journey
            </Link>
            <Link
              href="/tours"
              className={buttonVariants({
                variant: "outline",
                className: "h-12 rounded-full px-8 text-base",
              })}
            >
              Explore signature tours <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-16 w-full max-w-3xl text-left">
          <SearchBar />
        </div>
      </Container>
    </section>
  );
};

export { Hero2 };
