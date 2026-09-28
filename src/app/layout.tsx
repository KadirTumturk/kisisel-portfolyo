import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { getLocale, getTheme } from "@/lib/prefs";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const display = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return {
    title: {
      default: "Kadir Tümtürk — Full Stack Developer",
      template: "%s · Kadir Tümtürk",
    },
    description: dict.siteDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let name = "Kadir Tümtürk";
  let email = "kdrtumturk98@gmail.com";
  let unreadCount = 0;
  try {
    const profile = await prisma.profile.findFirst();
    if (profile) {
      name = profile.name;
      email = profile.email;
    }
    if (await isAdminAuthenticated()) {
      unreadCount = await prisma.message.count({ where: { read: false } });
    }
  } catch {
    // DB henüz hazır değilse varsayılanlarla devam
  }

  const locale = await getLocale();
  const theme = await getTheme();
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} h-full ${theme === "dark" ? "dark" : ""}`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader
          name={name}
          dict={dict}
          locale={locale}
          theme={theme}
          unreadCount={unreadCount}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter name={name} email={email} />
        <div className="no-print fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:hidden">
          <a
            href="/iletisim"
            className="rounded-md bg-clay px-5 py-2.5 text-sm font-medium text-white shadow-md"
          >
            {dict.reachOut}
          </a>
        </div>
      </body>
    </html>
  );
}
