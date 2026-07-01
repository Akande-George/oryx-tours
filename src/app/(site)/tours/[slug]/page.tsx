import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { RatingStars } from "@/components/molecules/RatingStars";
import { BookingSidebar } from "@/components/organisms/BookingSidebar";
import { TourDetailsTabs } from "@/components/organisms/TourDetailsTabs";
import { TourExcerpt } from "@/components/molecules/TourExcerpt";
import { Badge } from "@/components/atoms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getReviews, getTourBySlug } from "@/lib/supabase/data";
import { htmlToPlainText } from "@/lib/rich-text";
import { formatDuration } from "@/lib/format";

// Returns an embeddable URL only for valid YouTube links; otherwise null.
const toYouTubeEmbed = (raw?: string | null): string | null => {
  if (!raw) return null;
  const url = raw.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) return url;
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
};

export default async function TourDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { slug } = await params;
  const { tab } = await searchParams;
  const tour = await getTourBySlug(supabase, slug);

  if (!tour) {
    notFound();
  }

  const globalReviews = await getReviews(supabase);

  // Prefer the tour's own curated reviews; fall back to the shared pool
  // for older tours that don't have any embedded yet.
  const reviews =
    tour.reviews && tour.reviews.length ? tour.reviews : globalReviews;

  const videoEmbed = toYouTubeEmbed(tour.videoUrl);

  return (
    <div className="py-12">
      <Container className="space-y-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full">{tour.category}</Badge>
            <Badge variant="secondary" className="rounded-full">
              {formatDuration(tour)}
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {tour.groupSize}
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{tour.title}</h1>
          <TourExcerpt text={htmlToPlainText(tour.description)} />
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{tour.location}</span>
            <span>•</span>
            <RatingStars rating={tour.rating} />
            <span>{tour.reviewsCount} reviews</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {tour.images.map((src, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${tour.id}-image-${index}`}
                  src={src}
                  alt={`${tour.title} photo ${index + 1}`}
                  className="h-48 w-full rounded-2xl object-cover shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]"
                />
              ))}
            </div>
            {videoEmbed ? (
              <iframe
                src={videoEmbed}
                title={`${tour.title} video`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video w-full rounded-2xl border border-white/60 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]"
              />
            ) : null}
          </div>
          <BookingSidebar tour={tour} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div id="tour-overview" className="space-y-6 scroll-mt-24">
            <SectionHeading
              title="About this experience"
              subtitle="Every detail is curated with a dedicated concierge."
            />
            <TourDetailsTabs
              description={tour.description}
              tags={tour.tags}
              itinerary={tour.itinerary ?? []}
              reviews={reviews}
              defaultTab={
                tab === "itinerary" || tab === "reviews" ? tab : "overview"
              }
            />
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 text-sm text-muted-foreground shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Included
              </p>
              <ul className="mt-3 space-y-2">
                {tour.includes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
