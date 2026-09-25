import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Kadir Tümtürk — Full Stack Developer",
    template: "%s · Kadir Tümtürk",
  },
  description:
    "Ankara Üniversitesi Bilgisayar Programcılığı öğrencisi. Web arayüzleri, veri tabanı ve uygulama geliştirme portfolyosu.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let name = "Kadir Tümtürk";
  let email = "kdrtumturk98@gmail.com";
  try {
    const profile = await prisma.profile.findFirst();
    if (profile) {
      name = profile.name;
      email = profile.email;
    }
  } catch {
    // DB henüz hazır değilse varsayılanlarla devam
  }

  return (
    <html lang="tr" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader name={name} />
        <main className="flex-1">{children}</main>
        <SiteFooter name={name} email={email} />
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 sm:hidden">
          <a
            href="/iletisim"
            className="rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg"
          >
            İletişime geç
          </a>
        </div>
      </body>
    </html>
  );
}
