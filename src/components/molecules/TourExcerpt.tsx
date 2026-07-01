"use client";

const EXCERPT_LIMIT = 180;

/**
 * Short, plain-text lead paragraph for the top of a tour page. When the full
 * description is long it is truncated at a word boundary and a "Read more"
 * control smooth-scrolls to the full overview section further down the page.
 */
export function TourExcerpt({
  text,
  targetId = "tour-overview",
}: {
  text: string;
  targetId?: string;
}) {
  const trimmed = text.trim();
  const isLong = trimmed.length > EXCERPT_LIMIT;

  let excerpt = trimmed;
  if (isLong) {
    const slice = trimmed.slice(0, EXCERPT_LIMIT);
    const lastSpace = slice.lastIndexOf(" ");
    excerpt = `${(lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
  }

  const scrollToOverview = () => {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
      {excerpt}
      {isLong ? (
        <button
          type="button"
          onClick={scrollToOverview}
          className="ml-1 font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Read more
        </button>
      ) : null}
    </p>
  );
}
