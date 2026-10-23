# Serah terima Web Nobitos — 23 Okt 2026

> Untuk Fran. Ringkasan apa yang sudah live dan apa yang masih menunggu jawaban/data ([CEK]).
> Versi live: kode `00f46e2` (deploy 23 Okt sore). Backup DB terakhir: `~/backups/web-nobitos-f7-3-20261023-1643.dump`.
> Daftar kerja yang bisa dicentang: artifact **PR Web Nobitos** https://claude.ai/artifact/Ta7PAsnkmLrhvfvi1bHyBV

## 1. Status singkat

| Situs | Alamat | Status |
|---|---|---|
| Pecel Lele Sambel Dadak Aminoto | https://pecelleleaminoto.web.id | **Live, lengkap** |
| Bolu Sunyaragi | https://bolusunyaragi.web.id | **Live, lengkap** (5 foto cerita di Beranda masih foto contoh) |
| Bakmi Jowo Anglo Pak Joko | https://bakmijowopakjoko.web.id | **Live, lengkap** |
| Ayam Panggang Wicaksono (APW) | https://ayampanggangwicaksono.web.id | **Live**, belum ada tombol WhatsApp (pin Maps sudah resmi) |
| Sayur Lodeh Bu Joko | belum ada | **Ditahan** sejak 23 Okt sampai operasional siap |
| Admin | https://nobitos.web.id | **Live, lengkap** |

Skor PageSpeed HP (23 Okt, median 3 run, target ≥ 85): Pak Joko 95 · Bolu 94 · Aminoto 93 · APW 91. Aksesibilitas 96–100, SEO 100 di semua.

## 2. Yang sudah live per situs

**Aminoto** — template DADAK (hijau tua + hijau stabilo). Beranda, Menu (36 menu, 5 kategori, harga dari daftar menu Cipto), Cerita, Cabang (Cipto, Sumber, Ciledug: alamat, jam 11.00–22.00 setiap hari, WA tiap cabang, telepon, Maps, rating Google). Nomor catering tersendiri. Foto dari reel IG/TikTok resmi.

**Bolu Sunyaragi** — template EDITORIAL (desain lama dipertahankan). Beranda dengan video proses, Menu (5 kategori), Galeri, Cerita, Cabang (Kartini 08.00–21.00, Kedawung 08.00–20.00, Stasiun Kejaksan 06.00–21.00, setiap hari; 1 nomor WA pusat). Alamat dari pin Google Maps resmi.

**Pak Joko** — template ANGLO (ilustrasi garis, tanpa foto sesuai keputusan Fran). Beranda, Menu (21 menu, 3 kategori), Cerita (asal Temanggung), Cabang (Kartini 16.00–23.00 Rabu libur, Ciperna 16.00–23.00 Senin libur). Info pagi "Sayur Lodeh Bu Joko" di kartu Kartini.

**APW** — template GERABAH. Beranda, Menu (20 menu, 3 kategori), Cerita (buka sejak 14 Juni 2026, dari caption TikTok resmi), Cabang (hanya Kesambi, 16.00–00.00, Kamis libur). 15 foto dari video TikTok resmi.

## 3. Yang sama di semua web brand

- Judul & deskripsi Google berbeda tiap halaman, gambar share WhatsApp/medsos per brand, `sitemap.xml`, `robots.txt`, alamat utama (canonical).
- Data Google per cabang (alamat, jam, harga, telepon, IG/TikTok) — lolos Google Rich Results Test.
- Badge "Buka sekarang / Tutup" otomatis dari jam buka.
- Tombol WA dengan pesan pembuka, tombol Maps, tautan IG/TikTok. Semua klik tercatat di Dashboard Admin.
- Halaman 404 bergaya brand, nyaman di HP (tanpa geser ke samping), animasi ikut pengaturan "kurangi gerakan" HP.
- Keamanan & kecepatan: HTTPS, HTTP/2, `www.` diarahkan ke alamat utama, header keamanan, gambar ukuran HP, video Bolu versi ringan untuk HP.
- Web = etalase: tidak ada keranjang/pemesanan/link ojol.

## 4. Admin (nobitos.web.id)

- **Ringkasan**: pengunjung, pageview, klik per jenis (WA/Maps/telepon/IG) dan per cabang, rentang 7/30/90 hari.
- **Brand & Outlet**: profil brand (IG/TikTok, jenis masakan), isi halaman (teks Pak Joko/Aminoto/APW bisa diubah tanpa kode), judul & deskripsi Google per halaman, daftar menu (ubah harga langsung, Tersedia/Habis, Andalan, urutan), galeri (seret untuk urutkan), promo & event, lokasi & jam buka 7 hari.
- **Performa SEO**: cek kesehatan tiap domain. **Domain & SSL**: cek otomatis.
- **Akun & Akses**: akun staf dengan peran Super Admin / Admin Brand / Editor / Pemantau, per brand, plus log aktivitas.
- Preview brand yang belum tayang (tombol **Preview ↗**, hanya untuk admin yang login).
- Lupa password: lihat `README.md` (satu perintah di VPS).

## 5. Masih [CEK] / menunggu Fran

**Semua brand**
- Daftar Google Search Console + Google Business Profile tiap cabang (F6.4). Panduan langkah demi langkah: `PANDUAN-SEARCH-CONSOLE-GBP.md`.

**APW**
- Nomor WhatsApp Kesambi (sekarang belum ada tombol WA).
- Logo resolusi tinggi; video/foto TikTok tanpa watermark; foto asli Ayam Panggang Kampung & Bebek Panggang.
- Cerita: siapa Wicaksono? Logo IG "Sejak 2024" vs post pertama Juli 2026. Bebek juga dipanggang di tungku gerabah?
- Konfirmasi alamat & jam dari bio IG masih benar.
- Keputusan (tidak mendesak lagi, skor ukur ulang 90–94): foto hero langsung tampil tanpa animasi masuk, atau biarkan.
- Keputusan: draf template TUNGKU lama di folder kerja dibuang atau disimpan.

**Bolu Sunyaragi**
- Foto asli untuk 5 foto cerita di Beranda (sekarang foto contoh).
- Cek alamat 3 cabang hasil pin Google Maps.

**Pak Joko**
- Alamat lengkap: Ciperna tambah "Kabupaten Cirebon" + kode pos; Kartini tambah kode pos (bisa langsung di Admin > Lokasi & Jam Buka).

**Aminoto**
- Alamat Ciledug: nama jalan/nomor (sekarang "Dekat pintu tol Ciledug").
- Jam pesan online di web delivery `deliveryaminoto.my.id` disamakan (proyek terpisah).

**Sayur Lodeh Bu Joko** (setelah operasional siap, detail di `BRIEF-Bu-Joko.md` bagian 8)
- Nama di web & domain ("Sayur Lodeh Bu Joko" atau "Dapur Bu Joko").
- Jam buka final & hari libur; harga lengkap (foto kartu menu).
- Nomor WA & pin Maps (ikut Bakmi Kartini atau sendiri), patokan alamat, logo, cerita Bu Joko.
- Referensi desain (nuansa pagi, rumahan).

**Admin**
- Coba dari HP: tombol Preview di brand Draft (ada banner "Mode preview"), buka Performa SEO.

## 6. Catatan teknis untuk sesi berikutnya

- Update situs live: lihat `README.md`. `package-lock.json` di VPS berubah lokal (npm 10 di VPS menghapus kolom `libc`, hanya metadata, aman). Kalau `git pull` menolak karena file itu, jalankan `git checkout -- package-lock.json` dulu.- VPS menampilkan "System restart required": reboot malam hari setelah backup, di luar jam buka.
- Pulihkan DB: `pg_restore --clean --if-exists -d "<DATABASE_URL tanpa ?schema=>" ~/backups/web-nobitos-f7-3-20261023-1643.dump`.
- DB VPS masih menyimpan brand contoh `bakmi-jowo` & `bu-joko` (tidak tayang). Brand Bu Joko asli nanti pakai slug baru.
- Ganti foto di `public/brands/aminoto|apw` → jalankan `npm run images:variants`.
- Rincian audit: `AUDIT-F7.2.md` (checklist Standar Kuliner), `ROADMAP.md` (riwayat semua task).
