import Link from "next/link";
import Image from "next/image";
import { ProjectCard } from "@/components/project-card";
import { buttonVariants } from "@/components/ui/button";
import { requireProfile } from "@/lib/data";
import {
  contentEn,
  getDictionary,
  localizeExperience,
  localizeLevel,
  localizeSkillName,
} from "@/lib/i18n";
import { getLocale } from "@/lib/prefs";
import { trackVisit } from "@/lib/stats";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await trackVisit();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const profile = await requireProfile();
  const featured = profile.projects.filter((p) => p.featured);
  const projects = featured.length ? featured : profile.projects.slice(0, 2);

  const title = locale === "en" ? contentEn.title : profile.title;
  const bio = locale === "en" ? contentEn.bio : profile.bio;
  const location = locale === "en" ? contentEn.location : profile.location;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-20">
          <div className="relative z-10">
            <p className="section-label">
              {location} · {dict.heroBadge}
            </p>
            <h1 className="font-heading mt-3 text-[clamp(2.75rem,7.5vw,5rem)] leading-[0.94] tracking-tight text-ink">
              {profile.name}
            </h1>
            <div className="animate-draw mt-5 h-[2px] w-14 bg-clay" />
            <p className="mt-5 text-xl font-medium text-ink/85 sm:text-2xl">{title}</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {bio}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link
                href="/iletisim"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-md bg-clay px-5 text-primary-foreground hover:bg-clay/90",
                )}
              >
                {dict.reachOut}
              </Link>
              <Link
                href="/projeler"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-md px-5",
                )}
              >
                {dict.seeProjects}
              </Link>
              <Link
                href="/cv"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-md")}
              >
                {dict.downloadCv}
              </Link>
              {profile.githubUrl ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-md")}
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[16rem] lg:mx-0 lg:max-w-none lg:pt-8">
            <Image
              src="/brand/logo.png"
              alt="KT"
              width={512}
              height={512}
              className="aspect-square w-full rounded-xl border border-border object-cover shadow-sm"
              priority
            />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {dict.heroPanelText}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">{dict.selectedWork}</p>
              <h2 className="font-heading mt-1.5 text-3xl tracking-tight text-ink sm:text-4xl">
                {dict.projects}
              </h2>
            </div>
            <Link
              href="/projeler"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-clay"
            >
              {dict.all} →
            </Link>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {projects.map((project) => {
              const en = contentEn.projects[project.slug];
              return (
                <ProjectCard
                  key={project.id}
                  title={locale === "en" && en ? en.title : project.title}
                  slug={project.slug}
                  summary={locale === "en" && en ? en.summary : project.summary}
                  year={project.year}
                  featured={project.featured}
                  technologies={project.technologies}
                  featuredLabel={dict.featured}
                  viewLabel={dict.view}
                />
              );
            })}
          </div>
        </section>

        <section className="mt-20 grid gap-12 sm:mt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="section-label">{dict.skills}</p>
            <h2 className="font-heading mt-1.5 text-3xl tracking-tight text-ink">
              {dict.skillsTitle}
            </h2>
            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {profile.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="border border-border bg-card px-3.5 py-2.5 text-sm text-ink"
                >
                  <span className="font-medium">{localizeSkillName(locale, skill.name)}</span>
                  {skill.level ? (
                    <span className="ml-2 text-muted-foreground">
                      {localizeLevel(locale, skill.level)}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label">{dict.education}</p>
            <h2 className="font-heading mt-1.5 text-3xl tracking-tight text-ink">{dict.journey}</h2>
            <ul className="mt-7 space-y-5">
              {profile.experiences.map((exp) => {
                const localized = localizeExperience(locale, exp);
                return (
                  <li key={exp.id} className="border-l-2 border-border pl-4">
                    <p className="text-sm text-muted-foreground">
                      {exp.startYear}
                      {exp.endYear ? `–${exp.endYear}` : "–"}
                    </p>
                    <p className="mt-1 font-medium text-ink">{localized.organization}</p>
                    <p className="text-muted-foreground">{localized.role}</p>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/hakkinda"
              className="mt-5 inline-block text-sm font-medium text-clay hover:underline"
            >
              {dict.more} →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
