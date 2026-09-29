import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import type { BrandTemplate } from "@prisma/client";
import {
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
// benar-benar 307; redirect() di page terjadi setelah shell loading.tsx terkirim, jadi respons tetap 200.
const TEMPLATE_REDIRECTS: Partial<Record<BrandTemplate, [RegExp, string][]>> = {
  ANGLO: [
    [/^\/galeri\/?$/, "/"],
    [/^\/menu\/[^/]+\/?$/, "/menu"],
  ],
  TUNGKU: [
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

  // Jangan percaya header brand kiriman klien.
  const headers = new Headers(req.headers);
  headers.delete(BRAND_HEADER);

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
  if (onAdminHost) return NextResponse.redirect(new URL("/admin", req.nextUrl));

  // --- Mode dev: ?brand=slug, /preview/slug/..., atau cookie preview ---
  if (PREVIEW_ENABLED) {
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
      res.cookies.set(PREVIEW_COOKIE, overrideSlug, { path: "/", sameSite: "lax", httpOnly: true });
      return res;
    }

    const cookieSlug = req.cookies.get(PREVIEW_COOKIE)?.value;
    if (cookieSlug && (await isKnownBrandSlug(cookieSlug))) {
      const redirect = await templateRedirect(req, cookieSlug);
      if (redirect) return redirect;
      headers.set(BRAND_HEADER, cookieSlug);
      return NextResponse.next({ request: { headers } });
    }
  }

  // --- Produksi: hostname -> brand ---
  const slug = await resolveBrandSlugByHost(host);
  if (!slug) return notFound(req, headers, false);
  const redirect = await templateRedirect(req, slug);
  if (redirect) return redirect;

  headers.set(BRAND_HEADER, slug);
  return NextResponse.next({ request: { headers } });
});

function notFound(req: NextRequest, headers: Headers, clearPreview: boolean) {
  const url = req.nextUrl.clone();
  url.pathname = "/brand-not-found";
  url.search = "";
  const res = NextResponse.rewrite(url, { request: { headers } });
  if (clearPreview) res.cookies.delete(PREVIEW_COOKIE);
  return res;
}
