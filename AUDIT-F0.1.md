# Audit F0.1 — Platform & 5 Brand vs Checklist Standar Kuliner

> Tanggal: 29 Sep 2026 · Kode per commit `798d253` · Situs live diambil langsung (curl) hari ini.
> Acuan: `ROADMAP.md` Lampiran A. Audit ini **tidak mengubah kode**.
> Alat bantu: skill `claude-seo` v2.4.0 (checklist technical/schema/local). Runtime Python skill belum jalan (Python ≥ 3.10 belum terpasang), jadi pengecekan dilakukan manual dari HTML live + kode.
> Lighthouse **belum diukur**: kuota harian PageSpeed API habis saat audit. Diukur di F0.7 / F1.3b.

Legenda: ✅ sudah · ⚠️ sebagian · ❌ belum · — belum ada situs

## 1. Gap di platform (berlaku untuk semua brand)

Ini akar sebagian besar gap per brand. Diselesaikan sekali di F0.2–F0.7.

| # | Temuan | Bukti | Task |
|---|---|---|---|
| P1 | Metadata hanya `title` + `description` + favicon. Tidak ada canonical, Open Graph, Twitter card. | `src/app/(public)/layout.tsx` `generateMetadata`; HTML live: 0 tag `og:*`, 0 `rel=canonical` | F0.2 |
| P2 | `description` sama di semua halaman (selalu tagline brand). `title` Beranda = nama brand saja. | Semua halaman live 1 brand punya description identik | F0.2 |
| P3 | `robots.txt` dan `sitemap.xml` tidak ada → **404** di ketiga domain live. | curl `/robots.txt`, `/sitemap.xml` | F0.3 |
| P4 | Tidak ada JSON-LD sama sekali (0 `application/ld+json`). | HTML live semua halaman | F0.4 |
| P5 | Model `Branch` tidak punya jam terstruktur (hanya teks `openHours`), hari libur, maupun kolom sosial. `Brand` tidak punya kolom IG/TikTok. Status "Buka sekarang" dan JSON-LD `openingHoursSpecification` butuh jam terstruktur. | `prisma/schema.prisma` | F0.4, F0.5 (kemungkinan butuh migrasi) |
| P6 | Tidak ada status "Buka sekarang / Tutup" di template mana pun. | grep kode + HTML live | F0.5 |
| P7 | Halaman 404 generik Next.js ("404: This page could not be found.", description "Web etalase multi-brand Nobitos"), tanpa header/footer brand. | `/halaman-tidak-ada` di 3 domain | F0.5 |
| P8 | Tautan sosial tersebar: Bolu dari konten DB (teks bebas), Pak Joko hardcode di `src/data/brands/bakmi-pak-joko.ts`, BOLD tidak punya tempat sama sekali. | kode | F0.5 |
| P9 | Penamaan `data-track` tidak konsisten antar template: `maps-cabang-kartini` (EDITORIAL), `cabang-maps-kartini` (ANGLO), `maps-amg-ciledug` + `maps-cabang-amg-ciledug` (BOLD), `ed-maps-<cuid>` (Beranda Editorial pakai ID database). | HTML live | F0.6 |
| P10 ✅ F0.3 | `/galeri` ANGLO memakai `redirect("/")` di tengah render → HTTP **200** + meta refresh, bukan 307/308. Halaman kosong tanpa H1 ikut bisa terindeks. | `curl -I /galeri` Pak Joko = 200 | F0.3 (keluarkan dari sitemap) / F1.4 |
| P11 ✅ F0.3 (robots Disallow + noindex; status tetap 200) | Domain admin `nobitos.web.id/menu`, `/cabang`, dst. menjawab **200** "Brand tidak ditemukan", bukan 404. Admin sudah `noindex`, tapi halaman ini tidak. | curl | F0.3 (robots per host) |
| P12 | `prefers-reduced-motion` sudah dihormati (GSAP, Lenis, CSS `motion-safe`). HTTPS + redirect http→https aktif. | `src/components/animations/*`, `curl -I http://` = 301 | ✅ tidak perlu task |

## 2. Tabel gap per brand

| Checklist (Lampiran A) | Aminoto (BOLD) | Bolu (EDITORIAL) | Pak Joko (ANGLO) | APW | Bu Joko |
|---|---|---|---|---|---|
| **Informasi wajib** | | | | | |
| Nama, tagline, logo, favicon | ⚠️ tanpa logo & favicon | ⚠️ favicon = gambar 1920px (berat) | ⚠️ tanpa logo gambar & favicon | — data contoh di DB | — |
| Menu + harga teks HTML, per kategori | ⚠️ ada, tapi masih **data contoh** (5 item) | ✅ | ✅ (21 item, 3 kategori) | — menu contoh | — |
| Cabang: alamat lengkap | ❌ alamat umum ("Ciledug, Cirebon") | ⚠️ alamat umum ("Jl. Kartini, Kota Cirebon") | ✅ Kartini · ✅ Ciperna | — | — |
| Cabang: jam buka + hari libur | ⚠️ jam ada (contoh), libur tidak ada | ❌ jam tidak tampil di 3 cabang | ⚠️ Kartini ada · Ciperna kosong [CEK F1.1] | — | — |
| Cabang: tombol Maps | ✅ 3 cabang | ✅ 3 cabang | ✅ 2 cabang | — | — |
| Cabang: tombol WA | ❌ tidak ada WA sama sekali | ⚠️ ada + pesan awal, tapi 1 nomor untuk 3 cabang | ⚠️ ada, tanpa pesan awal | — | — |
| Status "Buka sekarang / Tutup" | ❌ | ❌ | ❌ | — | — |
| Tautan IG/TikTok resmi | ❌ tidak ada | ✅ IG + TikTok (+Threads) | ⚠️ IG saja, TikTok belum ada | — | — |
| Cerita brand bersumber | ⚠️ teks seed contoh | ✅ | ⚠️ menunggu [CEK F1.1] | — | — |
| **SEO** | | | | | |
| `title` & `description` unik per halaman | ⚠️ title unik, description sama | ⚠️ sama | ⚠️ sama | — | — |
| Open Graph + gambar share | ❌ | ❌ | ❌ | — | — |
| `sitemap.xml`, `robots.txt`, canonical | ❌ | ❌ | ❌ | — | — |
| JSON-LD `Restaurant` per cabang | ❌ | ❌ | ❌ | — | — |
| Satu H1 per halaman, heading urut | ✅ | ✅ | ⚠️ `/galeri` tanpa H1 (lihat P10) | — | — |
| `alt` di semua gambar | ✅ (hero `alt=""` dekoratif) | ⚠️ 5 foto chapter Beranda `alt=""` padahal foto konten | ✅ (ilustrasi SVG, belum ada `<img>`) | — | — |
| Terdaftar di Search Console | ❌ (F6.4) | ❌ | ❌ | — | — |
| **Kualitas** | | | | | |
| Lighthouse mobile Perf ≥ 85, A11y ≥ 90 | belum diukur | belum diukur | belum diukur | — | — |
| Nyaman di 375px, tanpa scroll horizontal | belum dicek (F7.1) | belum dicek | belum dicek | — | — |
| Animasi hormati `prefers-reduced-motion` | ✅ | ✅ | ✅ | — | — |
| HTTPS aktif, domain ACTIVE | ✅ | ✅ | ✅ | ❌ belum ada domain | ❌ belum ada domain |
| Klik WA/Maps tercatat | ⚠️ Maps saja (WA tidak ada) | ✅ (nama belum seragam) | ✅ (nama belum seragam) | — | — |

**Ringkas:** tiga brand live sama-sama kosong di OG, sitemap/robots, canonical, JSON-LD, dan status buka (semua gap platform). Gap data paling besar ada di **Aminoto** (alamat, WA, sosial, menu, cerita masih contoh) dan **Bolu** (jam buka, alamat lengkap, nomor WA per cabang).

## 3. Catatan data & keputusan untuk Fran 🙋

1. **APW — jumlah cabang.** ROADMAP F2 menulis 2 cabang (Cipto, Kesambi). Catatan audit manual Fran (`TEMUAN SETELAH DI AUDIT...txt` poin 1) menulis APW **hanya cabang Kesambi**, Cipto dihapus. Mohon konfirmasi mana yang benar sebelum F2.2.
2. **Bolu — nomor WA.** Ketiga cabang memakai nomor yang sama (0851-6520-6098). Apakah memang satu nomor pusat, atau tiap cabang punya nomor sendiri?
3. **Bolu — jam buka** tiap cabang belum ada di data. Dibutuhkan untuk "Buka sekarang" dan JSON-LD.
4. **Pak Joko — TikTok.** Belum ada akun TikTok di data. Ada atau tidak?
5. **`prisma/seed.ts` masih berisi brand `bakmi-jowo` dan `bu-joko` versi contoh** (nama "Mas Joko", "Warung Bu Joko"). Aman selama seed penuh tidak dijalankan di VPS (aturan 6). Perlu diingat saat F3.6: brand baru `dapur-bu-joko` beda slug dengan `bu-joko` contoh.

### Jawaban Fran (29 Sep 2026)

- APW: **Kesambi saja**. Cabang Cipto tidak dipakai. ROADMAP F2 sudah disesuaikan.
- Bolu: satu nomor WA untuk semua cabang **memang benar**.
- Pak Joko TikTok: https://www.tiktok.com/@bakmi.pakjoko (dipasang di F0.4/F0.5).
- Jam buka Bolu (dikirim Fran 29 Sep, semua cabang di Kota/Kab. Cirebon): **Stasiun Kejaksan 06.00–21.00**, **Kartini 08.00–21.00**, **Kedawung 08.00–21.00**. Hari libur belum disebut. Dimasukkan ke data lewat seed Bolu di F0.4.

## 4. Masukan untuk task F0 berikutnya

- **F0.2**: tambah `metadataBase` dari hostname, canonical, OG/Twitter, description per halaman (Beranda: tagline + kota; Menu: kategori + kisaran harga; Cabang: daftar nama cabang). Gambar OG per brand perlu kolom/asset baru.
- **F0.3**: `robots.ts` + `sitemap.ts` per hostname. Host admin → `Disallow: /`. Jangan masukkan `/galeri` untuk ANGLO. Perbaiki P10/P11 agar status HTTP benar.
- **F0.4 + F0.5**: putuskan dulu format jam terstruktur (mis. JSON per hari + hari libur) di `Branch`, plus kolom sosial di `Brand`. ANGLO membaca dari `src/data/brands`, jadi komponen perlu menerima data dari dua sumber. Butuh migrasi Prisma → ikuti aturan seed per brand.
- **F0.6**: usulan pola tunggal `wa-<cabang>`, `maps-<cabang>`, `tel-<cabang>`, `ig`, `tiktok`, dengan `<cabang>` = slug nama cabang (bukan ID database). Posisi (header/footer/kartu) bisa dipisah ke atribut lain agar Dashboard F6.1 tetap bisa merinci.
- **F0.7**: ukur Lighthouse lokal (Chrome DevTools) atau PageSpeed setelah kuota pulih. Kecilkan favicon Bolu (sekarang 1920px).
