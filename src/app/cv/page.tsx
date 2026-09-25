import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { requireProfile } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/prefs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CV",
};

export default async function CvPage() {
  const profile = await requireProfile();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-clay">{dict.cv}</p>
          <h1 className="font-heading mt-2 text-4xl text-ink">{profile.name}</h1>
        </div>
        <PrintButton label={dict.printCv} />
      </div>

      <article className="rounded-3xl border border-border bg-card p-6 text-ink shadow-sm sm:p-10">
        <header className="border-b border-border pb-6">
          <h2 className="font-heading text-3xl">{profile.name}</h2>
          <p className="mt-1 text-clay">{profile.title}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {profile.location}
            {profile.email ? ` · ${profile.email}` : ""}
            {profile.phone ? ` · ${profile.phone}` : ""}
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{profile.bio}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {profile.githubUrl ? (
              <a href={profile.githubUrl} className="text-clay hover:underline">
                GitHub
              </a>
            ) : null}
            {profile.linkedinUrl ? (
              <a href={profile.linkedinUrl} className="text-clay hover:underline">
                LinkedIn
              </a>
            ) : null}
            <Link href="/" className="text-clay hover:underline no-print">
              Portfolio
            </Link>
          </div>
        </header>

        <section className="mt-8">
          <h3 className="font-heading text-xl">{dict.skills}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <li key={s.id} className="rounded-full border border-border px-3 py-1 text-sm">
                {s.name}
                {s.level ? ` · ${s.level}` : ""}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h3 className="font-heading text-xl">{dict.education}</h3>
          <ul className="mt-4 space-y-4">
            {profile.experiences.map((e) => (
              <li key={e.id}>
                <p className="text-sm text-muted-foreground">
                  {e.startYear}
                  {e.endYear ? `–${e.endYear}` : "–"}
                </p>
                <p className="font-medium">
                  {e.organization} — {e.role}
                </p>
                {e.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h3 className="font-heading text-xl">{dict.projects}</h3>
          <ul className="mt-4 space-y-5">
            {profile.projects.map((p) => (
              <li key={p.id}>
                <p className="font-medium">
                  {p.title} <span className="text-muted-foreground">({p.year})</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.technologies.map((t) => t.technology.name).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
