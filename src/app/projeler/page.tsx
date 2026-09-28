import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/data";
import { contentEn, getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/prefs";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { title: dict.projects };
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
      <p className="section-label">{dict.portfolio}</p>
      <h1 className="font-heading mt-2 text-4xl text-ink sm:text-5xl">{dict.projects}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{dict.projectsLead}</p>
      <div className="mt-12">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">{dict.noProjects}</p>
        ) : (
          projects.map((project) => {
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
          })
        )}
      </div>
    </div>
  );
}
