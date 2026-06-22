import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";

export const metadata: Metadata = {
  title: "Terms & Conditions · Oryx Group",
  description:
    "Service terms covering vehicle standards, inclusions, child policy, waiting time, and rate adjustments.",
};

type Clause = {
  title: string;
  body: string;
};

const clauses: Clause[] = [
  {
    title: "Child policy",
    body: "Children under 10 years of age travel free of charge. Children over 10 are charged at the standard rate.",
  },
  {
    title: "Service area",
    body: "The published rates are valid exclusively within Doha city limits. Trips outside this area are quoted separately.",
  },
  {
    title: "Waiting time",
    body: "For arrival transfers, the first hour of waiting is complimentary. Any additional waiting time is billed as an extra charge.",
  },
  {
    title: "Vehicle standards",
    body: "All fleet vehicles are maintained at a high standard and are no more than 3 years old.",
  },
  {
    title: "Inclusions",
    body: "Rates include fuel, comprehensive insurance (covering vehicle, passengers, and chauffeur), and all currently applicable taxes.",
  },
  {
    title: "Service guarantee",
    body: "In the event of a breakdown or accident, a replacement vehicle will be dispatched immediately.",
  },
  {
    title: "Vehicle environment",
    body: "Smoking is strictly prohibited inside all vehicles.",
  },
  {
    title: "Rate adjustments",
    body: "Rates are subject to change during special events or peak periods in Qatar.",
  },
  {
    title: "Tax status",
    body: "All quoted rates are currently tax-free.",
  },
];

export default function TermsPage() {
  return (
    <div className="py-12">
      <Container className="max-w-3xl space-y-10">
        <SectionHeading
          title="Terms & Conditions"
          subtitle="The conditions under which Oryx Group provides chauffeur, transfer, and tour services in Doha."
        />

        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          <span className="font-medium text-foreground">
            {new Date().toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>

        <ol className="space-y-6">
          {clauses.map((clause, index) => (
            <li
              key={clause.title}
              className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-heading text-lg font-semibold">
                    {clause.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {clause.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] p-5 text-sm text-muted-foreground">
          Questions about these terms? Email{" "}
          <a
            href="mailto:info@oryxgp.com"
            className="font-medium text-primary hover:underline"
          >
            info@oryxgp.com
          </a>{" "}
          and our team will get back to you.
        </div>
      </Container>
    </div>
  );
}
