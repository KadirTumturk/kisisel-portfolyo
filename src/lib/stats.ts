import { prisma } from "@/lib/prisma";

export async function trackVisit() {
  try {
    await prisma.siteStat.upsert({
      where: { id: 1 },
      create: { id: 1, visitCount: 1 },
      update: { visitCount: { increment: 1 } },
    });
  } catch {
    // ignore if table not ready
  }
}

export async function getVisitCount() {
  try {
    const row = await prisma.siteStat.findUnique({ where: { id: 1 } });
    return row?.visitCount ?? 0;
  } catch {
    return 0;
  }
}
