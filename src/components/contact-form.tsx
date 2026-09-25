"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const router = useRouter();
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
      router.refresh();
    } catch {
      setStatus("error");
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(29,79,255,0.35)] sm:p-8">
        <h2 className="font-heading text-2xl text-ink">Teşekkürler</h2>
        <p className="text-muted-foreground">
          Mesajın veri tabanına kaydedildi. En kısa sürede dönüş yapacağım.
        </p>
        <Button type="button" variant="outline" onClick={() => setStatus("idle")}>
          Yeni mesaj
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_20px_50px_-30px_rgba(11,13,16,0.25)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad</Label>
          <Input id="name" name="name" required maxLength={80} placeholder="Adın" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            maxLength={120}
            placeholder="ornek@mail.com"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" maxLength={30} placeholder="05xx xxx xx xx" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Konu</Label>
          <Input id="subject" name="subject" required maxLength={120} placeholder="Proje / iş teklifi" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Mesaj</Label>
        <Textarea
          id="body"
          name="body"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          placeholder="Kısaca yaz..."
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={status === "loading"} className="bg-clay text-primary-foreground hover:bg-clay/90">
        {status === "loading" ? "Gönderiliyor..." : "Mesajı gönder"}
      </Button>
    </form>
  );
}
