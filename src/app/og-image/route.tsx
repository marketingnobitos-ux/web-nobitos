// Gambar share Open Graph per brand (ROADMAP F0.2), 1200×630, dari nama, tagline & warna brand di DB.
// Bukan file convention opengraph-image supaya URL-nya tetap (dipakai lib/seo di semua halaman).
import { ImageResponse } from "next/og";
import { getActiveBrand } from "@/lib/active-brand";
import { branchNames, siteOrigin } from "@/lib/seo";

/** true kalau warna hex cukup terang sehingga teks di atasnya harus gelap. */
function isLight(hex: string): boolean {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}

export async function GET() {
  const brand = await getActiveBrand();
  if (!brand) return new Response("Not found", { status: 404 });

  const [origin, names] = await Promise.all([siteOrigin(brand.id), branchNames(brand)]);
  const bg = brand.colorPrimary;
  const fg = isLight(bg) ? "#161412" : isLight(brand.colorSecondary) ? brand.colorSecondary : "#ffffff";
  const accent = brand.colorAccent ?? fg;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: bg,
          color: fg,
        }}
      >
        <div style={{ display: "flex", width: 120, height: 10, background: accent }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: brand.name.length > 24 ? 76 : 96, fontWeight: 700, lineHeight: 1.05 }}>{brand.name}</div>
          {brand.tagline && <div style={{ marginTop: 28, fontSize: 40, opacity: 0.85 }}>{brand.tagline}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.75 }}>
          <div>{names.length ? `${names.length} cabang · ${names.join(" · ")}` : ""}</div>
          <div>{origin.hostname}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // Versi (?v=) berganti saat brand diubah, jadi aman di-cache lama.
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
    },
  );
}
