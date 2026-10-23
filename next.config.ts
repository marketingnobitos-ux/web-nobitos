import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Metadata (title, description, canonical) selalu dikirim di <head>, tidak di-stream ke <body>.
  // Default Next 15 hanya melakukannya untuk bot yang dikenal, jadi Lighthouse/crawler lain melihat
  // meta description "hilang" (catatan F0.7 & F1.3b). Halaman ini cepat dirender, jadi tidak ada ruginya.
  htmlLimitedBots: /.*/,
  // Dev: domain lokal brand (mis. ayampanggangwicaksono.localhost:3000) boleh memuat aset & HMR dev server.
  allowedDevOrigins: ["*.localhost"],
  // Header keamanan dasar (audit SEO F6.14). HSTS tanpa includeSubDomains: subdomain www belum semua punya sertifikat.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
