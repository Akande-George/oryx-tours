import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { BookingFlow } from "@/components/organisms/BookingFlow";
import { BookingHub } from "@/components/organisms/BookingHub";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTourBySlug } from "@/lib/supabase/data";
import { formatDuration } from "@/lib/format";
import type { ServiceType } from "@/types";

const isServiceType = (value: string | undefined): value is ServiceType =>
  value === "airport" || value === "local" || value === "point-to-point";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; tour?: string }>;
}) {
  const { type, tour: tourSlug } = await searchParams;

  if (tourSlug) {
    const supabase = await createSupabaseServerClient();
    const tour = await getTourBySlug(supabase, tourSlug);
    if (tour) {
      return (
        <div className="py-12">
          <Container className="space-y-8">
            <SectionHeading
              title={`Book ${tour.title}`}
              subtitle={`${tour.location} · ${formatDuration(tour)} · ${tour.groupSize}`}
            />
            <BookingFlow tour={tour} />
          </Container>
        </div>
      );
    }
  }

  const initialType: ServiceType = isServiceType(type) ? type : "airport";

  return (
    <div className="py-12">
      <Container className="space-y-8">
        <SectionHeading
          title="Book your experience"
          subtitle="Airport transfers, day hire, and point-to-point rides - all in one place."
        />
        <BookingHub initialType={initialType} />
      </Container>
    </div>
  );
}
