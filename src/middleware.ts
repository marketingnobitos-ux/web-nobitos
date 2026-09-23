import { NextResponse, type NextRequest } from "next/server";
import {
  BRAND_HEADER,
  PREVIEW_COOKIE,
  isKnownBrandSlug,
  normalizeHost,
  resolveBrandSlugByHost,
} from "@/lib/brand";

// Resolusi brand dari hostname (PRD Bagian 5). Proteksi /admin menyusul di Milestone 4.
export const config = {
  runtime: "nodejs", // agar bisa pakai Prisma + cache in-memory
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

const PREVIEW_ENABLED = process.env.NODE_ENV !== "production";

// Path yang tidak butuh brand.
const BYPASS_PREFIXES = ["/admin", "/api", "/brand-not-found", "/db-check", "/_next"];

function isBypassed(pathname: string): boolean {
  return (
    BYPASS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    /\.[a-z0-9]+$/i.test(pathname) // file statis di /public
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Jangan percaya header brand kiriman klien.
  const headers = new Headers(req.headers);
  headers.delete(BRAND_HEADER);

  const host = req.headers.get("host") ?? req.nextUrl.host;
  const adminHost = process.env.ADMIN_HOST;

  if (isBypassed(pathname) || (adminHost && normalizeHost(host) === normalizeHost(adminHost))) {
    return NextResponse.next({ request: { headers } });
  }

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
      headers.set(BRAND_HEADER, cookieSlug);
      return NextResponse.next({ request: { headers } });
    }
  }

  // --- Produksi: hostname -> brand ---
  const slug = await resolveBrandSlugByHost(host);
  if (!slug) return notFound(req, headers, false);

  headers.set(BRAND_HEADER, slug);
  return NextResponse.next({ request: { headers } });
}

function notFound(req: NextRequest, headers: Headers, clearPreview: boolean) {
  const url = req.nextUrl.clone();
  url.pathname = "/brand-not-found";
  url.search = "";
  const res = NextResponse.rewrite(url, { request: { headers } });
  if (clearPreview) res.cookies.delete(PREVIEW_COOKIE);
  return res;
}
