import { prisma } from "@/lib/prisma";

export async function getProfile() {
  return prisma.profile.findFirst({
    include: {
      skills: { orderBy: { sortOrder: "asc" } },
      experiences: { orderBy: { sortOrder: "asc" } },
      projects: {
        orderBy: { sortOrder: "asc" },
        include: {
          technologies: { include: { technology: true } },
        },
      },
    },
  });
}

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      technologies: { include: { technology: true } },
    },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      technologies: { include: { technology: true } },
      profile: true,
    },
  });
}

export async function requireProfile() {
  const profile = await getProfile();
  if (!profile) {
    throw new Error("Profil bulunamadı. Önce `npm run db:seed` çalıştırın.");
  }
  return profile;
}
