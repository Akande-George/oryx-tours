import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { BookingHub } from "@/components/organisms/BookingHub";
import type { ServiceType } from "@/types";

const isServiceType = (value: string | undefined): value is ServiceType =>
  value === "tour" || value === "airport" || value === "local";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string; type?: string }>;
}) {
  const { tour, type } = await searchParams;
  const initialType: ServiceType = isServiceType(type) ? type : "tour";

  return (
    <div className="py-12">
      <Container className="space-y-8">
        <SectionHeading
          title="Book your experience"
          subtitle="Choose tours, airport transfers, or local transport — all in one place."
        />
        <BookingHub initialType={initialType} initialTourSlug={tour} />
      </Container>
    </div>
  );
}
