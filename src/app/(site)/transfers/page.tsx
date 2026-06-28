import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BookingHub } from "@/components/organisms/BookingHub";

export default function TransfersPage() {
  return (
    <div>
      <PageHeader
        eyebrow="General logistics"
        title="Airport transfers &"
        accent="local fleet."
        subtitle="Executive pickups with concierge-level coordination across Doha."
        imageSrc="/transfers.jpg"
      />
      <Container className="space-y-10 py-12">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-white/60 bg-white/70 p-6 text-sm text-muted-foreground shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
              Loading booking…
            </div>
          }
        >
          <BookingHub initialType="airport" />
        </Suspense>
      </Container>
    </div>
  );
}
