import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const locale = String(form.get("locale") ?? "");
  const theme = String(form.get("theme") ?? "");
  const res = NextResponse.redirect(new URL(request.headers.get("referer") || "/", request.url), 303);

  if (locale === "tr" || locale === "en") {
    res.cookies.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  if (theme === "light" || theme === "dark") {
    res.cookies.set("theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
}
