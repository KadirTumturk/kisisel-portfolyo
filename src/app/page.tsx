import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { buttonVariants } from "@/components/ui/button";
import { requireProfile } from "@/lib/data";
import { contentEn, getDictionary, localizeLevel } from "@/lib/i18n";
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
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const title = locale === "en" ? contentEn.title : profile.title;
  const bio = locale === "en" ? contentEn.bio : profile.bio;
  const location = locale === "en" ? contentEn.location : profile.location;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <div className="relative z-10">
            <p className="animate-fade text-xs font-medium uppercase tracking-[0.28em] text-clay sm:text-sm">
              {location} · {dict.heroBadge}
            </p>
            <h1 className="animate-rise font-heading mt-4 text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] tracking-tight text-ink">
              {profile.name}
            </h1>
            <div className="animate-draw mt-6 h-[3px] w-16 bg-clay delay-1" />
            <p className="animate-rise delay-1 mt-5 text-xl font-medium text-ink/80 sm:text-2xl">
              {title}
            </p>
            <p className="animate-rise delay-2 mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {bio}
            </p>
            <div className="animate-rise delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/iletisim"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-clay px-5 text-primary-foreground hover:bg-clay/90",
                )}
              >
                {dict.reachOut}
              </Link>
              <Link
                href="/projeler"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-5")}
              >
                {dict.seeProjects}
              </Link>
              <Link href="/cv" className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}>
                {dict.downloadCv}
              </Link>
              {profile.githubUrl ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </div>

          <div className="animate-rise delay-2 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="animate-float hero-panel relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] sm:aspect-[5/6]">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-7 text-white sm:p-9">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.22em] text-white/70">
                    {dict.fullStack}
                  </span>
                  <span className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/80">
                    2025–2027
                  </span>
                </div>
                <div>
                  <p className="font-heading text-7xl leading-none tracking-tight sm:text-8xl">
                    {initials}
                  </p>
                  <p className="mt-4 max-w-[14rem] text-sm leading-relaxed text-white/75">
                    {dict.heroPanelText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
        <section>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-clay">
                {dict.selectedWork}
              </p>
              <h2 className="font-heading mt-2 text-3xl tracking-tight text-ink sm:text-4xl">
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

        <section className="mt-20 grid gap-12 sm:mt-28 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-clay">{dict.skills}</p>
            <h2 className="font-heading mt-2 text-3xl tracking-tight text-ink">
              {dict.skillsTitle}
            </h2>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {profile.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-sm text-ink shadow-[0_1px_0_rgba(11,13,16,0.04)]"
                >
                  {skill.name}
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
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-clay">
              {dict.education}
            </p>
            <h2 className="font-heading mt-2 text-3xl tracking-tight text-ink">{dict.journey}</h2>
            <ul className="mt-7 space-y-6">
              {profile.experiences.map((exp) => (
                <li key={exp.id} className="relative border-l-2 border-clay/30 pl-5">
                  <span className="absolute -left-[5px] top-1.5 size-2 rounded-full bg-clay" />
                  <p className="text-sm text-muted-foreground">
                    {exp.startYear}
                    {exp.endYear ? `–${exp.endYear}` : "–"}
                  </p>
                  <p className="mt-1 font-medium text-ink">
                    {locale === "en" ? contentEn.experience.organization : exp.organization}
                  </p>
                  <p className="text-muted-foreground">
                    {locale === "en" ? contentEn.experience.role : exp.role}
                  </p>
                </li>
              ))}
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
