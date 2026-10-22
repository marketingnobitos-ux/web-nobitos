# BRIEF — Ayam Panggang Wicaksono (APW)

> ROADMAP F2.2 · 29 Sep 2026 · Slug `apw` · Template `TUNGKU` (baru, F2.4)
> Sumber: menu cetak resmi & keterangan Fran (29 Sep 2026) + akun Instagram resmi @ayampanggangwicaksono (bio, caption, dan video 2 reel milik APW: 17 Jul & 28 Agu 2026). 2 reel lain di profil milik kreator lain (@kulinersimamank, @jajanisasi): tidak dipakai, termasuk klaim "pertama di Cirebon".
> Desain: Figma https://www.figma.com/design/LkzvL90pPoUNbf3GnoagWl
> Data ditulis di `src/data/brands/apw.ts` (teks halaman) dan `prisma/apw.ts` (brand, menu, cabang) → `npm run apw:seed`.

## 1. Fakta brand (terkonfirmasi)

| Hal | Isi |
|---|---|
| Nama | Ayam Panggang Wicaksono (APW) |
| Tagline (dari menu cetak) | "Nikmati sajian lezat ayam panggang dan aneka pilihan menu segar!" |
| Slogan (bio & logo IG) | "Smokie nya bikin nagih" |
| Ciri khas | Dipanggang di dalam tungku gerabah (Fran + reel IG: "dipanggang pakai tungku grabah tradisional"). Dari video: ayam dibaluri bumbu rempah, dimasukkan ke tungku gerabah (api kompor di bawah tungku, bukan arang), diangkat saat warnanya gelap. |
| Alamat (bio IG) | Jl. DR. Cipto Mangunkusumo No.142, Kesambi, Kec. Kesambi, Kota Cirebon, Jawa Barat 45134 |
| Jam (bio IG) | 16.00–00.00 WIB, Kamis libur |
| Cabang | **Hanya Kesambi, Cirebon** (Cipto = data contoh, dihapus) |
| Instagram | https://www.instagram.com/ayampanggangwicaksono/ |
| TikTok | https://www.tiktok.com/@ayampanggang.wicaksono |
| Warna (menu cetak) | marun tua `#6B0F14` (header, tombol) · emas `#F5A623` (aksen) · krem `#FBF4E8` (latar) |
| Font | M PLUS Rounded 1c (judul, tombol) · Nunito Sans (isi) |

## 2. Menu resmi (rupiah)

**Makanan** — Nasi 5.000 · Ayam panggang negeri 1/4 (dada / paha) 25.000 · Ayam panggang kampung 1/4 (dada / paha) 35.000 · Bebek panggang (paha / dada) 38.000

**Menu Tambahan** — Tempe 3.000 · Tahu 3.000 · Sate usus 4.000 · Krupuk 5.000 · Kol goreng 6.000 · Sate kulit 7.000 · Sate ati ampela 7.000 · Pete 15.000

**Minuman** — Teh tawar panas 2.000 · Es teh tawar 3.000 · Mineral 5.000 · Es teh manis 5.000 · Teh manis panas 5.000 · Es teh kampul 8.000 · Es jeruk 10.000 · Jeruk panas 10.000

Catatan: "Menu anak tidak pedas, tanpa bumbu panggang."
Menu Unggulan (Beranda): Ayam Panggang Negeri, Ayam Panggang Kampung, Bebek Panggang.

## 3. Tone

Hangat, singkat, bahasa sehari-hari yang sopan ("kami", "kamu"). Web = informasi saja: **tidak ada tombol pesan**, keranjang, atau link ojol.

## 4. Referensi desain (F2.3)

Dipilih Fran: https://www.couvee.co.id — terang, lega, header solid, hero foto penuh + nama brand besar, judul huruf kapital tipis ber-letter-spacing, tombol siku, 3 kartu persegi + popup deskripsi.

### 4b. Referensi desain baru (22 Okt 2026) → template GERABAH

Dipilih Fran: https://dribbble.com/shots/27744577-Daily-Dishes-Lab-Culinary-Web-Experience — papan blok warna tanah bergaris grid tipis, judul kapital lebar, sajian bulat "melayang" di atas blok, kartu kaca berisi data, rail ikon di kiri. Diterjemahkan jadi template `GERABAH` (menggantikan TUNGKU): blok gerabah `#A4552F`, asap `#2B302D`, daun pisang `#5C6849`, arang `#161311`, aksen emas `#F5A623` & marun `#6B0F14`; font Archivo (judul lebar) + Fraunces (aksen serif). Teks di `src/data/brands/apw-gerabah.ts`.

Tambahan fakta dari caption TikTok resmi @ayampanggang.wicaksono: grand opening **14 Juni 2026**, patokan lokasi **"depan Jagoan Khitan"** (papan Klinik Jagoan Khitan terlihat di video), "dipanggang pakai tungku grabah", "kalau udah agak gelap gini tandanya udah matang".

Foto: 15 potongan dari 8 video TikTok resmi (576 px) di `public/brands/apw/tiktok/`. 9 video lain tidak bisa diunduh (CDN menolak). Teks & watermark TikTok dipotong; di 4 foto (`hero-tungku-api`, `sajian-piring-atas`, `api-tungku`, `asap-tungku`) watermark dihaluskan, sedikit buram kalau diperbesar.

Domain lokal untuk preview: `http://ayampanggangwicaksono.localhost:3000` (baris Domain + `isPublished=true` hanya di DB lokal, tidak di seed).

## 5. Daftar [CEK] untuk Fran

- [CEK] Alamat & jam dari bio IG sudah dipakai (atas izin Fran). Konfirmasi tetap benar.
- [CEK] Nomor WhatsApp Kesambi.
- [CEK] Link Google Maps resmi + koordinat Kesambi (sementara tombol Maps = pencarian alamat).
- [CEK] Logo resolusi tinggi (sementara foto profil IG 150 px) & foto asli resolusi tinggi. Foto sekarang = potongan video reel IG 720 px di `public/brands/apw/foto/`.
- [CEK] Foto khusus Ayam Panggang Kampung & Bebek Panggang (kartu sekarang memakai foto sajian umum dari reel).
- [CEK] Cerita asal-usul: siapa Wicaksono; logo IG tertulis "Sejak 2024", tapi post pertama IG Juli 2026. Tidak ditulis sampai dikonfirmasi.
- [CEK] Bebek juga dipanggang di tungku gerabah? (copy sekarang hanya menyebut ayam).
- [CEK] Domain (F2.1).
- [CEK] File video/foto asli TikTok tanpa watermark (resolusi lebih tinggi) untuk mengganti potongan 576 px.
- [CEK] Foto bebek panggang asli (kartu Bebek masih foto lama dari reel IG).
