# ROADMAP — Nobitos Web (5 brand + Admin)

> Target selesai semua: **31 Desember 2026** (kerja direncanakan selesai 18 Des, 21–31 Des cadangan). Dibuat 26 Sep 2026, direvisi jadi 3 bulan.
> Dokumen acuan: `PRD.md` (platform) · `BRIEF-Bakmi-Pak-Joko.md` (contoh brief per brand).
> Disesuaikan dengan kode repo per commit `798d253` (27 commit, Milestone 1–7 PRD sudah jalan).

## Cara pakai roadmap ini

- **Disusun per brand**: satu fase = satu brand sampai live. Progres jelas terlihat dan brand lain tidak ikut tersentuh.
- **Dikerjakan per sesi**: satu task (misal `F2.3`) = satu sesi Claude Code. Selesai → centang → commit → sesi baru untuk task berikutnya.
- **Kode bersama di depan (F0)**: fitur yang dipakai semua brand (SEO, status buka, dll) dibuat sekali, lalu tiap brand tinggal isi data.
- Mulai sesi dengan: `Baca ROADMAP.md, kerjakan task <ID> saja.`

## Aturan kerja untuk Claude Code

1. Kerjakan **satu task per sesi**, urut sesuai ID. Jangan loncat fase kecuali Fran minta.
2. Sebelum mulai, baca task + dokumen acuannya. Kalau ada yang ambigu atau butuh keputusan Fran (ditandai 🙋), **berhenti dan tanya**.
3. Setiap brand punya **template sendiri**. Saat ini: BOLD (Aminoto, APW), EDITORIAL (Bolu), ANGLO (Pak Joko). APW dan Bu Joko akan dapat template baru. Jangan ubah template/brand lain saat mengerjakan satu brand.
4. **Admin sudah lengkap** (lihat Ringkasan). Jangan hapus modul Admin yang ada; tambah fitur hanya jika tercantum di task.
5. Selesai task: centang `[x]`, tulis tanggal + hash commit di baris task, commit. **Jangan push** tanpa izin Fran.
6. Data brand ke DB VPS **selalu lewat seed khusus per brand** (upsert, idempoten, tidak menyentuh brand lain). Jangan jalankan `prisma db seed` penuh di VPS.
7. Web brand = etalase (cerita + menu + lokasi). **Tidak ada** pemesanan/keranjang/link ojol.
8. Urutan brand: **satu brand selesai (live) dulu baru pindah ke brand berikutnya**, kecuali F0/F6 yang lintas brand.
9. Setiap perintah VPS yang diberikan ke Fran: siap tempel, satu baris per langkah, tanpa placeholder `[ ]`, selalu diawali `cd /home/ubuntu/web-nobitos &&` bila perlu folder app.

## Ringkasan status

| # | Halaman | Domain | Template | Status 26 Sep | Fase |
|---|---|---|---|---|---|
| 1 | Admin | nobitos.web.id | — | **Live, lengkap**: Dashboard analitik (tren, per brand, top halaman, top klik), Brand, Konten Halaman, Menu, Galeri (upload), Promo, Cabang, Domain, Pengaturan, login ber-rate-limit, noindex | F6 (tambahan kecil) |
| 2 | Pecel Lele Aminoto | pecelleleaminoto.web.id | BOLD | Live, data seed masih contoh (alamat umum) · scope diputuskan 30 Okt 🙋 | F4 |
| 3 | Bolu Sunyaragi | bolusunyaragi.web.id | EDITORIAL/byshape | Live, beres | F5 (SEO saja) |
| 4 | Bakmi Pak Joko | bakmijowopakjoko.web.id | ANGLO | Live 26 Sep | F1 |
| 5 | Ayam Panggang Wicaksono | belum ada | BOLD → baru | Sudah ada di DB dengan **data contoh**, belum ada domain | F2 |
| 6 | Dapur Bu Joko | belum ada | baru | Belum ada di DB sama sekali | F3 |

---

## F0 — Fondasi "Standar Web Kuliner" + SEO (platform, sekali untuk semua) · 28 Sep – 9 Okt

Dibangun sekali di platform, lalu tiap brand tinggal isi data.

- [x] **F0.1** Audit singkat platform & 5 brand terhadap checklist Standar Kuliner (lampiran A). Hasil: tabel gap per brand. Tidak mengubah kode. — 29 Sep 2026, `2a52aec` → `AUDIT-F0.1.md`
- [x] **F0.2** Lengkapi metadata (sekarang baru `title`, `description`, favicon): canonical, Open Graph + gambar OG per brand, `title` unik per halaman. — 29 Sep 2026, `6bcb467` (gambar OG dibuat otomatis di `/og-image` dari nama, tagline & warna brand)
- [x] **F0.3** `sitemap.xml` dan `robots.txt` per domain (dihasilkan dari hostname). — 29 Sep 2026, `d82c6ba` (+ redirect ANGLO `/galeri` & `/menu/[id]` jadi 307, `noindex` di halaman "Brand tidak ditemukan")
- [x] **F0.4** JSON-LD `Restaurant` per cabang: nama, alamat, geo, `openingHoursSpecification`, `servesCuisine`, `priceRange`, `menu` (URL), `sameAs` (IG/TikTok), telepon/WA. — 29 Sep 2026, `f3f39d8` (migrasi `f0_4_jsonld_hours_social`: tabel `BranchHours` + `Brand.instagramUrl/tiktokUrl/servesCuisine`. Data terisi: Pak Joko & Bolu. Aminoto/APW belum ada jam/sosial/cuisine → tidak dirender. Saat deploy: `prisma migrate deploy`, `npm run bakmi-pak-joko:seed`, `npm run bolu:jsonld`)
- [ ] **F0.5** Komponen standar yang bisa dipakai semua template: status "Buka sekarang / Tutup" dari jam buka, tombol WA click-to-chat dengan pesan awal, tombol Maps, tautan IG/TikTok, halaman 404 per brand, `alt` untuk semua gambar.
- [ ] **F0.6** Rapikan penamaan `data-track` (sudah ±30 titik) supaya konsisten lintas template: `wa-<cabang>`, `maps-<cabang>`, `tel-<cabang>`, `ig`, `tiktok`. Pastikan template ANGLO & EDITORIAL ikut.
- [ ] **F0.7** Performa: target Lighthouse mobile ≥ 85 di halaman Beranda tiap brand; gambar WebP, font `display: swap`.

## F1 — Bakmi Pak Joko (penyelesaian) · 28 Sep – 16 Okt

- [ ] **F1.1** 🙋 Isi jawaban [CEK] dari Fran: nama tampil (Pak/Mas Joko), ~~jam Ciperna, Rabu libur di kedua cabang~~ (beres 29 Sep: 16.00–23.00, Kartini libur Rabu, Ciperna libur Senin), cerita asal-usul, harga sarapan Bu Joko.
- [ ] **F1.2** 🙋 Foto asli (6–10) dari tim konten → cut-out ala stiker, ganti ilustrasi pengganti.
- [x] **F1.3** Pengaman animasi + slot foto asli + preload font — `37da924`.
- [ ] **F1.3b** Cek Lighthouse mobile Beranda, perbaiki kalau < 85.
- [ ] **F1.4** Terapkan F0 (meta, sitemap, JSON-LD 2 cabang, Buka sekarang, tracking).
- [ ] **F1.5** Deploy + cek live.

## F2 — Ayam Panggang Wicaksono (APW) · 12 Okt – 6 Nov

Sumber: IG https://www.instagram.com/ayampanggangwicaksono/ · TikTok @ayampanggang.wicaksono · Cabang: **hanya Kesambi** (dikonfirmasi Fran 29 Sep). Cabang **Cipto** di DB lokal & `prisma/seed.ts` adalah **data contoh**: bukan cabang APW, jangan dipakai untuk pengecekan tampilan/JSON-LD/screenshot.

- [ ] **F2.1** 🙋 Fran beli domain (usulan: `ayampanggangwicaksono.web.id`) + arahkan A record ke 43.129.49.26.
- [ ] **F2.2** Catatan: brand `apw` sudah ada di DB dengan data contoh (tagline, harga, cabang). Semua diganti data asli. Riset IG/TikTok → `BRIEF-APW.md` (format sama dengan brief Pak Joko): fakta brand, cerita, menu + harga dari sumber resmi, 1 cabang Kesambi (alamat, jam, WA, Maps), tone, daftar [CEK].
- [ ] **F2.3** Usulkan 2–3 referensi desain yang **beda** dari Aminoto/Bolu/Pak Joko. 🙋 Fran pilih satu.
- [ ] **F2.4** Template baru + halaman (Beranda, Menu, Cerita, Cabang), tanpa animasi dulu → screenshot → 🙋 cek Fran.
- [ ] **F2.5** Animasi + F0 → screenshot → 🙋 cek Fran.
- [ ] **F2.6** Seed khusus APW (upsert, **menimpa data contoh brand `apw` saja**): cabang akhir **hanya Kesambi**, cabang contoh Cipto dihapus dari brand `apw`. Lalu deploy (nginx, certbot, seed, build, restart) + cek live: halaman Cabang & JSON-LD hanya berisi 1 cabang (Kesambi).

## F3 — Dapur Bu Joko (sarapan) · 9 Nov – 4 Des

Sumber: IG @sayurlodeh.bujoko · Lokasi: Jl. Kartini No.4, Kebonbaru (sama dengan Bakmi Pak Joko Kartini, beda jam).

- [ ] **F3.1** 🙋 Fran beli domain (usulan: `dapurbujoko.web.id`) + A record ke 43.129.49.26.
- [ ] **F3.2** Riset IG → `BRIEF-Bu-Joko.md`. 🙋 Konfirmasi jam buka pagi & harga.
- [ ] **F3.3** Usulkan 2–3 referensi desain (nuansa pagi, rumahan). 🙋 Fran pilih.
- [ ] **F3.4** Template + halaman → screenshot → 🙋 cek.
- [ ] **F3.5** Animasi + F0 + notice timbal balik: Bu Joko ↔ Bakmi Pak Joko ("sore di tempat yang sama").
- [ ] **F3.6** Brand baru `dapur-bu-joko`: seed khusus + deploy + cek live.

## F4 — Pecel Lele Aminoto · 2 – 20 Nov

- [ ] **F4.1** 🙋 Fran putuskan scope (paling lambat 30 Okt): (a) SEO & standar saja, (b) + konten ulang dari riset IG, atau (c) + template baru.
- [ ] **F4.2** Kerjakan sesuai scope F4.1. Minimal: cek data live di Admin (alamat cabang di seed masih umum, mis. "Ciledug, Cirebon"), lengkapi alamat/jam/WA/Maps asli, terapkan F0 untuk 3 cabang (AMG Ciledug, AMC Cipto, AMS Sumber).
- [ ] **F4.2b** Karena APW pindah template, BOLD tinggal dipakai Aminoto. Tidak perlu template baru kecuali F4.1 memilih (c).
- [ ] **F4.3** Deploy + cek live.

## F5 — Bolu Sunyaragi (desain beres, SEO saja) · 12 – 16 Okt

- [ ] **F5.1** Terapkan F0 (meta, sitemap, JSON-LD cabang Kartini & Pabrik, Buka sekarang, tracking). **Jangan ubah desain.**
- [ ] **F5.2** Deploy + cek live.

## F6 — Admin (nobitos.web.id) · 23 Nov – 11 Des

- [x] Dashboard analitik, kelola Brand/Konten/Menu/Galeri/Promo/Cabang/Domain, Pengaturan — sudah ada (Milestone 4–6).
- [ ] **F6.1** Dashboard: tambah rincian klik per jenis (WA / Maps / telepon / IG) dan per cabang, memakai penamaan F0.6. Sekarang baru "Top klik" gabungan.
- [ ] **F6.2** Halaman "Kesehatan SEO" (read-only) per brand: meta ada?, sitemap bisa diakses?, JSON-LD valid?, domain ACTIVE + SSL, skor Lighthouse terakhir.
- [x] **F6.3** `noindex` admin, rate-limit login, script `npm run admin:set-password` — sudah ada.
- [ ] **F6.3b** Tulis cara reset password di README (1 perintah VPS).
- [ ] **F6.4** 🙋 Panduan singkat untuk Fran: daftar Google Search Console per domain + submit sitemap, hubungkan ke Google Business Profile tiap cabang.

## F7 — QA akhir & serah terima · 14 – 18 Des

- [ ] **F7.1** Cek 6 halaman di HP & desktop: tidak ada error console, tidak ada scroll horizontal, semua tombol WA/Maps benar.
- [ ] **F7.2** Cek checklist Standar Kuliner (lampiran A) terpenuhi di 5 brand.
- [ ] **F7.3** Backup DB (`pg_dump`) + catat versi/commit yang live.
- [ ] **F7.4** Ringkasan untuk Fran: apa yang live, apa yang masih [CEK].

## Cadangan · 21 – 31 Des

Tidak ada task terjadwal. Dipakai hanya jika ada fase yang mundur, atau untuk revisi kecil. Minggu Natal.

---

## Lampiran A — Checklist Standar Web Kuliner (Definition of Done per brand)

**Informasi wajib**
- [ ] Nama brand, tagline, logo, favicon
- [ ] Menu lengkap + harga (teks HTML, bukan gambar), dikelompokkan per kategori
- [ ] Semua cabang: alamat lengkap, jam buka + hari libur, tombol Maps, tombol WA
- [ ] Status "Buka sekarang / Tutup"
- [ ] Tautan IG/TikTok resmi
- [ ] Cerita brand singkat (tanpa klaim yang tidak bersumber)

**SEO**
- [ ] `title` & `description` unik per halaman
- [ ] Open Graph + gambar share per brand
- [ ] `sitemap.xml`, `robots.txt`, canonical
- [ ] JSON-LD `Restaurant` per cabang lolos Rich Results Test
- [ ] Heading berurutan (satu H1 per halaman), `alt` di semua gambar
- [ ] Domain terdaftar di Google Search Console (dikerjakan Fran, F6.4)

**Kualitas**
- [ ] Lighthouse mobile Performance ≥ 85, Accessibility ≥ 90
- [ ] Nyaman di HP 375px, tidak ada scroll horizontal
- [ ] Animasi hormati `prefers-reduced-motion`
- [ ] HTTPS aktif, domain ACTIVE di Admin
- [ ] Klik WA/Maps tercatat di Dashboard

## Lampiran B — Yang dibutuhkan dari Fran

| Paling lambat | Apa | Untuk |
|---|---|---|
| 2 Okt | Jawaban [CEK] Pak Joko | F1.1 |
| 9 Okt | Foto Pak Joko · beli domain APW + A record ke 43.129.49.26 | F1.2, F2.1 |
| 16 Okt | Pilih referensi desain APW | F2.3 |
| 23 Okt | Foto APW | F2 |
| 30 Okt | Keputusan scope Aminoto · beli domain Bu Joko | F4.1, F3.1 |
| 13 Nov | Pilih referensi Bu Joko + jam & harga sarapan | F3.2, F3.3 |
| 20 Nov | Foto Bu Joko | F3 |
| 11 Des | Daftar Search Console & Google Business Profile | F6.4 |

## Risiko

- **Jadwal longgar:** brand dikerjakan satu per satu dengan jeda ±1 minggu, plus 2 minggu cadangan. Telat 1 minggu di satu keputusan masih aman untuk target 31 Des.
- **Foto:** tanpa foto asli, tampilan hanya "mirip gaya". Ilustrasi pengganti tetap boleh tayang.
- **VPS:** ada notifikasi "System restart required" dan CPU tinggi saat build. Jadwalkan reboot malam hari setelah backup, di luar jam buka.
- **Libur akhir tahun:** minggu Natal sengaja dijadikan cadangan.
