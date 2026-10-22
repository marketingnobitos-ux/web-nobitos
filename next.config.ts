import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Metadata (title, description, canonical) selalu dikirim di <head>, tidak di-stream ke <body>.
  // Default Next 15 hanya melakukannya untuk bot yang dikenal, jadi Lighthouse/crawler lain melihat
  // meta description "hilang" (catatan F0.7 & F1.3b). Halaman ini cepat dirender, jadi tidak ada ruginya.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
