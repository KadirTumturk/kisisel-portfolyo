import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const formData = await request.formData();

  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) {
    // Pretend success to discourage bots.
    return NextResponse.redirect(new URL("/iletisim?ok=1", request.url), 303);
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const jar = await cookies();
  const locale = jar.get("locale")?.value === "en" ? "en" : "tr";
  const dict = getDictionary(locale);

  const fail = (msg: string) =>
    NextResponse.redirect(
      new URL(`/iletisim?hata=${encodeURIComponent(msg)}`, request.url),
      303,
    );

  const rl = await checkRateLimit({
    action: "contact_form",
    headers: request.headers,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!rl.allowed) return fail(dict.errRateLimited);

  if (name.length < 2) return fail(dict.errName);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(dict.errEmail);
  if (phone.length < 10 || phone.length > 11) return fail(dict.errPhone);
  if (subject.length < 2) return fail(dict.errSubject);
  if (body.length < 10) return fail(dict.errMessage);

  await prisma.message.create({
    data: { name, email, phone, subject, body },
  });

  return NextResponse.redirect(new URL("/iletisim?ok=1", request.url), 303);
}
