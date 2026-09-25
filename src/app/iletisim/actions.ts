"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export async function submitContactAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const jar = await cookies();
  const locale = jar.get("locale")?.value === "en" ? "en" : "tr";
  const dict = getDictionary(locale);

  if (name.length < 2) redirect("/iletisim?hata=" + encodeURIComponent(dict.errName));
  if (!email.includes("@")) redirect("/iletisim?hata=" + encodeURIComponent(dict.errEmail));
  if (phone.length < 10 || phone.length > 11) {
    redirect("/iletisim?hata=" + encodeURIComponent(dict.errPhone));
  }
  if (subject.length < 2) redirect("/iletisim?hata=" + encodeURIComponent(dict.errSubject));
  if (body.length < 10) redirect("/iletisim?hata=" + encodeURIComponent(dict.errMessage));

  await prisma.message.create({
    data: { name, email, phone, subject, body },
  });

  redirect("/iletisim?ok=1");
}
