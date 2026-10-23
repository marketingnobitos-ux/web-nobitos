# Audit F7.2 — Checklist Standar Kuliner (Lampiran A) di 5 brand

> Tanggal: 23 Okt 2026 · Versi live: deploy `b74efa6` (dicek `git log -1` di VPS) · Audit **baca saja**, tidak mengubah kode, DB, atau server.
> Acuan: `ROADMAP.md` Lampiran A. Pembanding: `AUDIT-F0.1.md` (29 Sep 2026).
> Cara cek: HTML live 4 domain × Beranda/Menu/Cabang/Cerita + sitemap/robots (curl), badge buka/tutup di browser (dirender di sisi klien), Google Rich Results Test (`/cabang` tiap domain), PageSpeed Insights web (mobile, 1 run per domain; API PageSpeed kena kuota harian), query baca-saja DB VPS (Domain, Branch, AnalyticsEvent), kode untuk `prefers-reduced-motion`. Hasil F7.1 (375px, console, tombol WA/Maps) dipakai ulang.

Legenda: ✅ terpenuhi · ⚠️ sebagian · ❌ belum · — belum ada situs

## 1. Tabel per brand

| Checklist (Lampiran A) | Aminoto (DADAK) | Bolu (EDITORIAL) | Pak Joko (ANGLO) | APW (GERABAH) | Bu Joko |
|---|---|---|---|---|---|
| **Informasi wajib** | | | | | |
| Nama, tagline, logo, favicon | ✅ logo = wordmark teks (desain DADAK), favicon 200 | ✅ logo gambar, favicon 8 KB | ✅ logo = wordmark teks (desain ANGLO), favicon "PJ" | ✅ logo gambar, favicon | — |
| Menu + harga teks HTML per kategori | ✅ 36 item, 5 kategori | ✅ 5 kategori, harga teks | ✅ 21 item, 3 kategori | ✅ 20 item, 3 kategori | — |
| Cabang: alamat lengkap | ⚠️ Cipto & Sumber lengkap; Ciledug "Dekat pintu tol Ciledug" tanpa nama jalan/nomor | ✅ 3 cabang | ⚠️ Kartini tanpa kode pos; Ciperna tanpa kota/kabupaten & kode pos | ✅ | — |
| Cabang: jam buka + hari libur | ✅ "11.00 – 22.00 setiap hari" | ❌ jam & "tanpa libur" tidak tertulis di halaman; hanya badge "Buka sekarang · sampai 21.00" (JSON-LD sudah benar, `Branch.openHours` kosong di DB VPS) | ✅ Kartini Rabu libur, Ciperna Senin libur | ✅ tabel 7 hari, Kamis libur | — |
| Cabang: tombol Maps | ✅ 3 cabang | ✅ 3 cabang | ✅ 2 cabang | ⚠️ ada, tapi pencarian alamat, bukan pin (F6.14 Paket 3) | — |
| Cabang: tombol WA | ✅ 3 cabang + catering | ✅ 1 nomor pusat untuk 3 cabang (benar, kata Fran) | ✅ 2 cabang | ❌ belum ada nomor WA (F6.14 Paket 3) | — |
| Status "Buka sekarang / Tutup" | ✅ | ✅ | ✅ | ✅ | — |
| Tautan IG/TikTok resmi | ✅ | ✅ (+ Threads) | ✅ | ✅ | — |
| Cerita brand bersumber | ✅ tanpa tahun/pendiri karangan (F4.1) | ✅ | ✅ narasi disetujui Fran (F1.1) | ✅ dari caption TikTok resmi (`BRIEF-APW.md`) | — |
| **SEO** | | | | | |
| `title` & `description` unik per halaman | ✅ 4 halaman | ✅ 4 halaman + Galeri | ✅ 4 halaman | ✅ 4 halaman | — |
| Open Graph + gambar share | ✅ `/og-image` 200 | ✅ | ✅ | ✅ | — |
| `sitemap.xml`, `robots.txt`, canonical | ✅ | ✅ (sitemap + `/galeri`) | ✅ | ✅ | — |
| JSON-LD `Restaurant` per cabang lolos Rich Results Test | ✅ 3 Local business valid, tanpa catatan | ✅ 3 valid; catatan opsional: `servesCuisine` kosong | ✅ 2 valid; catatan opsional: `postalCode` (2 cabang), `addressLocality` (Ciperna) | ✅ 1 valid; catatan opsional: `telephone` (dan tanpa `geo`) | — |
| Satu H1, heading urut, `alt` semua gambar | ✅ | ✅ | ⚠️ `/cerita` loncat H1 → H3 (nama cabang); lainnya urut. Tanpa `<img>` | ✅ (`alt=""` hanya logo di samping nama & slide hero yang tersembunyi) | — |
| Terdaftar di Search Console | ❌ F6.4 (Fran) | ❌ | ❌ | ❌ | — |
| **Kualitas** | | | | | |
| Lighthouse mobile Perf ≥ 85, A11y ≥ 90 (PageSpeed Insights, 1 run) | ✅ 97 / 100 | ✅ 87 / 96 | ✅ 93 / 100 | ✅ 85 / 96 (pas di batas) | — |
| Nyaman di 375px, tanpa scroll horizontal | ✅ (F7.1) | ✅ | ✅ | ✅ | — |
| Animasi hormati `prefers-reduced-motion` | ✅ | ✅ | ✅ | ✅ | — |
| HTTPS aktif, domain ACTIVE di Admin | ✅ ACTIVE + SSL | ✅ | ✅ | ✅ | ❌ belum ada domain |
| Klik WA/Maps tercatat di Dashboard | ✅ `wa_click:*` tercatat | ✅ WA & Maps tercatat | ✅ WA tercatat | ⚠️ `maps_click:kesambi` terpasang, belum ada klik tercatat (trafik baru 2 hari); WA belum ada | — |

**Ringkas:** Aminoto, Bolu, Pak Joko dan APW memenuhi hampir semua butir. Butir yang belum: Search Console (4 domain, F6.4), jam buka Bolu tidak tertulis di halaman, WA & pin Maps APW, alamat Ciperna & Ciledug kurang lengkap. **Bu Joko** belum punya situs (F3 ditahan sejak 23 Okt), jadi belum ada butir yang bisa dicek.

Detail PageSpeed (mobile, 23 Okt ±16.30): Pak Joko LCP 2,6 s · TBT 160 ms · CLS 0,036; Aminoto LCP 2,6 s · TBT 60 ms; Bolu LCP 3,7 s · TBT 160 ms; APW FCP 2,3 s · LCP 3,6 s. Best Practices & SEO 100 di keempat domain. Satu run saja, jadi angka bisa naik-turun ±5; APW paling rawan turun di bawah 85 (sebab LCP: animasi `gr-dish-in`, keputusan Fran masih ditunggu).

## 2. Yang perlu ditindaklanjuti

| # | Brand | Temuan | Siapa | Cara |
|---|---|---|---|---|
| 1 ✅ beres 23 Okt (F7.3) | Bolu | Jam buka & "buka setiap hari" tidak tertulis di halaman Cabang/footer. Data jam 7 hari ada (badge & JSON-LD benar), tapi teks `openHours` 3 cabang kosong di DB VPS, padahal template membaca teks itu. | Claude (perlu izin ubah DB VPS) atau admin | Admin > Bolu > Lokasi & Jam Buka > simpan ulang tiap cabang (teks jam terisi otomatis bila kosong & jam seragam), atau seed `bolu` kecil yang mengisi `openHours`. Hasil: "08.00–21.00 setiap hari", Kedawung "08.00–20.00", Stasiun "06.00–21.00". |
| 2 | Bolu | `servesCuisine` kosong (opsional di Rich Results). | Admin | Admin > Profil Brand > "Jenis masakan", mis. "Kue", "Bolu Gulung". |
| 3 | APW | Belum ada tombol WA; Maps masih pencarian alamat; JSON-LD tanpa `telephone` & `geo`. | 🙋 Fran (data) | F6.14 Paket 3: kirim nomor WA & link pin Google Maps Kesambi. |
| 4 | Pak Joko | Alamat Kartini tanpa kode pos; Ciperna tanpa "Kabupaten Cirebon" & kode pos (`addressLocality` hilang di JSON-LD). | 🙋 Fran / admin | Admin > Lokasi & Jam Buka: lengkapi alamat (F6.14 Paket 3). |
| 5 | Aminoto | Alamat Ciledug hanya "Dekat pintu tol Ciledug, Ciledug Kulon…" tanpa nama jalan/nomor. | 🙋 Fran [CEK] | Konfirmasi alamat dari pin Google Maps, isi di Admin. |
| 6 | Semua | Search Console + Google Business Profile. | 🙋 Fran | F6.4. |
| 7 ✅ kode 23 Okt, belum deploy | Pak Joko | `/cerita` heading loncat H1 → H3 (kartu cabang Kartini/Ciperna). | Claude (kode ANGLO, kecil) | Jadikan nama cabang H2 di halaman Cerita, atau tambah H2 bagian "Cabang". |
| 8 ✅ ukur ulang 23 Okt: 3 run 94/91/90 | APW | Lighthouse 85, pas di batas. | 🙋 Fran | Keputusan animasi `gr-dish-in` (sudah ada di "Menunggu Fran"). |
| 9 | Bolu | 5 foto chapter Beranda masih dari `/placeholder/`. Bukan butir Lampiran A, tapi foto bukan milik brand. | 🙋 Fran (foto asli) | F6.14 Paket 3. |
| 10 | Bu Joko | Belum ada situs. | 🙋 Fran | F3 ditahan sampai operasional siap. |

## 3. Catatan lain

- DB VPS masih menyimpan brand contoh `bakmi-jowo` dan `bu-joko` (tidak publish, tanpa domain, jadi tidak tampil di publik). Perlu diingat saat F3.6: slug brand baru `dapur-bu-joko` berbeda dari `bu-joko` contoh.
- Data klik lama Bolu masih memakai nama sebelum F0.6 (`footer-maps-*`, `maps-cabang-*`, `ed-maps-<id>`); Dashboard memetakannya lewat `normalizeTarget`, jadi tetap terhitung.
- `streetAddress` di JSON-LD Aminoto & Bolu memuat ulang kota dan kode pos (sudah ada di `addressLocality`/`postalCode`). Lolos Rich Results Test; kosmetik saja.
