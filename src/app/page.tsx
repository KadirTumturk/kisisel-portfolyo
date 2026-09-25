import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { buttonVariants } from "@/components/ui/button";
import { requireProfile } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profile = await requireProfile();
  const featured = profile.projects.filter((p) => p.featured);
  const projects = featured.length ? featured : profile.projects.slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
        <div>
          <p className="animate-fade text-sm uppercase tracking-[0.2em] text-clay">
            {profile.location}
          </p>
          <h1 className="animate-rise font-heading mt-3 text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <div className="animate-draw mt-5 h-px w-24 bg-clay delay-1" />
          <p className="animate-rise delay-1 mt-5 font-heading text-2xl text-clay sm:text-3xl">
            {profile.title}
          </p>
        </div>
        <div className="animate-rise delay-2 space-y-6">
          <p className="text-lg leading-relaxed text-muted-foreground">{profile.bio}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className={cn(buttonVariants(), "bg-clay hover:bg-clay/90")}
            >
              Bana ulaş
            </Link>
            <Link href="/projeler" className={cn(buttonVariants({ variant: "outline" }))}>
              Projeleri gör
            </Link>
            {profile.githubUrl ? (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                GitHub
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-20 sm:mt-28">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-clay">Seçili işler</p>
            <h2 className="font-heading mt-2 text-3xl text-ink sm:text-4xl">Projeler</h2>
          </div>
          <Link href="/projeler" className="text-sm text-muted-foreground hover:text-clay">
            Tümü →
          </Link>
        </div>
        <div>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              slug={project.slug}
              summary={project.summary}
              year={project.year}
              featured={project.featured}
              technologies={project.technologies}
            />
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-10 border-t border-border pt-12 sm:mt-28 lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-clay">Yetenekler</p>
          <h2 className="font-heading mt-2 text-3xl text-ink">Ne ile çalışıyorum</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <li
                key={skill.id}
                className="border border-border bg-card/40 px-3 py-1.5 text-sm text-ink"
              >
                {skill.name}
                {skill.level ? (
                  <span className="ml-2 text-muted-foreground">· {skill.level}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-clay">Eğitim</p>
          <h2 className="font-heading mt-2 text-3xl text-ink">Yolculuk</h2>
          <ul className="mt-6 space-y-5">
            {profile.experiences.map((exp) => (
              <li key={exp.id} className="border-l-2 border-clay/40 pl-4">
                <p className="text-sm text-muted-foreground">
                  {exp.startYear}
                  {exp.endYear ? `–${exp.endYear}` : "–"}
                </p>
                <p className="font-medium text-ink">{exp.organization}</p>
                <p className="text-muted-foreground">{exp.role}</p>
              </li>
            ))}
          </ul>
          <Link href="/hakkinda" className="mt-4 inline-block text-sm text-clay hover:underline">
            Daha fazla →
          </Link>
        </div>
      </section>
    </div>
  );
}
