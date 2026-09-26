import { NextResponse } from "next/server";
import {
  createAdminSession,
  destroyAdminSession,
  verifyAdminPassword,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const rl = await checkRateLimit({
      action: "admin_login",
      headers: request.headers,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Çok fazla deneme. Biraz bekleyip tekrar dene." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
      );
    }

    const { password } = await request.json();
    if (!password || !verifyAdminPassword(String(password))) {
      return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Giriş başarısız" }, { status: 500 });
  }
}

export async function DELETE() {
  await destroyAdminSession();
  return NextResponse.json({ ok: true });
}
