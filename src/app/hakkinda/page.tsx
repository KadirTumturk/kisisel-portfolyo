import { requireProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hakkında",
};

export default async function AboutPage() {
  const profile = await requireProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <p className="text-sm uppercase tracking-[0.18em] text-clay">Hakkında</p>
      <h1 className="font-heading mt-2 text-4xl text-ink sm:text-5xl">{profile.name}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{profile.bio}</p>

      <section className="mt-14">
        <h2 className="font-heading text-2xl text-ink">Eğitim & deneyim</h2>
        <ol className="mt-8 space-y-8">
          {profile.experiences.map((exp) => (
            <li key={exp.id} className="grid gap-2 border-l-2 border-clay/50 pl-5 sm:grid-cols-[7rem_1fr]">
              <span className="text-sm text-muted-foreground">
                {exp.startYear}
                {exp.endYear ? `–${exp.endYear}` : "–"}
              </span>
              <div>
                <p className="font-medium text-ink">{exp.organization}</p>
                <p className="text-clay">{exp.role}</p>
                {exp.description ? (
                  <p className="mt-2 text-muted-foreground">{exp.description}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="font-heading text-2xl text-ink">Yetenekler</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {profile.skills.map((skill) => (
            <li key={skill.id} className="border border-border bg-card/40 px-4 py-3">
              <p className="font-medium text-ink">{skill.name}</p>
              <p className="text-sm text-muted-foreground">
                {[skill.category, skill.level].filter(Boolean).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
        <p>{profile.location}</p>
        <p>
          <a className="hover:text-clay" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          {profile.phone ? ` · ${profile.phone}` : null}
        </p>
      </section>
    </div>
  );
}
