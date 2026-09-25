"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitContactAction } from "@/app/iletisim/actions";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function ContactForm({
  initialError,
  initialOk,
}: {
  initialError?: string;
  initialOk?: boolean;
}) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [success, setSuccess] = useState(Boolean(initialOk));

  useEffect(() => {
    setError(initialError ?? null);
    setSuccess(Boolean(initialOk));
  }, [initialError, initialOk]);

  if (success) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(29,79,255,0.35)] sm:p-8">
        <h2 className="font-heading text-2xl text-ink">Teşekkürler</h2>
        <p className="text-muted-foreground">
          Mesajın veri tabanına kaydedildi. Admin panelindeki Mesajlar sekmesinde görünür.
        </p>
        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setError(null);
            router.replace("/iletisim");
          }}
          className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm hover:bg-mist"
        >
          Yeni mesaj
        </button>
      </div>
    );
  }

  const fieldClass =
    "h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30";

  return (
    <form
      action={async (formData) => {
        setPending(true);
        setError(null);
        try {
          formData.set("phone", digitsOnly(phone || String(formData.get("phone") ?? "")));
          await submitContactAction(formData);
        } catch (err) {
          // Next.js redirect() throws; ignore NEXT_REDIRECT
          const digest = typeof err === "object" && err && "digest" in err ? String((err as { digest?: string }).digest) : "";
          if (digest.includes("NEXT_REDIRECT")) return;
          setError("Gönderilemedi. Tekrar dene.");
          setPending(false);
        }
      }}
      className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(11,13,16,0.25)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Ad Soyad
          </label>
          <input id="name" name="name" required minLength={2} maxLength={80} placeholder="Adın" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={120}
            placeholder="ornek@mail.com"
            className={fieldClass}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Telefon <span className="text-destructive">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            inputMode="numeric"
            autoComplete="tel"
            required
            minLength={10}
            maxLength={11}
            placeholder="05421234567"
            value={phone}
            onChange={(e) => setPhone(digitsOnly(e.target.value))}
            onKeyDown={(e) => {
              const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
              if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
              if (!/^\d$/.test(e.key)) e.preventDefault();
            }}
            onPaste={(e) => {
              e.preventDefault();
              setPhone(digitsOnly(e.clipboardData.getData("text")).slice(0, 11));
            }}
            pattern="[0-9]{10,11}"
            title="Sadece rakam, 10 veya 11 hane"
            className={fieldClass}
          />
          <p className="text-xs text-muted-foreground">Zorunlu · sadece rakam · 10–11 hane</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Konu
          </label>
          <input
            id="subject"
            name="subject"
            required
            minLength={2}
            maxLength={120}
            placeholder="Proje / iş teklifi"
            className={fieldClass}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium">
          Mesaj
        </label>
        <textarea
          id="body"
          name="body"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          placeholder="Kısaca yaz..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-clay px-4 text-sm font-medium text-white hover:bg-clay/90 disabled:opacity-50"
      >
        {pending ? "Gönderiliyor..." : "Mesajı gönder"}
      </button>
    </form>
  );
}
