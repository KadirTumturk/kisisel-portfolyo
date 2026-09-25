import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1),
  level: z.string().optional(),
  category: z.string().optional(),
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
  const skill = await prisma.skill.create({
    data: {
      profileId: profile.id,
      name: parsed.data.name,
      level: parsed.data.level || null,
      category: parsed.data.category || null,
      sortOrder: parsed.data.sortOrder ?? 99,
    },
  });
  return NextResponse.json(skill);
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
  const skill = await prisma.skill.update({
    where: { id },
    data: {
      name: parsed.data.name,
      level: parsed.data.level || null,
      category: parsed.data.category || null,
      sortOrder: parsed.data.sortOrder ?? 99,
    },
  });
  return NextResponse.json(skill);
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await request.json();
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
