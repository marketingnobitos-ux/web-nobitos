// Resolusi & cache brand (PRD Bagian 5).
// Pemetaan domain -> brand disimpan di memory dan di-refresh berkala,
// supaya middleware tidak query DB di setiap request.
import { prisma } from "@/lib/prisma";

/** Header internal yang membawa slug brand aktif dari middleware ke server components. */
export const BRAND_HEADER = "x-brand-slug";

/** Cookie untuk mode preview (dev) agar brand tetap terpilih saat pindah halaman. */
export const PREVIEW_COOKIE = "nobitos-preview-brand";

const TTL_MS = Number(process.env.BRAND_CACHE_TTL_MS ?? 5 * 60 * 1000);

type BrandMap = {
  byHost: Map<string, string>; // hostname -> slug
  slugs: Set<string>;
  loadedAt: number;
};

let current: BrandMap | null = null;
let loading: Promise<BrandMap> | null = null;

/** "WWW.Contoh.com:3000" -> "www.contoh.com" */
export function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

async function load(): Promise<BrandMap> {
  const [domains, brands] = await Promise.all([
    prisma.domain.findMany({ select: { hostname: true, brand: { select: { slug: true } } } }),
    prisma.brand.findMany({ select: { slug: true } }),
  ]);
  return {
    byHost: new Map(domains.map((d) => [normalizeHost(d.hostname), d.brand.slug])),
    slugs: new Set(brands.map((b) => b.slug)),
    loadedAt: Date.now(),
  };
}

function refresh(): Promise<BrandMap> {
  loading ??= load()
    .then((map) => (current = map))
    .finally(() => {
      loading = null;
    });
  return loading;
}

async function getBrandMap(): Promise<BrandMap> {
  if (!current) return refresh();
  if (Date.now() - current.loadedAt > TTL_MS) {
    // Stale-while-revalidate: pakai data lama, refresh di belakang.
    refresh().catch((e) => console.error("[brand] gagal refresh cache domain:", e));
  }
  return current;
}

/** Cari slug brand dari hostname request. Mencoba juga versi tanpa "www.". */
export async function resolveBrandSlugByHost(host: string): Promise<string | null> {
  const { byHost } = await getBrandMap();
  const h = normalizeHost(host);
  return byHost.get(h) ?? byHost.get(h.replace(/^www\./, "")) ?? null;
}

export async function isKnownBrandSlug(slug: string): Promise<boolean> {
  const { slugs } = await getBrandMap();
  return slugs.has(slug);
}
