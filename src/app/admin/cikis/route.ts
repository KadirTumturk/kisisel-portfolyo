import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/auth";

async function logoutAndRedirect() {
  await destroyAdminSession();
  return NextResponse.redirect(new URL("/admin/giris", process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:43123"), {
    status: 303,
  });
}

export async function GET(request: Request) {
  await destroyAdminSession();
  return NextResponse.redirect(new URL("/admin/giris", request.url), { status: 303 });
}

export async function POST(request: Request) {
  await destroyAdminSession();
  return NextResponse.redirect(new URL("/admin/giris", request.url), { status: 303 });
}
