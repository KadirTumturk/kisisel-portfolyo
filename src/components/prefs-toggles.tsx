"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n";

const YEAR = 60 * 60 * 24 * 365;

function setPrefCookie(name: "theme" | "locale", value: string) {
  document.cookie = `${name}=${value};path=/;max-age=${YEAR};samesite=lax`;
}

export function ThemeToggle({
  initialTheme,
  lightLabel,
  darkLabel,
}: {
  initialTheme: "light" | "dark";
  lightLabel: string;
  darkLabel: string;
}) {
  const [theme, setTheme] = useState(initialTheme);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-instant");
    root.classList.toggle("dark", next === "dark");
    setPrefCookie("theme", next);
    setTheme(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-instant");
      });
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-ink"
      aria-label={theme === "dark" ? lightLabel : darkLabel}
    >
      {theme === "dark" ? lightLabel : darkLabel}
    </button>
  );
}

export function LocaleToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = locale === "tr" ? "en" : "tr";
    setPrefCookie("locale", next);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-ink disabled:opacity-60"
    >
      {locale === "tr" ? "EN" : "TR"}
    </button>
  );
}
