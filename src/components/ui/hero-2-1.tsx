"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { SearchBar } from "@/components/molecules/SearchBar";
import { Container } from "@/components/layout/Container";

const HERO_IMAGES = [
  "/Tours.png",
  "/an-incredible-view-of.jpg",
  "/corniche-022.jpg",
  "/banana-island-resort-058.jpg",
  "/20220127-1643268462-571.jpg",
];

const SLIDE_INTERVAL_MS = 5000;

/* ---------------- Background slider ---------------- */
const HeroSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <AnimatePresence mode="sync">
        <motion.img
          key={index}
          src={HERO_IMAGES[index]}
          alt="Curated Oryx Group journeys"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 6 } }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute right-5 top-6 z-20 flex gap-2">
        {HERO_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </>
  );
};

/* ---------------- WordsPullUp ---------------- */
type WordsPullUpProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

const WordsPullUp = ({ text, className = "", style }: WordsPullUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: 24, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
            style={{ marginRight: isLast ? 0 : "0.18em" }}
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
};

/* ---------------- Hero ---------------- */
const Hero2 = () => {
  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="relative min-h-[88vh] w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        {/* Background slider */}
        <HeroSlider />

        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-overlay" />

        {/* Gradient overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/80"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_15%,rgba(207,160,124,0.28),transparent_60%),radial-gradient(45%_45%_at_10%_90%,rgba(58,139,92,0.25),transparent_70%)]"
        />

        {/* Top badge */}
        <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
            <Sparkles className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-medium text-white/90">
              Curated by Oryx Group
            </span>
          </div>
        </div>

        {/* Hero content - bottom aligned */}
        <Container className="absolute inset-x-0 bottom-0 z-10 px-4 pb-6 sm:px-6 sm:pb-8 md:px-8">
          <div className="grid grid-cols-12 items-end gap-6">
            {/* Big headline */}
            <div className="col-span-12 lg:col-span-7">
              <h1
                className="font-heading font-semibold leading-[0.86] tracking-[-0.04em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
                style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)" }}
              >
                <WordsPullUp text="Oryx Group" />
              </h1>
            </div>

            {/* Right column: copy + CTAs + search */}
            <div className="col-span-12 flex flex-col gap-5 lg:col-span-5 lg:pb-2">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base"
              >
                From dune sanctuaries to coastal charters, Oryx Group crafts
                bespoke experiences with a private guide, curated dining, and
                seamless transfers.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/personalized"
                  className="group inline-flex items-center gap-2 self-start rounded-full bg-[#E1E0CC] py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                >
                  Plan a journey
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight className="h-4 w-4 text-[#E1E0CC]" />
                  </span>
                </Link>
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20 sm:text-base"
                >
                  Explore tours
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Search bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md"
          >
            <SearchBar />
          </motion.div>
        </Container>
      </div>
    </section>
  );
};

export { Hero2, WordsPullUp };
