import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const jar = await cookies();
    const locale = jar.get("locale")?.value === "en" ? "en" : "tr";
    const dict = getDictionary(locale);

    const rl = await checkRateLimit({
      action: "contact_json",
      headers: request.headers,
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: dict.errRateLimited, retryAfterSeconds: rl.retryAfterSeconds },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
      );
    }

    const schema = z.object({
      name: z.string().trim().min(2, dict.errName).max(80),
      email: z.string().trim().email(dict.errEmail),
      phone: z.string().trim().regex(/^\d{10,11}$/, dict.errPhone),
      subject: z.string().trim().min(2, dict.errSubject).max(120),
      body: z.string().trim().min(10, dict.errMessage).max(2000),
      company: z.string().optional(),
    });

    const json = await request.json();
    const parsed = schema.safeParse({
      ...json,
      phone: String(json.phone ?? "").replace(/\D/g, ""),
    });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            (locale === "en" ? "Invalid form" : "Geçersiz form"),
        },
        { status: 400 },
      );
    }

    if (parsed.data.company && String(parsed.data.company).trim()) {
      return NextResponse.json({ ok: true });
    }

    const { name, email, phone, subject, body } = parsed.data;
    const message = await prisma.message.create({
      data: {
        name,
        email,
        phone,
        subject,
        body,
      },
    });

    return NextResponse.json({ ok: true, id: message.id });
  } catch (error) {
    console.error(error);
    const jar = await cookies();
    const locale = jar.get("locale")?.value === "en" ? "en" : "tr";
    return NextResponse.json(
      { error: locale === "en" ? "Server error" : "Sunucu hatası" },
      { status: 500 },
    );
  }
}
