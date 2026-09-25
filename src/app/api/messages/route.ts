import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalı").max(80),
  email: z.string().trim().email("Geçerli bir e-posta gir"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Konu gerekli").max(120),
  body: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı").max(2000),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Geçersiz form" },
        { status: 400 },
      );
    }

    const { name, email, phone, subject, body } = parsed.data;
    const message = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        body,
      },
    });

    return NextResponse.json({ ok: true, id: message.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
