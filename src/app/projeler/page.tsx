import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projeler",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
      <p className="text-sm uppercase tracking-[0.18em] text-clay">Portfolyo</p>
      <h1 className="font-heading mt-2 text-4xl text-ink sm:text-5xl">Projeler</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Web arayüzleri, ders laboratuvarları ve C++ uygulamalarından seçilmiş çalışmalar.
      </p>
      <div className="mt-12">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">Henüz proje yok.</p>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              slug={project.slug}
              summary={project.summary}
              year={project.year}
              featured={project.featured}
              technologies={project.technologies}
            />
          ))
        )}
      </div>
    </div>
  );
}
