import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVisitCount } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/giris");
  }

  const [messages, projects, skills, experiences, visitCount] = await Promise.all([
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
      include: { technologies: { include: { technology: true } } },
    }),
    prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }),
    getVisitCount(),
  ]);

  return (
    <AdminDashboard
      visitCount={visitCount}
      messages={messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      }))}
      projects={projects}
      skills={skills}
      experiences={experiences}
    />
  );
}
