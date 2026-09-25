"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminPassword } from "@/lib/auth";

export async function loginAdminAction(formData: FormData) {
  const password = String(formData.get("password") ?? "").trim();

  if (!password || !verifyAdminPassword(password)) {
    redirect("/admin/giris?hata=1");
  }

  await createAdminSession();
  redirect("/admin");
}
