"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

// Gradient palettes built from the Oryx brand colors (green #3a8b5c,
// maroon #6b0f2a, mint #cfe8da, sand #cfa07c, cream #efd9bf) and rotated by
// index so every category card feels distinct while staying on-brand.
const palettes = [
  {
    // Brand green → mint
    gradient: "from-[#e3f1e8] to-[#cfe8da]",
    badge: "#3a8b5c",
    glyph: "text-[#3a8b5c]/20",
  },
  {
    // Brand maroon
    gradient: "from-[#f5e1e7] to-[#e7cfd6]",
    badge: "#6b0f2a",
    glyph: "text-[#6b0f2a]/20",
  },
  {
    // Brand sand / cream
    gradient: "from-[#f4e7d7] to-[#efd9bf]",
    badge: "#b07a4f",
    glyph: "text-[#cfa07c]/30",
  },
  {
    // Deep mint / teal-green
    gradient: "from-[#d8efe4] to-[#bfe0d0]",
    badge: "#2f6b4f",
    glyph: "text-[#2f6b4f]/20",
  },
];

type CategoryCardProps = {
  title: string;
  description: string;
  href?: string;
  index?: number;
};

export function CategoryCard({
  title,
  description,
  href,
  index = 0,
}: CategoryCardProps) {
  const targetHref = href ?? `/tours?category=${encodeURIComponent(title)}`;
  const palette = palettes[index % palettes.length];

  return (
    <motion.div
      initial={{ scale: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="h-full"
    >
      <Link href={targetHref} className="block h-full">
        <div
          className={cn(
            "group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)] transition-shadow duration-300 hover:shadow-[0_26px_52px_-30px_rgba(92,70,39,0.5)]",
            palette.gradient,
          )}
        >
          {/* Decorative glyph, bottom-right */}
          <Compass
            aria-hidden
            className={cn(
              "pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 rotate-12 transition-transform duration-500 group-hover:rotate-[18deg] group-hover:scale-110",
              palette.glyph,
            )}
          />

          <div className="relative z-10 flex h-full flex-col">
            {/* Badge */}
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/50 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: palette.badge }}
              />
              Category
            </div>

            {/* Title + description */}
            <div className="flex-grow">
              <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
              <p className="max-w-xs text-sm text-foreground/70">
                {description}
              </p>
            </div>

            {/* CTA */}
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              Explore tours
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
