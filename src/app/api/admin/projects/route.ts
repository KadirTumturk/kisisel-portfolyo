import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "slug sadece küçük harf, sayı ve tire"),
  summary: z.string().min(10),
  description: z.string().min(10),
  year: z.coerce.number().int().min(2000).max(2100),
  role: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  technologies: z.string().optional(),
});

async function syncTechnologies(projectId: string, csv?: string) {
  await prisma.projectTechnology.deleteMany({ where: { projectId } });
  if (!csv?.trim()) return;
  const names = csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const name of names) {
    const tech = await prisma.technology.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    await prisma.projectTechnology.create({
      data: { projectId, technologyId: tech.id },
    });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    return NextResponse.json({ error: "Profil yok" }, { status: 400 });
  }
  const parsed = projectSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const data = parsed.data;
  const project = await prisma.project.create({
    data: {
      profileId: profile.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      year: data.year,
      role: data.role || null,
      liveUrl: data.liveUrl || null,
      repoUrl: data.repoUrl || null,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 99,
    },
  });
  await syncTechnologies(project.id, data.technologies);
  return NextResponse.json(project);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = await request.json();
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const data = parsed.data;
  const project = await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      year: data.year,
      role: data.role || null,
      liveUrl: data.liveUrl || null,
      repoUrl: data.repoUrl || null,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 99,
    },
  });
  await syncTechnologies(project.id, data.technologies);
  return NextResponse.json(project);
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await request.json();
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
