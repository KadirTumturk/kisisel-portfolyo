"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function loginAdminAction(formData: FormData) {
  const h = await headers();
  const rl = await checkRateLimit({
    action: "admin_login",
    headers: h,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!rl.allowed) {
    redirect("/admin/giris?hata=1");
  }

  const password = String(formData.get("password") ?? "").trim();

  if (!password || !verifyAdminPassword(password)) {
    redirect("/admin/giris?hata=1");
  }

  await createAdminSession();
  redirect("/admin");
}
