import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const fail = (msg: string) =>
    NextResponse.redirect(
      new URL(`/iletisim?hata=${encodeURIComponent(msg)}`, request.url),
      303,
    );

  if (name.length < 2) return fail("Ad en az 2 karakter olmalı");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Geçerli bir e-posta gir");
  if (phone.length < 10 || phone.length > 11) {
    return fail("Telefon zorunlu · sadece 10–11 rakam (örn. 05421234567)");
  }
  if (subject.length < 2) return fail("Konu gerekli");
  if (body.length < 10) return fail("Mesaj en az 10 karakter olmalı");

  await prisma.message.create({
    data: { name, email, phone, subject, body },
  });

  return NextResponse.redirect(new URL("/iletisim?ok=1", request.url), 303);
}
