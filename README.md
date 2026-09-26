# Kadir Tümtürk — Kişisel Portfolyo

Ankara Üniversitesi Bilgisayar Programcılığı öğrencisi için MySQL destekli kişisel portfolyo sitesi. Ziyaretçi tarafında projeler / hakkında / iletişim; admin panelinde mesajlar ve proje CRUD.

## Stack

- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- Prisma + **MySQL**
- Basit admin oturumu (şifre + HTTP-only cookie)

## Yerelde çalıştırma

### 1) Bağımlılıklar

```bash
npm install
cp .env.example .env
```

`.env` içinde:

- `DATABASE_URL` — MySQL bağlantı dizesi
- `ADMIN_PASSWORD` — admin paneli şifresi
- `ADMIN_SESSION_SECRET` — uzun rastgele metin

## Güvenlik notları

- **Secret / API key’i asla** `NEXT_PUBLIC_...` ile tanımlamayın. `NEXT_PUBLIC_*` değişkenleri tarayıcıya gömülür ve kolayca görülebilir.
- Bu repo, yanlışlıkla secret commit etmeyi engellemek için basit bir secret taraması içerir:

```bash
npm run security:check
```

### 2) MySQL

**Seçenek A — Native MySQL (Installer kurduysan)**

1. MySQL servisinin çalıştığından emin ol.
2. Bir veritabanı oluştur:

```sql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. `.env` örneği:

```env
DATABASE_URL="mysql://root:SIFREN@127.0.0.1:3306/portfolio"
```

**Seçenek B — Docker Compose**

XAMPP / native MySQL’i **kapalı** tut (3306 çakışır), sonra:

```bash
docker compose up -d
```

`.env`:

```env
DATABASE_URL="mysql://portfolio:portfolio_pass@127.0.0.1:3306/portfolio"
```

### 3) Şema + seed

```bash
npm run db:setup
```

### 4) Geliştirme sunucusu

```bash
npm run dev
```

Site: [http://127.0.0.1:43123](http://127.0.0.1:43123)  
Admin: [http://127.0.0.1:43123/admin](http://127.0.0.1:43123/admin)

## Veri modeli (ders için)

| Tablo | Açıklama |
|-------|----------|
| `profiles` | Tek profil kaydı |
| `projects` | Projeler |
| `technologies` | Teknolojiler |
| `project_technologies` | Proje ↔ teknoloji (N–N) |
| `skills` | Yetenekler |
| `experiences` | Eğitim / deneyim |
| `messages` | İletişim formu mesajları |

## Notlar

- İletişim formu kayıtları `messages` tablosuna yazılır; admin’den okundu / sil yapılabilir.
- Siber güvenlik ders projesi portfolyoda **eğitim amaçlı farkındalık laboratuvarı** olarak anlatılır; canlı phishing linki yoktur.
