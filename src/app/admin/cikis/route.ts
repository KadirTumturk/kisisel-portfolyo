import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  await destroyAdminSession();
  return NextResponse.redirect(new URL("/admin/giris", request.url), { status: 303 });
}

export async function POST(request: Request) {
  await destroyAdminSession();
  return NextResponse.redirect(new URL("/admin/giris", request.url), { status: 303 });
}
