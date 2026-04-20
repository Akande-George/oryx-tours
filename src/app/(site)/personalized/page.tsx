import { ActionButton, Input } from "@/components/atoms";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Textarea } from "@/components/ui/textarea";

export default function PersonalizedPage() {
  return (
    <div className="py-12">
      <Container className="space-y-10">
        <SectionHeading
          title="Personalized tour design"
          subtitle="Share your vision and our concierge will craft the itinerary."
        />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Name" />
              <Input placeholder="Email" />
              <Input placeholder="Preferred destination" />
              <Input placeholder="Ideal travel window" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Estimated budget" />
              <Input placeholder="Travel party size" />
            </div>
            <Textarea
              placeholder="Describe the experiences you want: wellness, dining, adventure, celebrations, or cultural immersion."
              className="min-h-[140px]"
            />
            <ActionButton
              label="Submit request"
              className="rounded-full"
              action="navigate"
              href="/dashboard"
              message="Your request was sent to the concierge team."
            />
          </div>
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 text-sm text-muted-foreground shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              What happens next
            </p>
            <p>
              A dedicated concierge will reach out within 24 hours with a
              proposed itinerary, private transfers, and curated dining options.
            </p>
            <p>
              You will receive a digital briefing with mood boards, lodging
              recommendations, and a flexible payment schedule.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
