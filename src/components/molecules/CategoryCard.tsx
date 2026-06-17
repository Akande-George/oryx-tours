import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type CategoryCardProps = {
  title: string;
  description: string;
  href?: string;
};

export function CategoryCard({ title, description, href }: CategoryCardProps) {
  const targetHref =
    href ?? `/tours?category=${encodeURIComponent(title)}`;

  return (
    <Link href={targetHref} className="block">
      <Card className="group cursor-pointer border-white/60 bg-white/80 shadow-[0_20px_40px_-30px_rgba(92,70,39,0.35)] transition-all duration-300 hover:-translate-y-1">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{title}</h3>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
