"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand-tinted gradient palettes rotated by index so every category card in
// the grid feels distinct while staying on-palette.
const palettes = [
  {
    gradient: "from-amber-100 to-orange-200/60",
    badge: "#d97706",
    glyph: "text-amber-500/30",
  },
  {
    gradient: "from-emerald-100 to-teal-200/60",
    badge: "#0d9488",
    glyph: "text-emerald-500/30",
  },
  {
    gradient: "from-rose-100 to-pink-200/55",
    badge: "#be123c",
    glyph: "text-rose-500/30",
  },
  {
    gradient: "from-sky-100 to-indigo-200/55",
    badge: "#4f46e5",
    glyph: "text-sky-500/30",
  },
  {
    gradient: "from-stone-100 to-amber-200/50",
    badge: "#92400e",
    glyph: "text-stone-500/30",
  },
  {
    gradient: "from-violet-100 to-fuchsia-200/55",
    badge: "#7c3aed",
    glyph: "text-violet-500/30",
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
