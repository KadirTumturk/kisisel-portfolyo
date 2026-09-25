import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get("locale")?.value;
  return value === "en" ? "en" : "tr";
}

export async function getTheme(): Promise<"light" | "dark"> {
  const jar = await cookies();
  return jar.get("theme")?.value === "dark" ? "dark" : "light";
}
