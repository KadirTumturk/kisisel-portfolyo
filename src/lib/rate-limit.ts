import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

function pickFirstIp(header: string | null): string | null {
  if (!header) return null;
  const first = header.split(",")[0]?.trim();
  return first || null;
}

export function getClientIp(headers: Headers): string {
  return (
    pickFirstIp(headers.get("x-forwarded-for")) ||
    pickFirstIp(headers.get("x-real-ip")) ||
    pickFirstIp(headers.get("cf-connecting-ip")) ||
    "unknown"
  );
}

function stableKey(parts: Record<string, string>) {
  const raw = Object.entries(parts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return createHash("sha256").update(raw).digest("hex").slice(0, 48);
}

export async function checkRateLimit({
  action,
  headers,
  limit,
  windowMs,
}: {
  action: string;
  headers: Headers;
  limit: number;
  windowMs: number;
}): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const now = new Date();
  const ip = getClientIp(headers);
  const ua = headers.get("user-agent") ?? "unknown";
  const key = `${action}:${stableKey({ ip, ua })}`;
  const resetAt = new Date(now.getTime() + windowMs);

  try {
    const existing = await prisma.rateLimit.findUnique({ where: { key } });
    if (!existing || existing.resetAt <= now) {
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt },
        update: { count: 1, resetAt },
      });
      return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
    }

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000),
    );
    if (existing.count >= limit) return { allowed: false, retryAfterSeconds };

    await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return { allowed: true, retryAfterSeconds };
  } catch (error: unknown) {
    // If the rate limit table hasn't been created yet, don't block the form.
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("rate_limits") || msg.includes("RateLimit")) {
      return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
    }
    throw error;
  }
}

