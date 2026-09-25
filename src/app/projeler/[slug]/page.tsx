import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getProjectBySlug } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <Link href="/projeler" className="text-sm text-muted-foreground hover:text-clay">
        ← Projeler
      </Link>
      <p className="mt-6 text-sm text-muted-foreground">{project.year}</p>
      <h1 className="font-heading mt-2 text-4xl text-ink sm:text-5xl">{project.title}</h1>
      {project.role ? <p className="mt-3 text-clay">{project.role}</p> : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {project.technologies.map((t) => (
          <span
            key={t.technology.name}
            className="border border-border px-2 py-0.5 text-xs text-muted-foreground"
          >
            {t.technology.name}
          </span>
        ))}
      </div>
      <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{project.summary}</p>
      <div className="prose-p:leading-relaxed mt-6 space-y-4 text-base leading-relaxed text-ink/90">
        {project.description.split("\n").map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants(), "bg-clay hover:bg-clay/90")}
          >
            Canlı site
          </a>
        ) : null}
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            GitHub
          </a>
        ) : null}
        {!project.liveUrl && !project.repoUrl ? (
          <p className="text-sm text-muted-foreground">
            Bu proje için canlı link bulunmuyor (ders / yerel demo).
          </p>
        ) : null}
      </div>
    </div>
  );
}
