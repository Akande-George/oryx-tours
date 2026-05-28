import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { BookingHub } from "@/components/organisms/BookingHub";
import type { ServiceType } from "@/types";

const isServiceType = (value: string | undefined): value is ServiceType =>
  value === "airport" || value === "local" || value === "point-to-point";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialType: ServiceType = isServiceType(type) ? type : "airport";

  return (
    <div className="py-12">
      <Container className="space-y-8">
        <SectionHeading
          title="Book your experience"
          subtitle="Airport transfers, day hire, and point-to-point rides — all in one place."
        />
        <BookingHub initialType={initialType} />
      </Container>
    </div>
  );
}
