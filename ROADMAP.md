# ROADMAP — Nobitos Web (5 brand + Admin)

> Target selesai semua: **31 Desember 2026** (kerja direncanakan selesai 18 Des, 21–31 Des cadangan). Dibuat 26 Sep 2026, direvisi jadi 3 bulan.
> Dokumen acuan: `PRD.md` (platform) · `BRIEF-Bakmi-Pak-Joko.md` (contoh brief per brand).
> Disesuaikan dengan kode repo per commit `798d253` (27 commit, Milestone 1–7 PRD sudah jalan).

## Cara pakai roadmap ini

- **Disusun per brand**: satu fase = satu brand sampai live. Progres jelas terlihat dan brand lain tidak ikut tersentuh.
- **Dikerjakan per sesi**: satu task (misal `F2.3`) = satu sesi Claude Code. Selesai → centang → commit → sesi baru untuk task berikutnya.
- **Kode bersama di depan (F0)**: fitur yang dipakai semua brand (SEO, status buka, dll) dibuat sekali, lalu tiap brand tinggal isi data.
- Mulai sesi dengan: `Baca ROADMAP.md, kerjakan task <ID> saja.`
- **Link sesi baru otomatis**: setiap task selesai, Claude menampilkan kartu **"New session"** di aplikasi Claude (tab Code) untuk task berikutnya. Klik kartu itu = sesi baru langsung terbuka dengan perintah di atas, tanpa perlu salin-tempel. Kalau kartu tidak muncul, tempel perintah di atas secara manual di sesi baru.

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
10. **Akhir setiap sesi (wajib)**: setelah commit, tentukan task berikutnya = task pertama yang belum dicentang dan tidak menunggu 🙋 Fran, urut sesuai aturan 1 dan 8. Lalu tampilkan kartu sesi baru (`start_session`, context `fresh`) dengan judul `<ID> — <nama singkat task>` dan isi persis `Baca ROADMAP.md, kerjakan task <ID> saja.` Tulis juga ID dan perintah itu di pesan penutup sebagai cadangan. Kalau semua task berikutnya menunggu 🙋 Fran, jangan buat kartu: sebutkan keputusan yang ditunggu.

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
- [x] **F0.5** Komponen standar yang bisa dipakai semua template: status "Buka sekarang / Tutup" dari jam buka, tombol WA click-to-chat dengan pesan awal, tombol Maps, tautan IG/TikTok, halaman 404 per brand, `alt` untuk semua gambar. — 29 Sep 2026, `f084f96` (badge buka/tutup hanya tampil bila jam 7 hari lengkap: Pak Joko & Bolu. IG/TikTok dari kolom Brand: saat deploy jalankan `npm run bakmi-pak-joko:seed` & `npm run bolu:jsonld` supaya link sosial footer tidak hilang. Beranda Bolu tetap tanpa tombol WA, keputusan Fran)
- [x] **F0.6** Rapikan penamaan `data-track` (sudah ±30 titik) supaya konsisten lintas template: `wa-<cabang>`, `maps-<cabang>`, `tel-<cabang>`, `ig`, `tiktok`. Pastikan template ANGLO & EDITORIAL ikut. — 29 Sep 2026, `118114e` (konvensi final disetujui Fran: `<jenis>_click[:<detail>]`, mis. `wa_click:kartini`, `maps_click:amg-ciledug`, `tel_click:<cabang>`, `ig_click`, `tiktok_click`, `menu_click`; detail = slug cabang, posisi tombol tidak masuk nama. Helper `src/lib/track.ts`. Nama lama di DB tidak diubah; Dashboard "Top klik" memetakan nama lama → baru lewat `normalizeTarget`. F6.1 tinggal memecah `jenis` & `detail`)
- [x] **F0.7** Performa: target Lighthouse mobile ≥ 85 di halaman Beranda tiap brand; gambar WebP, font `display: swap`. — 29 Sep 2026, `d0cec20` (diukur di build produksi lokal, median 5 run, Perf/A11y/BP/SEO: Aminoto 86→89/96/96/100, Bolu 90/92/96/100, Pak Joko 92/100/96/91, APW 90/96/96/100. Font sudah `swap` semua. Foto bawaan repo kini WebP. Belum dikerjakan karena mengubah tampilan atau skor sudah ≥ 85: LCP template BOLD jatuh ke teks marquee (foto hero dianggap latar, judul tertutup animasi), kontras warna teks pudar, logo Bolu 414px untuk tampilan kecil, video hero Bolu 2,8 MB, meta description Pak Joko ter-stream ke `<body>`, `favicon.ico` 404 untuk brand tanpa favicon)

## F1 — Bakmi Pak Joko (penyelesaian) · 28 Sep – 16 Okt

- [x] **F1.1** Isi jawaban [CEK] dari Fran: nama tampil (Pak/Mas Joko), ~~jam Ciperna, Rabu libur di kedua cabang~~ (beres 29 Sep: 16.00–23.00, Kartini libur Rabu, Ciperna libur Senin), cerita asal-usul, harga sarapan Bu Joko. — 22 Okt 2026, `a143811` (jawaban Fran 22 Okt: nama tampil **Pak Joko**, logo & menu tetap "Mas Joko TMG"; Pak Joko asli Temanggung, jualan sejak 2026, alasan ke Cirebon ditulis sebagai narasi atas permintaan Fran; alamat Ciperna benar; notice pagi jadi **Sayur Lodeh Bu Joko**, satu lokasi dengan Kartini, mulai 7 ribuan, buka 06.00–12.00; GrabFood/GoFood tidak ditampilkan, sementara pembeli datang langsung. Favicon "PJ" dibuat Claude dari font & warna brand: `public/brands/bakmi-pak-joko/favicon.png`, diisi lewat seed bila kosong. Saat deploy: `npm run bakmi-pak-joko:seed`)
- [x] ~~**F1.2**~~ **Dibatalkan Fran 22 Okt 2026: web Pak Joko tetap pakai ilustrasi, tidak perlu foto asli.** Foto asli (6–10) dari tim konten → cut-out ala stiker, ganti ilustrasi pengganti. — Cek 22 Okt: tim belum punya foto. Fran mengizinkan mengambil foto dari akun sendiri (TikTok/IG @bakmi.pakjoko) bila kualitasnya bagus; nama file & ukuran di `public/brands/bakmi-pak-joko/foto/README.md`. Sementara ilustrasi garis tetap tayang. Dicoba 22 Okt: potongan frame reel IG (bakmi goreng, nyemek, wajan, anglo) → **ditolak Fran (kurang bagus)**, kembali ke ilustrasi. Jangan ulangi dari frame video; tunggu foto asli dari tim.
- [x] **F1.3** Pengaman animasi + slot foto asli + preload font — `37da924`.
- [x] **F1.3b** Cek Lighthouse mobile Beranda, perbaiki kalau < 85. — **Beres 22 Okt 2026 (`8384aa4`, `72e3aee`, `c5bd625`), dikerjakan atas permintaan Fran setelah desain Pak Joko & Bolu dinyatakan final**: build produksi lokal, median 5 run, Perf/A11y/BP/SEO **87/100/79/100**, LCP 3,6 s (sebelumnya 86/100/79/91 di sesi ukur yang sama, 84 di catatan bawah). GSAP tidak lagi diunduh Anglo, Lenis & pageview menunggu `load`, meta description di `<head>` (SEO 100). BP 79 hanya karena HTTP lokal. Catatan lama: Dicek 22 Okt 2026: **masih < 85**. Keputusan Fran 22 Okt: sisa perbaikan dikerjakan lewat **F2.7** (platform, setelah APW). Lewati task ini; centang bersama F2.7 setelah Beranda Pak Joko ≥ 85.
  - Hasil (build produksi lokal, median 7 run, Perf/A11y/BP/SEO): **83/100/76/91** → setelah `52bfe64` (font judul di-subset 51,9 → 20,5 KB) **84**. LCP 3,8 s, FCP 2,0 s, TBT ±200 ms. Situs live (HTTPS) ±60–72, tapi diukur saat CPU laptop sibuk. BP 76 lokal karena HTTP (di live hilang); SEO 91 karena meta description ter-stream ke `<body>` (catatan F0.7).
  - Penyebab: elemen LCP = judul hero (teks). Lighthouse menghitung LCP setelah semua JS halaman, dan Beranda Anglo ikut mengunduh JS template lain: GSAP + ScrollTrigger (±48 KB gzip) dan Lenis, karena Next memuat semua komponen client yang di-import `(public)/layout.tsx` & `(public)/page.tsx` untuk semua brand. Anglo sendiri tidak memakai GSAP. CSS global 62 KB (semua template) juga render-blocking.
  - Sudah dicoba, tidak menolong: `next/dynamic` di server component (chunk tetap ikut), smooth scroll Anglo tanpa GSAP (GSAP tetap terbawa `page.tsx`), `loading.tsx` dipindah ke sub-halaman (SEO 100 tapi FCP naik, skor sama).
  - Perbaikan yang tersisa = tugas platform lintas template (melanggar aturan 3 kalau dikerjakan di sini): GSAP di-`import()` saat dipakai di komponen BOLD/EDITORIAL/TUNGKU, atau Beranda tiap template dipisah jadi pulau client sendiri; CSS per template dipecah dari `globals.css`. Perkiraan: LCP turun ±0,3–0,5 s, skor ≥ 85.
- [x] **F1.4** Terapkan F0 (meta, sitemap, JSON-LD 2 cabang, Buka sekarang, tracking). — 22 Okt 2026, `24baa2b` (dicek di dev lokal: Beranda/Menu/Cabang/Cerita punya `title` & description unik, canonical, OG + Twitter, satu H1, semua `img` ber-`alt`; sitemap 4 halaman, robots + sitemap; `/galeri` & `/menu/[id]` 307; 404 ber-brand + `noindex`; JSON-LD `Restaurant` Kartini & Ciperna di Beranda & Cabang dengan jam, harga, menu, telepon, IG/TikTok, dan kini `geo` dari pin link Google Maps resmi; badge buka/tutup benar (Kamis 11.43: "Tutup · buka lagi 16.00"); klik `wa_click:kartini` & `maps_click:ciperna` tercatat di `AnalyticsEvent`. Belum: favicon, karena belum ada file logo Pak Joko 🙋. Meta description ter-stream ke `<body>` saat Lighthouse ikut keputusan F1.3b)
- [x] **F1.5** Deploy + cek live. — 22 Okt 2026, deploy `998d014` (20 commit di-push atas izin Fran; backup DB `~/backups/web-nobitos-pre-f1-5-20261022-1320.dump`; rumus update + migrasi `f0_4_jsonld_hours_social` & `f2_brand_template_tungku`, lalu `npm run bakmi-pak-joko:seed` & `npm run bolu:jsonld`). Cek live bakmijowopakjoko.web.id: Beranda/Menu/Cabang/Cerita 200 dengan `title`, description & canonical unik, OG, satu H1, semua `img` ber-`alt`; sitemap 4 URL + robots; `/galeri` & `/menu/[id]` 307; 404 ber-brand; JSON-LD `Restaurant` Kartini & Ciperna lengkap (geo, jam, harga, telepon, IG/TikTok); font judul subset 20,5 KB; badge buka/tutup benar (Kamis 13.24 "Tutup"); `data-track` `wa_click`/`maps_click` per cabang ada; 375px tanpa scroll horizontal, console bersih. Aminoto, Bolu (link IG/TikTok tetap ada) & Admin tetap jalan. Klik tracking tidak diuji di live supaya Dashboard tidak kemasukan klik uji (sudah dicek di lokal saat F1.4). APW belum punya domain, jadi template TUNGKU belum tampil di live.

## F2 — Ayam Panggang Wicaksono (APW) · 12 Okt – 6 Nov

Sumber: IG https://www.instagram.com/ayampanggangwicaksono/ · TikTok @ayampanggang.wicaksono · Cabang: **hanya Kesambi** (dikonfirmasi Fran 29 Sep). Cabang **Cipto** di DB lokal & `prisma/seed.ts` adalah **data contoh**: bukan cabang APW, jangan dipakai untuk pengecekan tampilan/JSON-LD/screenshot.

- [ ] **F2.1** 🙋 Fran beli domain (usulan: `ayampanggangwicaksono.web.id`) + arahkan A record ke 43.129.49.26.
> ⏳ Cek 22 Okt: F2.2–F2.5 sudah ada commit (`32ba000`, `94bb0e0`, `5596e63`, `55797d3`) tapi belum dicentang, dan masih ada perubahan template TUNGKU yang belum di-commit. 🙋 Fran konfirmasi dulu hasil F2.3–F2.5 sebelum dicentang.

- [ ] **F2.2** Catatan: brand `apw` sudah ada di DB dengan data contoh (tagline, harga, cabang). Semua diganti data asli. Riset IG/TikTok → `BRIEF-APW.md` (format sama dengan brief Pak Joko): fakta brand, cerita, menu + harga dari sumber resmi, 1 cabang Kesambi (alamat, jam, WA, Maps), tone, daftar [CEK].
- [ ] **F2.3** Usulkan 2–3 referensi desain yang **beda** dari Aminoto/Bolu/Pak Joko. 🙋 Fran pilih satu.
- [ ] **F2.4** Template baru + halaman (Beranda, Menu, Cerita, Cabang), tanpa animasi dulu → screenshot → 🙋 cek Fran.
- [ ] **F2.5** Animasi + F0 → screenshot → 🙋 cek Fran.
- [ ] **F2.6** Seed khusus APW (upsert, **menimpa data contoh brand `apw` saja**): cabang akhir **hanya Kesambi**, cabang contoh Cipto dihapus dari brand `apw`. Lalu deploy (nginx, certbot, seed, build, restart) + cek live: halaman Cabang & JSON-LD hanya berisi 1 cabang (Kesambi).
- [ ] **F2.7** Platform (lintas template, disetujui Fran 22 Okt, kerjakan **setelah F2.6**): pisahkan JS & CSS per template. **Bagian JS sudah 22 Okt** (`72e3aee`, `c5bd625`): GSAP lewat `withGsap()` (`import()` di efek, karena `next/dynamic` di server component ternyata tidak memecah chunk), Lenis & tracking lewat `afterLoad()`. First Load JS Beranda 186 → 142 kB. **Sisa: CSS** (`globals.css` ±62 KB, masih dipakai bersama; tunggu perubahan TUNGKU di-commit). Teks awal: supaya tiap brand hanya mengunduh aset template-nya sendiri. Latar belakang di catatan F1.3b: Next memuat semua komponen client yang di-import `(public)/layout.tsx` & `(public)/page.tsx`, jadi Anglo ikut mengunduh GSAP + ScrollTrigger + Lenis, dan `globals.css` (semua template, ±62 KB) render-blocking di semua brand.
  - JS: GSAP/ScrollTrigger tidak lagi masuk entry route untuk template yang tidak memakainya (mis. `import()` di dalam efek komponen BOLD/EDITORIAL/TUNGKU, atau Beranda & header tiap template dijadikan pulau client lewat `next/dynamic` di komponen client). `next/dynamic` di server component **tidak** memisah chunk (sudah dicoba).
  - CSS: gaya khusus template dipecah dari `globals.css` ke file per template yang hanya dimuat brand terkait.
  - Syarat: tampilan & animasi semua brand tidak berubah (screenshot sebelum/sesudah), tidak ada kedip saat GSAP dimuat belakangan.
  - Ukur sebelum & sesudah, Beranda semua brand (build produksi lokal, median 5–7 run, Chrome dengan `--disable-features=HttpsUpgrades` dan `--host-resolver-rules="MAP <domain> 127.0.0.1:<port>"`; tanpa flag pertama Chrome diam-diam mengukur situs live). Target Performance ≥ 85 semua brand, termasuk Pak Joko (lalu centang F1.3b).

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

- [x] **F5.1** Terapkan F0 (meta, sitemap, JSON-LD cabang Kartini & Pabrik, Buka sekarang, tracking). **Jangan ubah desain.** — 22 Okt 2026, `d75ef34` (meta/sitemap/JSON-LD/badge/tracking sudah live lewat F0, dicek live 22 Okt. Tambahan: alamat 3 cabang lengkap dari pin Google Maps resmi 🙋 Fran cek; favicon 257 → 8 KB; JSON-LD bertipe `Bakery`; video hero 2,8 MB diunduh setelah `load`, poster di-preload. Lighthouse lokal median 5 run: Perf 85–86, SEO 100, LCP 3,6 → 3,3 s. Saat deploy: `npm run bolu:alamat-favicon`)
- [x] **F5.2** Deploy + cek live. — 22 Okt 2026, deploy `a5b67c0` (backup DB `~/backups/web-nobitos-pre-f5-20261022-1510.dump`, rumus update + `npm run bolu:alamat-favicon`). Cek live Bolu: 4 halaman 200, meta description di `<head>`, favicon 8 KB, JSON-LD 3 cabang `Bakery` dengan alamat lengkap, badge "Buka sekarang", video hero `preload=none` lalu berputar setelah load, zoom hero mulai 1.08, console bersih. Pak Joko ikut dicek: 0 chunk GSAP dari 15 script, Lenis & pageview jalan, console bersih. Aminoto & Admin tetap jalan.

## F6 — Admin (nobitos.web.id) · 23 Nov – 11 Des

> Keputusan Fran 22 Okt 2026: selesaikan web semua brand dulu (F1–F5), baru Admin.

- [x] Dashboard analitik, kelola Brand/Konten/Menu/Galeri/Promo/Cabang/Domain, Pengaturan — sudah ada (Milestone 4–6).
- [ ] **F6.1** Dashboard: tambah rincian klik per jenis (WA / Maps / telepon / IG) dan per cabang, memakai penamaan F0.6. Sekarang baru "Top klik" gabungan.
- [ ] **F6.2** Halaman "Kesehatan SEO" (read-only) per brand: meta ada?, sitemap bisa diakses?, JSON-LD valid?, domain ACTIVE + SSL, skor Lighthouse terakhir.
- [x] **F6.3** `noindex` admin, rate-limit login, script `npm run admin:set-password` — sudah ada.
- [ ] **F6.3b** Tulis cara reset password di README (1 perintah VPS).
- [ ] **F6.4** 🙋 Panduan singkat untuk Fran: daftar Google Search Console per domain + submit sitemap, hubungkan ke Google Business Profile tiap cabang.

**Hasil audit Admin 22 Okt 2026** (preview lokal, login Super Admin, semua halaman panel dibuka; tidak ada error console, tidak ada scroll horizontal). Satu task = satu sesi, urut prioritas:

- [ ] **F6.5** Form Brand (`brands/BrandForm.tsx` + `lib/validation.ts`): tambah field `instagramUrl`, `tiktokUrl`, `servesCuisine` (satu per baris). Sekarang kolom F0.4 ini hanya bisa diisi lewat script seed, jadi Aminoto/APW tidak bisa melengkapi link sosial & JSON-LD dari Admin. Simpan → `invalidateBrandCache()`.
- [ ] **F6.6** Form Cabang (`branches/BranchForm.tsx` + actions): editor jam buka 7 hari (Senin–Minggu: jam buka, jam tutup, centang libur) yang menulis ke tabel `BranchHours`. Sekarang Admin hanya punya teks bebas `openHours`, sedangkan badge "Buka sekarang" dan JSON-LD membaca `BranchHours`. Teks `openHours` tetap ada sebagai keterangan tampilan. Daftar cabang menampilkan tanda "Jam 7 hari belum lengkap".
- [ ] **F6.7** Preview brand draft di produksi: brand yang belum publish atau belum punya domain (contoh APW) tidak bisa dilihat sama sekali di produksi (preview `?brand=` / `/preview/<slug>` mati saat `NODE_ENV=production`, dan `resolveBrandSlugByHost` hanya brand `isPublished`). Buat preview khusus admin yang sudah login (mis. `/preview/<slug>` diizinkan bila sesi admin valid, halaman diberi `noindex` + banner "Mode preview"). Tombol "Lihat situs ↗" di header brand jadi "Preview ↗" saat draft/tanpa domain.
- [ ] **F6.8** Konten Halaman sesuai template: tab ini menampilkan semua section (termasuk "template Editorial") untuk semua brand. Tampilkan hanya section yang dipakai template brand itu. Untuk ANGLO (Pak Joko) & TUNGKU (APW), teks hero/cerita masih dikunci di `src/data/brands/*.ts`: tampilkan catatan "Teks halaman ini diatur di kode" supaya admin tidak mengisi form yang tidak berpengaruh.
- [ ] **F6.8b** 🙋 Fran putuskan: perlukah teks ANGLO/TUNGKU dipindah dari `src/data/brands/*.ts` ke DB supaya bisa diubah dari Admin? (Lebih besar: perlu section baru per template + migrasi isi.)
- [ ] **F6.9** Menu harian lebih cepat: di daftar menu, tombol langsung "Tersedia/Habis" dan "Andalan" tanpa buka form per item; urutan item lewat tombol naik/turun (bukan isi angka). Gambar thumbnail daftar pakai `loading="lazy"`.
- [ ] **F6.10** Kelengkapan data per brand: di kartu daftar Brand dan header brand, tampilkan badge kekurangan (IG/TikTok kosong, jam 7 hari belum lengkap, cabang tanpa WA/Maps, menu tanpa foto, domain belum ACTIVE). Bisa digabung dengan F6.2 bila dikerjakan bersamaan.
- [ ] **F6.11** Admin di HP: di layar < 1024px sidebar jadi blok ±200px (menu + "Keluar" 2 baris) sebelum konten. Jadikan bar atas ringkas (menu bisa digeser, "Keluar" pindah ke header kanan). Cek di 375px.

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
