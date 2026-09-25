"use server";

import { redirect } from "next/navigation";
import { destroyAdminSession } from "@/lib/auth";

export async function logoutAdminAction() {
  await destroyAdminSession();
  redirect("/admin/giris");
}
