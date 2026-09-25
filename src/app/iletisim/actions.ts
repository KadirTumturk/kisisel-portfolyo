"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitContactAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (name.length < 2) redirect("/iletisim?hata=" + encodeURIComponent("Ad en az 2 karakter olmalı"));
  if (!email.includes("@")) redirect("/iletisim?hata=" + encodeURIComponent("Geçerli bir e-posta gir"));
  if (phone.length < 10 || phone.length > 11) {
    redirect("/iletisim?hata=" + encodeURIComponent("Telefon zorunlu · sadece 10–11 rakam"));
  }
  if (subject.length < 2) redirect("/iletisim?hata=" + encodeURIComponent("Konu gerekli"));
  if (body.length < 10) redirect("/iletisim?hata=" + encodeURIComponent("Mesaj en az 10 karakter olmalı"));

  await prisma.message.create({
    data: { name, email, phone, subject, body },
  });

  redirect("/iletisim?ok=1");
}
