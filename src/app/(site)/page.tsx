import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { DestinationCard } from "@/components/molecules/DestinationCard";
import { FeaturedTours } from "@/components/organisms/FeaturedTours";
import { Hero2 } from "@/components/ui/hero-2-1";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getCategories,
  getDestinations,
  getTours,
} from "@/lib/supabase/data";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const [tours, destinations, categoriesRaw] = await Promise.all([
    getTours(supabase),
    getDestinations(supabase),
    getCategories(supabase),
  ]);

  const categories = [...categoriesRaw].sort((a, b) => {
    const ao = a.order ?? 0;
    const bo = b.order ?? 0;
    if (ao !== bo) return ao - bo;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="flex flex-col gap-16">
      <Hero2 />
      <FeaturedTours tours={tours.slice(0, 3)} />

      <section className="py-4">
        <Container className="space-y-10">
          <SectionHeading
            title="Categories for every tempo"
            subtitle="Select a travel rhythm that matches your mood and timeline."
          />
          {categories.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.title}
                  description={category.description}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No categories defined yet.
            </p>
          )}
        </Container>
      </section>

      <section className="py-4">
        <Container className="space-y-10">
          <SectionHeading
            title="Popular destinations"
            subtitle="Explore signature regions loved by returning travelers."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-[#f7e6c8] via-[#f8f2e6] to-[#f1d1aa] p-10 shadow-[0_24px_60px_-32px_rgba(92,70,39,0.5)]">
          <div className="absolute right-6 top-6 hidden h-28 w-28 rounded-full bg-white/60 blur-2xl lg:block" />
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Personalized tours
            </p>
            <h2 className="text-3xl font-semibold">
              Tell us your ideal journey. We will design every moment.
            </h2>
            <p className="text-base text-muted-foreground">
              From private air transfers to curated wellness rituals, your
              concierge tailors each day to your pace.
            </p>
            <Link
              href="/personalized"
              className={buttonVariants({ className: "rounded-full" })}
            >
              Start planning
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
