import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/giris");
  }

  const [messages, projects] = await Promise.all([
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
      include: { technologies: { include: { technology: true } } },
    }),
  ]);

  return (
    <AdminDashboard
      messages={messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      }))}
      projects={projects}
    />
  );
}
