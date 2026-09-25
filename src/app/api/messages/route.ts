import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const phoneSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => {
    if (!v) return true;
    const digits = v.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
  }, "Telefon 10–13 rakam olmalı")
  .refine((v) => {
    if (!v) return true;
    return /^[\d+\s()-]+$/.test(v) || /^\+?\d+$/.test(v.replace(/[\s()-]/g, ""));
  }, "Telefonda sadece rakam kullanılabilir");

const schema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalı").max(80),
  email: z.string().trim().email("Geçerli bir e-posta gir"),
  phone: phoneSchema,
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
