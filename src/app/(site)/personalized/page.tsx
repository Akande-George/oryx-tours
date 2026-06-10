"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Bed,
  CalendarDays,
  CheckCircle2,
  Compass,
  DollarSign,
  Gauge,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todayISO } from "@/lib/format";
import { cn } from "@/lib/utils";

type Experience =
  | "wellness"
  | "adventure"
  | "culture"
  | "cuisine"
  | "wildlife"
  | "celebration";

type BudgetTier = "comfort" | "premium" | "signature";
type Pace = "slow" | "balanced" | "packed";
type Lodging = "boutique" | "resort" | "villa" | "tented";

type FormState = {
  destination: string;
  startDate: string;
  endDate: string;
  partySize: number;
  experiences: Experience[];
  budget: BudgetTier;
  budgetAmount: string;
  pace: Pace;
  lodging: Lodging;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const initialState: FormState = {
  destination: "",
  startDate: "",
  endDate: "",
  partySize: 2,
  experiences: [],
  budget: "premium",
  budgetAmount: "",
  pace: "balanced",
  lodging: "boutique",
  name: "",
  email: "",
  phone: "",
  notes: "",
};

const experienceOptions: Array<{
  value: Experience;
  label: string;
  hint: string;
}> = [
  { value: "wellness", label: "Wellness", hint: "Spas, retreats, slow days." },
  {
    value: "adventure",
    label: "Adventure",
    hint: "Trekking, diving, dunes, climbs.",
  },
  {
    value: "culture",
    label: "Culture",
    hint: "Heritage sites, art, local makers.",
  },
  { value: "cuisine", label: "Cuisine", hint: "Chef tables, markets, tastings." },
  {
    value: "wildlife",
    label: "Wildlife",
    hint: "Reserves, safaris, marine life.",
  },
  {
    value: "celebration",
    label: "Celebration",
    hint: "Anniversaries, proposals, milestones.",
  },
];

const budgetOptions: Array<{
  value: BudgetTier;
  label: string;
  range: string;
  hint: string;
}> = [
  {
    value: "comfort",
    label: "Comfort",
    range: "$1.5k – $3k pp",
    hint: "Smart hotels and curated essentials.",
  },
  {
    value: "premium",
    label: "Premium",
    range: "$3k – $7k pp",
    hint: "Boutique stays with private guides.",
  },
  {
    value: "signature",
    label: "Signature",
    range: "$7k+ pp",
    hint: "Villas, private jets, full concierge.",
  },
];

const paceOptions: Array<{ value: Pace; label: string; hint: string }> = [
  { value: "slow", label: "Slow", hint: "Long mornings, deep dives." },
  { value: "balanced", label: "Balanced", hint: "1–2 anchor moments per day." },
  { value: "packed", label: "Packed", hint: "See as much as possible." },
];

const lodgingOptions: Array<{ value: Lodging; label: string; hint: string }> = [
  { value: "boutique", label: "Boutique", hint: "Design-led, small hotels." },
  { value: "resort", label: "Resort", hint: "Full-service amenities." },
  { value: "villa", label: "Villa", hint: "Private home, dedicated staff." },
  { value: "tented", label: "Tented camp", hint: "Desert and bush luxury." },
];

const stepMeta = [
  {
    label: "Step 1 of 4",
    title: "Trip basics",
    description:
      "Tell us where, when, and who is traveling — we'll start the canvas.",
  },
  {
    label: "Step 2 of 4",
    title: "Experiences you crave",
    description:
      "Pick the moments that matter. Mix and match — your concierge will weave them together.",
  },
  {
    label: "Step 3 of 4",
    title: "Comfort & rhythm",
    description:
      "Set the tone of the trip: how much you want to spend, where you sleep, and how fast we move.",
  },
  {
    label: "Step 4 of 4",
    title: "Where to send your itinerary",
    description:
      "Share your contact details and any final notes. We'll reply within 24 hours.",
  },
];

export default function PersonalizedPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const toggleExperience = (value: Experience) =>
    setState((prev) => ({
      ...prev,
      experiences: prev.experiences.includes(value)
        ? prev.experiences.filter((item) => item !== value)
        : [...prev.experiences, value],
    }));

  const stepValid = useMemo(() => {
    if (step === 1) {
      return (
        state.destination.trim().length > 1 &&
        state.startDate.length > 0 &&
        state.partySize >= 1
      );
    }
    if (step === 2) {
      return state.experiences.length > 0;
    }
    if (step === 3) {
      return Boolean(state.budget && state.pace && state.lodging);
    }
    if (step === 4) {
      return (
        state.name.trim().length > 1 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)
      );
    }
    return true;
  }, [step, state]);

  const handleNext = () => {
    if (!stepValid) return;
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const meta = stepMeta[step - 1];

  return (
    <div className="relative py-12 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_15%_10%,rgba(58,139,92,0.14),transparent_60%),radial-gradient(45%_45%_at_85%_85%,rgba(107,15,42,0.12),transparent_70%)]"
      />
      <Container className="space-y-10">
        <SectionHeading
          title="Personalized tour design"
          subtitle="Four quick steps. We'll send a tailored itinerary within 24 hours."
        />

        <div className="flex justify-center">
          <MultiStepForm
              currentStep={step}
              totalSteps={4}
              stepLabel={meta.label}
              title={meta.title}
              description={meta.description}
              onBack={handleBack}
              onNext={handleNext}
              nextDisabled={!stepValid || submitting}
              nextButtonText={
                submitting
                  ? "Sending..."
                  : step === 4
                    ? "Send to concierge"
                    : "Next step"
              }
              size="lg"
              footerContent={
                <a
                  href="mailto:concierge@oryx.test"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Talk to a concierge instead
                  <ArrowUpRight className="size-3.5" />
                </a>
              }
            >
              {step === 1 ? (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="destination">Where to?</Label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="destination"
                          value={state.destination}
                          onChange={(e) =>
                            update("destination", e.target.value)
                          }
                          placeholder="Cairo, Marrakech, Maldives..."
                          className="h-11 pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partySize">Number of guests</Label>
                      <Select
                        value={String(state.partySize)}
                        onValueChange={(value) =>
                          update("partySize", Number(value))
                        }
                      >
                        <SelectTrigger
                          id="partySize"
                          className="h-11 w-full justify-between rounded-lg pl-9 [&>svg]:size-4"
                        >
                          <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (count) => (
                              <SelectItem key={count} value={String(count)}>
                                {count} {count === 1 ? "guest" : "guests"}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start date</Label>
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="startDate"
                          type="date"
                          min={todayISO()}
                          value={state.startDate}
                          onChange={(e) => update("startDate", e.target.value)}
                          className="h-11 pl-9 [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End date</Label>
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="endDate"
                          type="date"
                          min={state.startDate || todayISO()}
                          value={state.endDate}
                          onChange={(e) => update("endDate", e.target.value)}
                          className="h-11 pl-9 [&::-webkit-calendar-picker-indicator]:opacity-0"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
                    Not sure on dates? Leave the end date blank — we&apos;ll
                    suggest an ideal window for the season.
                  </p>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {experienceOptions.map((option) => {
                      const active = state.experiences.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleExperience(option.value)}
                          className={cn(
                            "group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                            active
                              ? "border-primary bg-primary/10 shadow-sm"
                              : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30 bg-background",
                            )}
                          >
                            {active ? (
                              <CheckCircle2 className="size-4" />
                            ) : null}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {option.hint}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selected {state.experiences.length} of{" "}
                    {experienceOptions.length} — choose at least one.
                  </p>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-muted-foreground" />
                      <Label className="text-sm font-semibold">
                        Budget tier
                      </Label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {budgetOptions.map((option) => {
                        const active = state.budget === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => update("budget", option.value)}
                            className={cn(
                              "flex flex-col items-start rounded-2xl border p-4 text-left transition-all",
                              active
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                            )}
                          >
                            <span className="text-sm font-semibold">
                              {option.label}
                            </span>
                            <span className="mt-0.5 text-xs font-medium text-primary">
                              {option.range}
                            </span>
                            <span className="mt-1.5 text-xs text-muted-foreground">
                              {option.hint}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="budgetAmount"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Or share an exact figure (optional)
                      </Label>
                      <Input
                        id="budgetAmount"
                        value={state.budgetAmount}
                        onChange={(e) =>
                          update("budgetAmount", e.target.value)
                        }
                        placeholder="e.g. $8,000 total"
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Bed className="size-4 text-muted-foreground" />
                        <Label className="text-sm font-semibold">
                          Lodging style
                        </Label>
                      </div>
                      <div className="grid gap-2">
                        {lodgingOptions.map((option) => {
                          const active = state.lodging === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => update("lodging", option.value)}
                              className={cn(
                                "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors",
                                active
                                  ? "border-primary bg-primary/10"
                                  : "border-border bg-background hover:border-primary/40",
                              )}
                            >
                              <span>
                                <span className="block text-sm font-medium">
                                  {option.label}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {option.hint}
                                </span>
                              </span>
                              {active ? (
                                <CheckCircle2 className="size-4 text-primary" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Gauge className="size-4 text-muted-foreground" />
                        <Label className="text-sm font-semibold">Pace</Label>
                      </div>
                      <div className="grid gap-2">
                        {paceOptions.map((option) => {
                          const active = state.pace === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => update("pace", option.value)}
                              className={cn(
                                "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors",
                                active
                                  ? "border-primary bg-primary/10"
                                  : "border-border bg-background hover:border-primary/40",
                              )}
                            >
                              <span>
                                <span className="block text-sm font-medium">
                                  {option.label}
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                  {option.hint}
                                </span>
                              </span>
                              {active ? (
                                <CheckCircle2 className="size-4 text-primary" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          value={state.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="Your name"
                          className="h-11 pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={state.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@example.com"
                          className="h-11 pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={state.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="+1 555 0100"
                          className="h-11 pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Anything else?</Label>
                    <Textarea
                      id="notes"
                      value={state.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Dietary needs, celebrations, mobility requests, special anchors..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      Trip recap
                    </p>
                    <p className="mt-1">
                      {state.destination || "Destination TBD"} ·{" "}
                      {state.partySize}{" "}
                      {state.partySize === 1 ? "guest" : "guests"} ·{" "}
                      {state.experiences.length || "0"} experience
                      {state.experiences.length === 1 ? "" : "s"} ·{" "}
                      {budgetOptions.find((b) => b.value === state.budget)?.label}{" "}
                      tier
                    </p>
                  </div>
                </div>
              ) : null}
          </MultiStepForm>
        </div>

        <section aria-labelledby="what-happens-next" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                The concierge process
              </p>
              <h3
                id="what-happens-next"
                className="font-heading text-2xl font-semibold sm:text-3xl"
              >
                What happens next
              </h3>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              From brief to boarding pass — here&apos;s how your trip comes
              together once you hit send.
            </p>
          </div>

          <ol className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                eyebrow: "Within 24 hours",
                title: "We read your brief",
                copy: "A dedicated concierge reviews every detail and reaches out with first questions and direction.",
              },
              {
                icon: Sparkles,
                eyebrow: "Days 2 – 4",
                title: "Mood board & shortlist",
                copy: "You receive a curated lodging shortlist, anchor experiences, and a flexible payment schedule.",
              },
              {
                icon: Plane,
                eyebrow: "Ready to fly",
                title: "Refined & confirmed",
                copy: "We refine together on a call. Once confirmed, every transfer, table, and door is handled end-to-end.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.4)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(92,70,39,0.55)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-125"
                  />
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-heading text-3xl font-semibold text-muted-foreground/30 tabular-nums">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                      {item.eyebrow}
                    </p>
                    <h4 className="font-heading text-lg font-semibold leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.copy}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/[0.06] p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Compass className="size-4" />
              </span>
              <p className="text-sm text-muted-foreground">
                Prefer to talk it through?{" "}
                <span className="font-medium text-foreground">
                  Speak with a concierge before submitting.
                </span>
              </p>
            </div>
            <a
              href="mailto:concierge@oryx.test"
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Contact concierge
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </section>
      </Container>
    </div>
  );
}
