import { ContactForm } from "@/components/contact-form";
import { requireProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İletişim",
};

export default async function ContactPage() {
  const profile = await requireProfile();

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-clay">İletişim</p>
        <h1 className="font-heading mt-2 text-4xl text-ink sm:text-5xl">Birlikte çalışalım</h1>
        <p className="mt-4 text-muted-foreground">
          Proje, staj veya iş birliği için formu doldurman yeterli. Mesajın doğrudan veri
          tabanıma düşer.
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">E-posta</dt>
            <dd>
              <a href={`mailto:${profile.email}`} className="text-ink hover:text-clay">
                {profile.email}
              </a>
            </dd>
          </div>
          {profile.phone ? (
            <div>
              <dt className="text-muted-foreground">Telefon</dt>
              <dd className="text-ink">{profile.phone}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-muted-foreground">Konum</dt>
            <dd className="text-ink">{profile.location}</dd>
          </div>
        </dl>
      </div>
      <ContactForm />
    </div>
  );
}
