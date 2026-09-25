import { NextResponse } from "next/server";
import {
  createAdminSession,
  destroyAdminSession,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
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
