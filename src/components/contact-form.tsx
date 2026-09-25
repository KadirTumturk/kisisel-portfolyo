"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(json.error ?? "Mesaj gönderilemedi.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  }

  const fieldClass =
    "h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30";

  if (status === "success") {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(29,79,255,0.35)] sm:p-8">
        <h2 className="font-heading text-2xl text-ink">Teşekkürler</h2>
        <p className="text-muted-foreground">
          Mesajın veri tabanına kaydedildi. En kısa sürede dönüş yapacağım.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm hover:bg-mist"
        >
          Yeni mesaj
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      method="post"
      action="#"
      className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(11,13,16,0.25)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Ad Soyad
          </label>
          <input id="name" name="name" required maxLength={80} placeholder="Adın" className={fieldClass} />
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
            Telefon
          </label>
          <input id="phone" name="phone" maxLength={30} placeholder="05xx xxx xx xx" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Konu
          </label>
          <input
            id="subject"
            name="subject"
            required
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
        disabled={status === "loading"}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-clay px-4 text-sm font-medium text-white hover:bg-clay/90 disabled:opacity-50"
      >
        {status === "loading" ? "Gönderiliyor..." : "Mesajı gönder"}
      </button>
    </form>
  );
}
