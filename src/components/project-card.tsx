import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tech = { technology: { name: string } };

export function ProjectCard({
  title,
  slug,
  summary,
  year,
  technologies,
  featured,
}: {
  title: string;
  slug: string;
  summary: string;
  year: number;
  technologies: Tech[];
  featured?: boolean;
}) {
  return (
    <article className="group relative overflow-hidden border-b border-border py-8 first:pt-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{year}</span>
            {featured ? (
              <Badge variant="secondary" className="bg-clay/10 text-clay">
                Öne çıkan
              </Badge>
            ) : null}
          </div>
          <h3 className="font-heading text-2xl tracking-tight text-ink transition-colors group-hover:text-clay sm:text-3xl">
            <Link href={`/projeler/${slug}`}>{title}</Link>
          </h3>
          <p className="text-base leading-relaxed text-muted-foreground">{summary}</p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((t) => (
              <span
                key={t.technology.name}
                className="border border-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {t.technology.name}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={`/projeler/${slug}`}
          className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
        >
          İncele
        </Link>
      </div>
    </article>
  );
}
