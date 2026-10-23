import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import type { BrandTemplate } from "@prisma/client";
import {
  ADMIN_PREVIEW_HEADER,
  BRAND_HEADER,
  PREVIEW_COOKIE,
  getBrandBySlugCached,
  isKnownBrandSlug,
  normalizeHost,
  resolveBrandSlugByHost,
} from "@/lib/brand";

// Resolusi brand dari hostname (PRD Bagian 5) + proteksi /admin (PRD Bagian 10.1).
export const config = {
  runtime: "nodejs", // agar bisa pakai Prisma + cache in-memory
  // /api/upload dikecualikan agar body upload besar tidak di-buffer middleware (route cek auth sendiri).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/upload).*)"],
};

const PREVIEW_ENABLED = process.env.NODE_ENV !== "production";

// Path yang tidak butuh brand.
const BYPASS_PREFIXES = ["/api", "/brand-not-found", "/db-check", "/_next", "/uploads"];

function isBypassed(pathname: string): boolean {
  return (
    BYPASS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    /\.[a-z0-9]+$/i.test(pathname) // file statis di /public
  );
}

// Halaman yang tidak dipakai template tertentu -> tujuan redirect. Dilakukan di middleware supaya status HTTP
// langsung 307 tanpa merender halaman. (Dulu juga karena redirect() di page baru terjadi setelah shell loading.tsx
// terkirim sehingga respons tetap 200; (public)/loading.tsx sudah dihapus di F2.7.)
const TEMPLATE_REDIRECTS: Partial<Record<BrandTemplate, [RegExp, string][]>> = {
  ANGLO: [
    [/^\/galeri\/?$/, "/"],
    [/^\/menu\/[^/]+\/?$/, "/menu"],
  ],
  TUNGKU: [
    [/^\/galeri\/?$/, "/"],
    [/^\/menu\/[^/]+\/?$/, "/menu"],
  ],
  DADAK: [
    [/^\/galeri\/?$/, "/"],
    [/^\/menu\/[^/]+\/?$/, "/menu"],
  ],
  GERABAH: [
    [/^\/galeri\/?$/, "/"],
    [/^\/menu\/[^/]+\/?$/, "/menu"],
  ],
};

async function templateRedirect(req: NextRequest, slug: string): Promise<NextResponse | null> {
  const brand = await getBrandBySlugCached(slug);
  const target = brand && TEMPLATE_REDIRECTS[brand.template]?.find(([re]) => re.test(req.nextUrl.pathname))?.[1];
  return target ? NextResponse.redirect(new URL(target, req.nextUrl)) : null;
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export const middleware = auth(async (req) => {
  const { pathname, searchParams } = req.nextUrl;

  // Jangan percaya header brand/preview kiriman klien.
  const headers = new Headers(req.headers);
  headers.delete(BRAND_HEADER);
  headers.delete(ADMIN_PREVIEW_HEADER);

  const host = req.headers.get("host") ?? req.nextUrl.host;
  const adminHost = process.env.ADMIN_HOST;
  const onAdminHost = !!adminHost && normalizeHost(host) === normalizeHost(adminHost);

  if (isBypassed(pathname)) return NextResponse.next({ request: { headers } });

  // --- Panel admin ---
  if (isAdminPath(pathname)) {
    const isLogin = pathname === "/admin/login";
    if (!req.auth && !isLogin) {
      const url = new URL("/admin/login", req.nextUrl);
      url.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }
    if (req.auth && isLogin) return NextResponse.redirect(new URL("/admin", req.nextUrl));
    return NextResponse.next({ request: { headers } });
  }
  // Preview di produksi (ROADMAP F6.7): hanya di host admin & hanya untuk admin yang sudah login, supaya brand
  // Draft / tanpa domain bisa dicek sebelum tayang. Diberi noindex + banner "Mode preview".
  const adminPreview = !PREVIEW_ENABLED && onAdminHost && !!req.auth;
  if (adminPreview) headers.set(ADMIN_PREVIEW_HEADER, "1");
  if (onAdminHost && !adminPreview) return NextResponse.redirect(new URL("/admin", req.nextUrl));

  // --- Mode preview: ?brand=slug, /preview/slug/..., atau cookie preview (dev, atau admin login di host admin) ---
  if (PREVIEW_ENABLED || adminPreview) {
    const previewMatch = pathname.match(/^\/preview\/([^/]+)(\/.*)?$/);
    const querySlug = searchParams.get("brand");
    const overrideSlug = querySlug ?? previewMatch?.[1] ?? null;

    if (overrideSlug) {
      if (!(await isKnownBrandSlug(overrideSlug))) return notFound(req, headers, true);
      headers.set(BRAND_HEADER, overrideSlug);

      let res: NextResponse;
      if (previewMatch) {
        const url = req.nextUrl.clone();
        url.pathname = previewMatch[2] ?? "/";
        res = NextResponse.rewrite(url, { request: { headers } });
      } else {
        res = NextResponse.next({ request: { headers } });
      }
      res.cookies.set(PREVIEW_COOKIE, overrideSlug, { path: "/", sameSite: "lax", httpOnly: true, secure: adminPreview });
      return noindex(res, adminPreview);
    }

    const cookieSlug = req.cookies.get(PREVIEW_COOKIE)?.value;
    if (cookieSlug && (await isKnownBrandSlug(cookieSlug))) {
      const redirect = await templateRedirect(req, cookieSlug);
      if (redirect) return redirect;
      headers.set(BRAND_HEADER, cookieSlug);
      return noindex(NextResponse.next({ request: { headers } }), adminPreview);
    }
    // Host admin tanpa brand preview: kembali ke panel.
    if (adminPreview) return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  // --- Produksi: hostname -> brand ---
  const slug = await resolveBrandSlugByHost(host);
  if (!slug) return notFound(req, headers, false);
  const redirect = await templateRedirect(req, slug);
  if (redirect) return redirect;

  headers.set(BRAND_HEADER, slug);
  const res = NextResponse.next({ request: { headers } });
  return pathname === "/og-image" ? res : htmlCache(res);
});

/**
 * Halaman publik dirender per permintaan, jadi Next mengirim `no-store` dan halaman tidak bisa masuk
 * back/forward cache (tombol Kembali memuat ulang dari server). Tanpa `no-store` browser boleh menyimpan halaman
 * untuk tombol Kembali/Maju, tetapi `no-cache` tetap meminta versi terbaru setiap kunjungan biasa (stok, harga, jam
 * buka tidak basi). `private`: tidak disimpan proxy/CDN. Header dari middleware mengalahkan header route handler,
 * jadi /og-image (punya cache sendiri) dilewati.
 */
function htmlCache(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "private, no-cache, max-age=0, must-revalidate");
  return res;
}

/** Preview admin di produksi tidak boleh diindeks. */
function noindex(res: NextResponse, on: boolean): NextResponse {
  if (on) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

function notFound(req: NextRequest, headers: Headers, clearPreview: boolean) {
  const url = req.nextUrl.clone();
  url.pathname = "/brand-not-found";
  url.search = "";
  const res = NextResponse.rewrite(url, { request: { headers } });
  if (clearPreview) res.cookies.delete(PREVIEW_COOKIE);
  return res;
}
