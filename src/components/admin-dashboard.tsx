"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  year: number;
  role: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  sortOrder: number;
  technologies: { technology: { name: string } }[];
};

export function AdminDashboard({
  messages,
  projects,
}: {
  messages: Message[];
  projects: Project[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"messages" | "projects">("messages");
  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    summary: "",
    description: "",
    year: String(new Date().getFullYear()),
    role: "",
    liveUrl: "",
    repoUrl: "",
    featured: false,
    sortOrder: "10",
    technologies: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/giris");
    router.refresh();
  }

  async function toggleRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    router.refresh();
  }

  async function deleteMessage(id: string) {
    if (!confirm("Mesaj silinsin mi?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function editProject(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      year: String(p.year),
      role: p.role ?? "",
      liveUrl: p.liveUrl ?? "",
      repoUrl: p.repoUrl ?? "",
      featured: p.featured,
      sortOrder: String(p.sortOrder),
      technologies: p.technologies.map((t) => t.technology.name).join(", "),
    });
    setTab("projects");
  }

  async function saveProject(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      year: Number(form.year),
      sortOrder: Number(form.sortOrder),
    };
    const res = await fetch("/api/admin/projects", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Kayıt başarısız");
      return;
    }
    setForm({
      id: "",
      title: "",
      slug: "",
      summary: "",
      description: "",
      year: String(new Date().getFullYear()),
      role: "",
      liveUrl: "",
      repoUrl: "",
      featured: false,
      sortOrder: "10",
      technologies: "",
    });
    router.refresh();
  }

  async function deleteProject(id: string) {
    if (!confirm("Proje silinsin mi?")) return;
    await fetch("/api/admin/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-ink">Admin paneli</h1>
          <p className="text-sm text-muted-foreground">Mesajlar ve projeler</p>
        </div>
        <Button variant="outline" onClick={logout}>
          Çıkış
        </Button>
      </div>

      <div className="mt-8 flex gap-2">
        <Button
          variant={tab === "messages" ? "default" : "outline"}
          className={tab === "messages" ? "bg-clay hover:bg-clay/90" : ""}
          onClick={() => setTab("messages")}
        >
          Mesajlar ({messages.filter((m) => !m.read).length} yeni)
        </Button>
        <Button
          variant={tab === "projects" ? "default" : "outline"}
          className={tab === "projects" ? "bg-clay hover:bg-clay/90" : ""}
          onClick={() => setTab("projects")}
        >
          Projeler
        </Button>
      </div>

      {tab === "messages" ? (
        <div className="mt-8 space-y-4">
          {messages.length === 0 ? (
            <p className="text-muted-foreground">Henüz mesaj yok.</p>
          ) : (
            messages.map((m) => (
              <article
                key={m.id}
                className={`border border-border p-4 ${m.read ? "opacity-70" : "bg-card/60"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium text-ink">{m.subject}</h2>
                    <p className="text-sm text-muted-foreground">
                      {m.name} · {m.email}
                      {m.phone ? ` · ${m.phone}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(m.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRead(m.id, !m.read)}
                    >
                      {m.read ? "Okunmadı" : "Okundu"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMessage(m.id)}>
                      Sil
                    </Button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.body}</p>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <form onSubmit={saveProject} className="space-y-3 border border-border bg-card/40 p-4">
            <h2 className="font-heading text-xl">
              {form.id ? "Proje düzenle" : "Yeni proje"}
            </h2>
            {(
              [
                ["title", "Başlık"],
                ["slug", "Slug (ornek-proje)"],
                ["year", "Yıl"],
                ["role", "Rol"],
                ["liveUrl", "Canlı URL"],
                ["repoUrl", "Repo URL"],
                ["sortOrder", "Sıra"],
                ["technologies", "Teknolojiler (virgülle)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={key === "title" || key === "slug" || key === "year"}
                />
              </div>
            ))}
            <div className="space-y-1">
              <Label htmlFor="summary">Özet</Label>
              <Textarea
                id="summary"
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                required
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={5}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Öne çıkan
            </label>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="bg-clay hover:bg-clay/90">
              Kaydet
            </Button>
          </form>

          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      /{p.slug} · {p.year}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => editProject(p)}>
                      Düzenle
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteProject(p.id)}>
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
