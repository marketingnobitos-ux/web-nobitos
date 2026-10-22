// Kesehatan SEO per brand (ROADMAP F6.2): cek langsung situs live (beranda, sitemap, robots) dari server.
// Read-only; tidak menyimpan apa pun. Dipanggil saat halaman Admin "Kesehatan SEO" dibuka.

/** ok: true = beres, false = bermasalah, null = tidak bisa dicek. */
export type Check = { key: string; label: string; ok: boolean | null; detail: string };

const TIMEOUT_MS = 8000;
const UA = "NobitosSeoCheckBot/1.0 (+admin)";
const BUSINESS = /^(Restaurant|Bakery|FoodEstablishment|CafeOrCoffeeShop|FastFoodRestaurant|LocalBusiness)$/;

async function get(url: string): Promise<{ status: number; text: string; finalUrl: string } | { error: string }> {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
    return { status: res.status, text: await res.text(), finalUrl: res.url };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/abort|timeout/i.test(msg)) return { error: `tidak merespons dalam ${TIMEOUT_MS / 1000} detik` };
    const code = (e as { cause?: { code?: string } }).cause?.code ?? "";
    const known: Record<string, string> = {
      ENOTFOUND: "domain tidak ditemukan (DNS belum mengarah)",
      ECONNREFUSED: "server menolak koneksi",
      ECONNRESET: "koneksi terputus",
      CERT_HAS_EXPIRED: "sertifikat SSL kedaluwarsa",
      ERR_TLS_CERT_ALTNAME_INVALID: "sertifikat SSL bukan untuk domain ini",
      DEPTH_ZERO_SELF_SIGNED_CERT: "sertifikat SSL tidak sah",
    };
    return { error: known[code] ?? (code ? `${msg} (${code})` : msg).slice(0, 120) };
  }
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

function metaContent(html: string, attr: "name" | "property", key: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (new RegExp(`\\b${attr}=["']${key}["']`, "i").test(tag)) {
      const m = tag.match(/\bcontent=["']([^"']*)["']/i);
      if (m) return decode(m[1]);
    }
  }
  return null;
}

/** Semua @type di JSON-LD (termasuk di dalam @graph / array). */
function jsonLdTypes(html: string): { types: string[]; invalid: number } {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const types: string[] = [];
  let invalid = 0;
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const o = node as Record<string, unknown>;
    const t = o["@type"];
    if (typeof t === "string") types.push(t);
    else if (Array.isArray(t)) types.push(...t.filter((x): x is string => typeof x === "string"));
    if (o["@graph"]) walk(o["@graph"]);
  };
  for (const b of blocks) {
    try {
      walk(JSON.parse(b));
    } catch {
      invalid++;
    }
  }
  return { types, invalid };
}

const short = (s: string, max = 70) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

/** Jalankan semua cek untuk satu domain (https). */
export async function checkSite(hostname: string): Promise<Check[]> {
  const origin = `https://${hostname}`;
  const [home, sitemap, robots] = await Promise.all([get(`${origin}/`), get(`${origin}/sitemap.xml`), get(`${origin}/robots.txt`)]);
  const checks: Check[] = [];

  if ("error" in home) {
    checks.push({ key: "home", label: "Beranda bisa dibuka (HTTPS)", ok: false, detail: home.error });
  } else {
    const okHome = home.status === 200;
    checks.push({ key: "home", label: "Beranda bisa dibuka (HTTPS)", ok: okHome, detail: `HTTP ${home.status}` });
    const html = home.text;
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    checks.push({ key: "title", label: "Judul halaman (title)", ok: !!title?.trim(), detail: title ? short(decode(title)) : "tidak ada" });
    const desc = metaContent(html, "name", "description");
    checks.push({
      key: "description",
      label: "Meta description",
      ok: !!desc && desc.length >= 50,
      detail: desc ? `${desc.length} karakter${desc.length < 50 ? " (terlalu pendek)" : ""}` : "tidak ada",
    });
    const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0].match(/href=["']([^"']+)["']/i)?.[1];
    checks.push({ key: "canonical", label: "Canonical", ok: !!canonical, detail: canonical ?? "tidak ada" });
    const og = metaContent(html, "property", "og:image");
    checks.push({ key: "og", label: "Gambar share (og:image)", ok: !!og, detail: og ? "ada" : "tidak ada" });
    const noindex = /noindex/i.test(metaContent(html, "name", "robots") ?? "");
    checks.push({ key: "index", label: "Boleh diindeks Google", ok: !noindex, detail: noindex ? "halaman memakai noindex" : "ya" });
    const ld = jsonLdTypes(html);
    const business = ld.types.filter((t) => BUSINESS.test(t));
    checks.push({
      key: "jsonld",
      label: "Data terstruktur (JSON-LD)",
      ok: ld.invalid === 0 && business.length > 0,
      detail: ld.invalid
        ? `${ld.invalid} blok tidak valid`
        : business.length
          ? `${business.length} × ${[...new Set(business)].join(", ")}`
          : "tidak ada data restoran (cabang belum lengkap?)",
    });
  }

  if ("error" in sitemap) {
    checks.push({ key: "sitemap", label: "sitemap.xml", ok: false, detail: sitemap.error });
  } else {
    const urls = (sitemap.text.match(/<loc>/g) ?? []).length;
    checks.push({ key: "sitemap", label: "sitemap.xml", ok: sitemap.status === 200 && urls > 0, detail: `HTTP ${sitemap.status} · ${urls} URL` });
  }

  if ("error" in robots) {
    checks.push({ key: "robots", label: "robots.txt", ok: false, detail: robots.error });
  } else {
    const blocksAll = /^\s*disallow:\s*\/\s*$/im.test(robots.text);
    const hasSitemap = /^\s*sitemap:/im.test(robots.text);
    checks.push({
      key: "robots",
      label: "robots.txt",
      ok: robots.status === 200 && !blocksAll && hasSitemap,
      detail: robots.status !== 200 ? `HTTP ${robots.status}` : blocksAll ? "memblokir semua halaman" : hasSitemap ? "mengizinkan + alamat sitemap" : "tanpa alamat sitemap",
    });
  }
  return checks;
}
