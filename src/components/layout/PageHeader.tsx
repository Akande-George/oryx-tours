import { Container } from "@/components/layout/Container";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  /** Optional trailing word rendered in an italic accent (e.g. "work."). */
  accent?: string;
  subtitle?: string;
  imageSrc: string;
};

/**
 * Full-bleed page banner: background image with a brand wash, an eyebrow with
 * a decorative rule, a large serif headline (with an optional italic accent
 * word), and a subtitle. Used at the top of section landing pages.
 */
export function PageHeader({
  eyebrow,
  title,
  accent,
  subtitle,
  imageSrc,
}: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Brand wash + gradient for legibility */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#3a1f2a]/85 via-[#2a241a]/70 to-[#3a1f2a]/80"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_10%,rgba(207,160,124,0.22),transparent_60%)]"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl space-y-5">
          {/* Eyebrow with rule */}
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rotate-45 bg-emerald-400" />
            <span className="h-px w-10 bg-white/40" />
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              {eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl font-semibold leading-[0.95] tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
            {title}
            {accent ? (
              <>
                {" "}
                <span className="font-serif italic text-emerald-300">
                  {accent}
                </span>
              </>
            ) : null}
          </h1>

          {subtitle ? (
            <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {subtitle}
            </p>
          ) : null}

          {/* Decorative bottom rule */}
          <div className="flex items-center gap-2 pt-2">
            <span className="h-px w-12 bg-white/30" />
            <span className="h-1.5 w-1.5 rotate-45 bg-emerald-400/80" />
            <span className="h-px w-16 bg-white/20" />
          </div>
        </div>
      </Container>
    </section>
  );
}
