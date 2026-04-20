import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white/70 p-6 shadow-[0_18px_40px_-24px_rgba(92,70,39,0.45)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
