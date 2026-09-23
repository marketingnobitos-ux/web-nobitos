import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  VISITOR_COOKIE,
  VISITOR_MAX_AGE,
  detectDevice,
  isBot,
  normalizePath,
  referrerHost,
  trackSchema,
} from "@/lib/analytics";
import { isKnownBrandSlug, normalizeHost, resolveBrandSlugByHost } from "@/lib/brand";
import { prisma } from "@/lib/prisma";
import { clientIp, hit, isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const PREVIEW_ENABLED = process.env.NODE_ENV !== "production";
const RATE_LIMIT = 120; // event per IP per menit
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const noContent = () => new NextResponse(null, { status: 204 });

// Rekam pageview / click dari situs publik (PRD Bagian 11).
export async function POST(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") ?? "";
  if (isBot(userAgent)) return noContent();

  const host = normalizeHost(req.headers.get("host") ?? "");
  // Hanya terima dari halaman di domain yang sama.
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (normalizeHost(new URL(origin).host) !== host) return new NextResponse(null, { status: 403 });
    } catch {
      return new NextResponse(null, { status: 403 });
    }
  }

  const rateKey = `track:${clientIp(req)}`;
  if (isRateLimited(rateKey, RATE_LIMIT)) return new NextResponse(null, { status: 429 });
  hit(rateKey, 60_000);

  const text = await req.text();
  if (text.length > 4000) return new NextResponse(null, { status: 413 });
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = trackSchema.safeParse(json);
  if (!parsed.success) return new NextResponse(null, { status: 400 });
  const event = parsed.data;

  // Brand dari hostname; slug dari body hanya dipakai di mode preview (dev).
  let slug = await resolveBrandSlugByHost(host);
  if (!slug && PREVIEW_ENABLED && event.brandSlug && (await isKnownBrandSlug(event.brandSlug))) {
    slug = event.brandSlug;
  }
  if (!slug) return noContent();
  const brand = await prisma.brand.findUnique({ where: { slug }, select: { id: true } });
  if (!brand) return noContent();

  const existing = req.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId = existing && UUID_RE.test(existing) ? existing : randomUUID();

  await prisma.analyticsEvent.create({
    data: {
      brandId: brand.id,
      type: event.type,
      path: normalizePath(event.path),
      target: event.type === "click" ? event.target : null,
      referrer: event.type === "pageview" ? referrerHost(event.referrer, host) : null,
      device: detectDevice(userAgent),
      sessionId: visitorId,
    },
  });

  const res = noContent();
  if (visitorId !== existing) {
    res.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: VISITOR_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}
