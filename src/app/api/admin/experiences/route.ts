import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  organization: z.string().min(1),
  role: z.string().min(1),
  description: z.string().optional(),
  type: z.string().default("education"),
  startYear: z.coerce.number().int(),
  endYear: z.coerce.number().int().optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const profile = await prisma.profile.findFirst();
  if (!profile) return NextResponse.json({ error: "Profil yok" }, { status: 400 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const item = await prisma.experience.create({
    data: {
      profileId: profile.id,
      organization: parsed.data.organization,
      role: parsed.data.role,
      description: parsed.data.description || null,
      type: parsed.data.type || "education",
      startYear: parsed.data.startYear,
      endYear: parsed.data.endYear ?? null,
      sortOrder: parsed.data.sortOrder ?? 99,
    },
  });
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = await request.json();
  const id = String(body.id ?? "");
  const parsed = schema.safeParse(body);
  if (!id || !parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const item = await prisma.experience.update({
    where: { id },
    data: {
      organization: parsed.data.organization,
      role: parsed.data.role,
      description: parsed.data.description || null,
      type: parsed.data.type || "education",
      startYear: parsed.data.startYear,
      endYear: parsed.data.endYear ?? null,
      sortOrder: parsed.data.sortOrder ?? 99,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await request.json();
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
