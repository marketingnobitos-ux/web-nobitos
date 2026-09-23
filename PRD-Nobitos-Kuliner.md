# PRD — Web Animasi Kuliner Nobitos (Multi-Brand)

> **Dokumen ini adalah spesifikasi produk lengkap untuk dibangun di Claude Code.**
> Versi: 1.0 · Tanggal: 23 September 2026 · Pemilik: Fran (Marketing Division Leader, Nobitos Indonesia)
> Status: Siap dibangun (build ulang dari nol)

---

## 0. Cara Pakai Dokumen Ini di Claude Code

1. Simpan file ini sebagai `PRD.md` di root repository project baru.
2. Buka Claude Code di folder tersebut, lalu mulai dengan prompt:
   *"Baca PRD.md. Bangun project sesuai Bagian 4 (Tech Stack) dan Bagian 14 (Roadmap). Mulai dari Milestone 1: setup project + database schema."*
3. Kerjakan **per milestone** (Bagian 14). Jangan minta Claude Code membangun semua sekaligus — mudah error dan susah di-review.
4. Setelah tiap milestone selesai, jalankan lokal dulu (`npm run dev`), baru lanjut milestone berikutnya.

---

## 1. Ringkasan Eksekutif

Nobitos adalah perusahaan F&B di Cirebon dengan beberapa brand kuliner, masing-masing punya beberapa cabang. Tujuannya membangun **satu platform web** yang:

- Menampilkan **website etalase/company profile yang sangat interaktif dan penuh animasi** (referensi gaya: nescafe.com/id) untuk tiap brand.
- **Bukan** untuk pemesanan online — ini murni etalase/branding. Harga ditampilkan, tapi tidak ada keranjang/checkout.
- Dikelola lewat **satu panel admin terpusat** (satu Super Admin) untuk semua brand: atur konten, menu, galeri, promo, cabang, dan **pemetaan domain per brand**.
- Punya **dashboard analitik** yang merekam perilaku pengunjung (pageview, klik) **per brand**, disimpan di database sendiri.
- Berjalan **sepenuhnya di VPS milik Nobitos** (bukan Supabase / layanan managed) supaya cepat dan tanpa delay.

**Satu codebase, banyak brand, banyak domain.** Setiap brand bisa diakses lewat domainnya sendiri (mis. `pecelleleaminoto.com`), tapi semuanya dilayani oleh satu aplikasi Next.js yang sama.

---

## 2. Tujuan & Metrik Keberhasilan

### Tujuan Bisnis
| # | Tujuan | Kenapa penting |
|---|--------|----------------|
| G1 | Setiap brand punya web etalase yang "wah" & modern | Meningkatkan brand image & kepercayaan customer |
| G2 | Konten bisa diubah sendiri tanpa developer | Fran bisa update menu/promo kapan saja lewat admin |
| G3 | Tahu brand & halaman mana yang paling banyak dilihat | Data untuk keputusan marketing |
| G4 | Hemat biaya & cepat | Semua di 1 VPS, tanpa langganan layanan pihak ketiga |

### Metrik Keberhasilan (KPI)
- **Performa:** Largest Contentful Paint (LCP) < 2.5 detik di koneksi 4G; skor Lighthouse Performance ≥ 85 (mobile).
- **Kemandirian admin:** Fran bisa menambah 1 menu baru lengkap dengan foto & harga < 3 menit tanpa bantuan developer.
- **Analitik jalan:** Dashboard menampilkan jumlah pengunjung & klik per brand secara real-time (delay < 1 menit).
- **Multi-domain jalan:** Minimal 1 brand tayang di domain sendiri dengan HTTPS otomatis.

### Di Luar Cakupan (Non-Goals) — v1
- ❌ Pemesanan / keranjang / pembayaran online.
- ❌ Aplikasi mobile native.
- ❌ Multi-bahasa (hanya Bahasa Indonesia).
- ❌ Multi-role admin (hanya satu Super Admin di v1 — lihat Bagian 8, dirancang agar mudah ditambah role nanti).
- ❌ Integrasi POS / stok / inventory.

---

## 3. Pengguna & Peran

| Peran | Siapa | Yang bisa dilakukan |
|-------|-------|---------------------|
| **Pengunjung (publik)** | Calon customer | Melihat web brand: hero animasi, menu + harga, galeri, cerita brand, info cabang. Tidak bisa pesan. |
| **Super Admin** | Fran | Login ke `/admin`. Kelola SEMUA brand: konten, menu, galeri, promo, cabang. Kelola domain per brand. Lihat dashboard analitik semua brand. Satu-satunya akun admin di v1. |

> **Catatan desain:** Walau v1 hanya satu Super Admin, struktur database & auth **wajib** dirancang untuk mendukung "Admin per Brand" di masa depan (kolom `role` dan tabel relasi `admin_brands` sudah disiapkan sejak awal — lihat Bagian 7). Ini agar tidak perlu bongkar ulang nanti.

---

## 4. Tech Stack (Wajib)

| Lapisan | Teknologi | Alasan |
|---------|-----------|--------|
| Framework | **Next.js 15 (App Router) + TypeScript** | Satu codebase untuk frontend + admin + API. SEO bagus (SSR/SSG). Cocok deploy di VPS. |
| Styling | **Tailwind CSS** | Cepat, konsisten, mudah untuk pemula. |
| Animasi | **GSAP + ScrollTrigger** (scroll animation, parallax, pin), **Lenis** (smooth scroll), **Framer Motion** (transisi komponen & halaman) | Kombinasi standar untuk web se-interaktif Nescafe. GSAP gratis untuk komersial. |
| Database | **PostgreSQL 16** (self-host di VPS) | Kuat, standar industri, cocok untuk multi-brand + analitik. |
| ORM | **Prisma** | Type-safe, migrasi mudah, ramah pemula. |
| Auth | **Auth.js (NextAuth v5)** dengan Credentials provider + session di database | Login admin aman, mudah ditambah role nanti. |
| Upload & media | Simpan di **disk VPS** (`/var/www/nobitos/uploads`), optimasi otomatis pakai **sharp** (resize + konversi WebP/AVIF) | Sesuai keinginan "semua di VPS", load cepat. |
| Validasi | **Zod** | Validasi input form admin & API. |
| Web server | **Nginx** (reverse proxy + SSL) | Melayani banyak domain, sudah ada web lain di VPS. |
| Process manager | **PM2** | Menjaga app Next.js tetap hidup & auto-restart. |
| SSL | **Certbot (Let's Encrypt)** wildcard/multi-domain | HTTPS gratis & otomatis untuk semua domain brand. |

**Versi Node.js:** 20 LTS atau lebih baru.

---

## 5. Arsitektur Multi-Brand (Konsep Inti)

Ini bagian terpenting. Semua brand dilayani **satu aplikasi Next.js**. Yang menentukan "brand mana yang tampil" adalah **hostname (domain) dari request**.

### Alur resolusi brand
```
Pengunjung buka pecelleleaminoto.com
        │
        ▼
Nginx  ──► teruskan ke Next.js (port 3000), kirim header Host asli
        │
        ▼
Next.js Middleware
   1. Baca hostname dari request
   2. Cari di tabel `domains` → dapat brand_id
   3. Set brand aktif ke context / header internal
        │
        ▼
Halaman render konten milik brand tersebut
   (hero, menu, galeri, cerita, cabang — semua dari DB, difilter brand_id)
```

### Aturan routing
- **Domain brand** (`pecelleleaminoto.com`, `bolusunyaragi.com`, dst) → tampilkan **situs publik brand tersebut**.
- **Domain admin** (mis. `admin.nobitos.com` atau `nobitos.com/admin`) → tampilkan **panel admin**. Admin tidak terikat satu brand; ia memilih brand dari dropdown di dalam panel.
- **Domain belum terdaftar** → tampilkan halaman "Brand tidak ditemukan" (404 brand).
- Untuk **development**, sediakan mode override: `localhost:3000?brand=aminoto` atau subpath `localhost:3000/preview/aminoto` supaya bisa cek semua brand tanpa banyak domain.

### Middleware (pseudo-logika)
```ts
// middleware.ts
export async function middleware(req) {
  const host = req.headers.get('host'); // mis. "pecelleleaminoto.com"
  // 1. Jika host = domain admin → lanjut ke /admin (protected by auth)
  // 2. Jika ada query ?brand= (khusus dev) → pakai itu
  // 3. Lookup domain di cache/DB → brandSlug
  // 4. Set header 'x-brand-slug' agar dibaca server components
  // 5. Jika tidak ketemu → rewrite ke /brand-not-found
}
```
> **Penting untuk performa:** cache pemetaan `domain → brand` di memory (revalidate tiap beberapa menit) supaya middleware tidak query DB tiap request.

---

## 6. Struktur Halaman (Sitemap)

### Situs Publik (per brand) — mengikuti mind map kamu
| Halaman | Path | Isi |
|---------|------|-----|
| **Halaman Utama** | `/` | Hero animasi sambutan, menu andalan (sorotan), sorotan promo, teaser galeri, CTA ke cabang/WhatsApp. Halaman "wow" utama. |
| **Menu Makanan** | `/menu` | Daftar menu per kategori, foto, harga & porsi. Filter kategori. Detail menu (modal atau halaman). |
| **Galeri Foto** | `/galeri` | Album foto per brand, tampilan menarik (grid masonry / horizontal scroll), lightbox foto besar. |
| **Cerita Brand** | `/cerita` | Profil singkat, sejarah & nilai, suasana outlet. Banyak animasi teks & parallax. |
| **Cabang & Kontak** | `/cabang` | Daftar cabang (alamat, jam buka, peta, nomor WhatsApp/telepon per cabang). |

### Panel Admin — mengikuti mind map kamu
| Halaman | Path | Isi |
|---------|------|-----|
| **Login** | `/admin/login` | Login Super Admin. Ada "Lupa Password". |
| **Dashboard** | `/admin` | Ringkasan analitik: jumlah pengunjung, klik, ringkasan per brand, grafik tren. |
| **Kelola Brand** | `/admin/brands` | Tambah/ubah brand: nama, logo, warna, deskripsi, aset. |
| **Kelola Konten Halaman** | `/admin/brands/[id]/pages` | Edit hero/sambutan, cerita brand, teks tiap halaman. |
| **Kelola Produk/Menu** | `/admin/brands/[id]/menu` | Tambah/ubah menu, kategori, foto, harga, porsi, atur menu andalan. |
| **Kelola Galeri** | `/admin/brands/[id]/gallery` | Upload/atur album & foto. |
| **Kelola Promo** | `/admin/brands/[id]/promos` | Buat banner/sorotan promo, jadwal aktif. |
| **Kelola Cabang** | `/admin/brands/[id]/branches` | Data cabang: alamat, jam buka, peta, kontak. |
| **Kelola Domain** | `/admin/domains` | Petakan domain ke brand, status verifikasi/DNS, status tayang web. |
| **Pengaturan** | `/admin/settings` | Profil admin, ganti password. |

---

## 7. Model Data (Database Schema)

Skema PostgreSQL via Prisma. Ini rancangan minimum yang lengkap; boleh ditambah field saat build.

```prisma
// schema.prisma

model Brand {
  id          String   @id @default(cuid())
  slug        String   @unique          // "aminoto", "bolu-sunyaragi"
  name        String                    // "Pecel Lele Aminoto"
  tagline     String?
  logoUrl     String?
  faviconUrl  String?
  // Branding & tema
  colorPrimary   String  @default("#000000")
  colorSecondary String  @default("#ffffff")
  colorAccent    String?
  fontHeading    String?                 // nama font
  fontBody       String?
  // Meta
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  domains     Domain[]
  pages       PageContent[]
  categories  MenuCategory[]
  menuItems   MenuItem[]
  albums      GalleryAlbum[]
  promos      Promo[]
  branches    Branch[]
  events      AnalyticsEvent[]
  admins      AdminBrand[]              // untuk masa depan (admin per brand)
}

model Domain {
  id         String   @id @default(cuid())
  hostname   String   @unique          // "pecelleleaminoto.com"
  brandId    String
  brand      Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  isPrimary  Boolean  @default(false)   // domain utama brand
  status     DomainStatus @default(PENDING) // PENDING | VERIFIED | ACTIVE | ERROR
  sslIssued  Boolean  @default(false)
  createdAt  DateTime @default(now())
}

enum DomainStatus { PENDING VERIFIED ACTIVE ERROR }

// Konten halaman fleksibel (hero, cerita, dll) sebagai blok JSON per section
model PageContent {
  id        String   @id @default(cuid())
  brandId   String
  brand     Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  pageKey   String                       // "home", "story"
  sectionKey String                      // "hero", "welcome", "values", "atmosphere"
  data      Json                         // { title, subtitle, imageUrl, animation, ... }
  order     Int      @default(0)
  isVisible Boolean  @default(true)
  updatedAt DateTime @updatedAt
  @@unique([brandId, pageKey, sectionKey])
}

model MenuCategory {
  id        String   @id @default(cuid())
  brandId   String
  brand     Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  name      String                       // "Ayam", "Bebek", "Minuman"
  order     Int      @default(0)
  items     MenuItem[]
}

model MenuItem {
  id          String   @id @default(cuid())
  brandId     String
  brand       Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  categoryId  String
  category    MenuCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  name        String
  description String?
  price       Int                          // dalam Rupiah (bilangan bulat, tanpa desimal)
  portion     String?                      // "1 porsi", "500 gr"
  imageUrl    String?
  isFeatured  Boolean  @default(false)     // menu andalan / sorotan
  isAvailable Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model GalleryAlbum {
  id        String   @id @default(cuid())
  brandId   String
  brand     Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  title     String
  order     Int      @default(0)
  photos    GalleryPhoto[]
}

model GalleryPhoto {
  id        String   @id @default(cuid())
  albumId   String
  album     GalleryAlbum @relation(fields: [albumId], references: [id], onDelete: Cascade)
  imageUrl  String
  caption   String?
  order     Int      @default(0)
}

model Promo {
  id         String   @id @default(cuid())
  brandId    String
  brand      Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  title      String
  description String?
  imageUrl   String?
  startsAt   DateTime?
  endsAt     DateTime?
  isActive   Boolean  @default(true)
  order      Int      @default(0)
}

model Branch {
  id         String   @id @default(cuid())
  brandId    String
  brand      Brand    @relation(fields: [brandId], references: [id], onDelete: Cascade)
  name       String                       // "AMG - Ciledug"
  address    String
  mapsUrl    String?                       // link Google Maps
  lat        Float?
  lng        Float?
  openHours  String?                       // "10.00 - 22.00 setiap hari"
  whatsapp   String?
  phone      String?
  order      Int      @default(0)
}

// ---- ADMIN / AUTH ----
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  role         AdminRole @default(SUPER_ADMIN)  // siap untuk multi-role nanti
  createdAt    DateTime @default(now())
  brands       AdminBrand[]                      // relasi untuk admin-per-brand (masa depan)
  resetToken   String?
  resetExpires DateTime?
}

enum AdminRole { SUPER_ADMIN BRAND_ADMIN EDITOR VIEWER }

model AdminBrand {
  adminId String
  brandId String
  admin   AdminUser @relation(fields: [adminId], references: [id], onDelete: Cascade)
  brand   Brand     @relation(fields: [brandId], references: [id], onDelete: Cascade)
  @@id([adminId, brandId])
}

// ---- ANALYTICS ----
model AnalyticsEvent {
  id        String   @id @default(cuid())
  brandId   String?
  brand     Brand?   @relation(fields: [brandId], references: [id], onDelete: SetNull)
  type      String                       // "pageview" | "click"
  path      String                       // "/menu"
  target    String?                      // untuk click: id/label elemen (mis. "wa-cabang-amg")
  referrer  String?
  device    String?                      // "mobile" | "desktop" | "tablet"
  sessionId String?                      // id anonim (cookie/first-party) untuk hitung unique
  createdAt DateTime @default(now())

  @@index([brandId, createdAt])
  @@index([type, createdAt])
}
```

### Seed data awal (brand & cabang Nobitos)
Isi saat setup pertama:

| Brand | Cabang |
|-------|--------|
| Pecel Lele Aminoto | AMG (Ciledug), AMC (Cipto), AMS (Sumber) |
| Bolu Sunyaragi | Kartini, Pabrik |
| Bakmi Jowo Anglo Mas Joko | Kartini, Ciperna |
| Ayam Panggang Wicaksono (APW) | Cipto, Kesambi |
| Warung Bu Joko | Jl. Kartini |

---

## 8. Spesifikasi Fitur — Situs Publik

### 8.1 Halaman Utama (Hero + Sorotan)
- **Hero animasi sambutan:** full-screen, judul & subjudul brand dengan animasi teks (kata muncul bertahap / mask reveal), gambar atau video background dengan efek parallax halus. Semua teks & media diatur dari admin (`PageContent` section `hero`).
- **Menu Andalan:** grid/carousel menu ber-`isFeatured`, kartu dengan hover animasi & harga.
- **Sorotan Promo:** banner promo aktif (dari tabel `Promo` yang `isActive` & dalam rentang tanggal).
- **Teaser Galeri & Cerita:** potongan galeri + CTA "Lihat Cerita".
- **CTA Cabang:** tombol menuju halaman cabang / link WhatsApp cabang terdekat.

### 8.2 Menu Makanan
- Daftar menu dikelompokkan per kategori, bisa difilter (tab/chip kategori dengan animasi transisi).
- Tiap item: foto (lazy-load, WebP), nama, deskripsi singkat, **harga (format Rupiah, mis. `Rp 25.000`)**, porsi.
- Detail item: modal atau halaman `/menu/[id]` dengan foto besar.
- **Tidak ada tombol pesan / keranjang.** Murni katalog. (Sesuai keputusan: tampilkan harga saja, tanpa tombol pesan.)

### 8.3 Galeri Foto
- Album per brand, tampilan grid masonry atau horizontal scroll (GSAP).
- Lightbox untuk foto besar, navigasi swipe di mobile.
- Animasi reveal saat foto masuk viewport.

### 8.4 Cerita Brand
- Profil singkat, sejarah & nilai, suasana outlet.
- Kaya animasi: parallax gambar, teks reveal saat scroll, section "pinned" ala Nescafe.

### 8.5 Cabang & Kontak
- Kartu tiap cabang: nama, alamat, jam buka, tombol "Buka di Google Maps", tombol WhatsApp/telepon.
- Peta embed opsional (bisa pakai iframe Google Maps by URL, tanpa API key berbayar).

### 8.6 Konten Global per Brand
- Warna & logo brand diambil dari `Brand` dan diterapkan sebagai CSS variables (`--color-primary`, dll) supaya tiap domain tampil sesuai identitasnya.
- Favicon & meta (title, description, Open Graph) per brand untuk SEO & share.

---

## 9. Spesifikasi Animasi (Gaya Nescafe)

Target: web terasa **hidup, mulus, dan premium**. Wajib tetap perform di HP.

### Teknik yang dipakai
| Efek | Library | Keterangan |
|------|---------|------------|
| Smooth scroll | **Lenis** | Scroll terasa "lembut" seperti Nescafe. |
| Scroll-triggered reveal | **GSAP ScrollTrigger** | Elemen muncul (fade/slide/scale) saat masuk viewport. |
| Parallax | GSAP ScrollTrigger | Background & gambar bergerak beda kecepatan. |
| Pinned sections | GSAP ScrollTrigger `pin` | Section "menempel" sambil konten berganti (storytelling). |
| Animasi teks (mask/stagger) | GSAP SplitText alternatif gratis / manual span-split | Judul muncul kata per kata / huruf per huruf. |
| Transisi antar halaman | **Framer Motion** (`AnimatePresence`) | Perpindahan halaman mulus, tidak "loncat". |
| Hover interaktif | Framer Motion / CSS | Kartu menu, tombol magnetic, cursor kustom (desktop). |
| Loader awal | GSAP/Framer | Intro/preloader singkat saat pertama buka. |

### Aturan wajib (jangan dilanggar)
1. **Hormati `prefers-reduced-motion`** — kalau user matikan animasi di OS, kurangi/hapus animasi berat.
2. **Mobile-first performance:** animasi berat (pin, parallax kompleks) boleh disederhanakan di layar kecil. Utamakan LCP cepat.
3. **Jangan blok konten:** teks utama harus terbaca walau JS animasi belum jalan (progressive enhancement).
4. **Lazy-load** semua gambar & video di bawah lipatan.
5. Animasi **dikontrol dari komponen**, bukan hardcode per brand — semua brand pakai sistem animasi yang sama, hanya konten & warna yang beda.

---

## 10. Spesifikasi Panel Admin

### 10.1 Autentikasi
- Login di `/admin/login` dengan email + password (Auth.js Credentials).
- Password di-hash (bcrypt/argon2). Session disimpan di DB.
- **Lupa Password:** kirim link reset (butuh SMTP — lihat Bagian 13). Token reset di `AdminUser.resetToken` + kadaluarsa.
- Semua route `/admin/*` (kecuali login & reset) dilindungi middleware; kalau belum login → redirect ke login.
- v1: hanya satu akun Super Admin (dibuat lewat seed / script). Role `SUPER_ADMIN` bisa akses semua.

### 10.2 Dashboard Analitik
- **Kartu ringkas:** total pengunjung (hari ini / 7 hari / 30 hari), total klik, jumlah brand aktif.
- **Ringkasan per brand:** tabel/grafik pengunjung & klik tiap brand (jawab kebutuhan "lihat orang klik web dari beberapa brand").
- **Grafik tren:** garis pengunjung harian (filter rentang tanggal & filter per brand).
- **Top halaman & top klik:** halaman paling banyak dilihat, tombol paling banyak diklik (mis. klik WhatsApp cabang).
- Data dari tabel `AnalyticsEvent` (agregasi via query SQL/Prisma; boleh buat tabel ringkasan harian kalau data besar).

### 10.3 Kelola Konten (CRUD)
Semua modul berikut = Create / Read / Update / Delete lewat form admin, dengan validasi Zod:
- **Brand:** nama, slug, logo, favicon, warna (color picker), tagline, publish on/off.
- **Konten Halaman:** editor per section (hero, welcome, cerita, values, atmosphere) — field teks + upload gambar/video + toggle tampil.
- **Menu:** kategori (urut drag/order), item (nama, deskripsi, harga, porsi, foto, andalan, tersedia).
- **Galeri:** album + upload banyak foto sekaligus, atur urutan.
- **Promo:** judul, gambar, deskripsi, jadwal aktif, aktif on/off.
- **Cabang:** nama, alamat, jam buka, maps URL, WhatsApp, telepon.
- Semua data **difilter per brand** (admin pilih brand aktif dari dropdown di header panel).

### 10.4 Kelola Domain (mind map: "Kelola Domain Brand")
- Daftar brand & domain terkait.
- Tambah domain: input hostname → pilih brand → simpan (status `PENDING`).
- Tampilkan **instruksi DNS** yang perlu di-set user (arahkan A record domain ke IP VPS).
- Tombol **cek status** (apakah domain sudah mengarah ke VPS & SSL sudah terbit).
- Status tayang web brand: `PENDING / VERIFIED / ACTIVE / ERROR`.
- Catatan: penerbitan SSL aktual dilakukan di server (Certbot) — admin panel menampilkan status & instruksi, langkah teknis di Bagian 12.

### 10.5 Upload & Optimasi Media
- Upload via form → simpan sementara → **sharp** proses: resize ke beberapa ukuran (mis. thumb 400px, medium 1000px, large 1920px) + konversi **WebP** (dan AVIF opsional).
- Simpan ke `/var/www/nobitos/uploads/<brandSlug>/...`, simpan URL di DB.
- Batasi ukuran & tipe file (jpg/png/webp/mp4). Validasi di server.
- Serve media lewat route Next.js atau langsung Nginx (lebih cepat) dengan cache header panjang.

---

## 11. Spesifikasi Analitik (Tracking Sendiri)

Sesuai keputusan: **rekam sendiri di PostgreSQL, tampil di dashboard admin.** Tanpa layanan pihak ketiga.

### Cara kerja
1. Di situs publik, script kecil (first-party) mengirim event ke API sendiri:
   - **Pageview:** saat halaman dibuka → `POST /api/track` `{ type: "pageview", path, referrer, brandSlug }`.
   - **Click:** untuk elemen ber-atribut `data-track` (mis. tombol WhatsApp, tombol menu andalan) → `POST /api/track` `{ type: "click", target, path, brandSlug }`.
2. Server menyimpan ke `AnalyticsEvent`, mengisi `brandId` (dari hostname/slug), `device` (dari user-agent), `sessionId` (cookie anonim first-party untuk hitung unique visitor).
3. **Privasi:** tidak simpan data pribadi, tidak butuh cookie consent berat (first-party, anonim). Simpan IP hanya jika perlu (sebaiknya tidak, atau di-hash).
4. Dashboard membaca & mengagregasi data ini.

### Anti-spam / kualitas data
- Rate-limit endpoint `/api/track`.
- Abaikan bot umum (cek user-agent).
- Optional: buat cron harian yang meringkas ke tabel `DailyStat` kalau volume event sudah besar (agar dashboard tetap cepat).

---

## 12. Deployment di VPS (Sudah Ada Web Lain)

> Kondisi kamu: **VPS sudah ada dan sudah menjalankan web lain.** Maka setup harus hati-hati agar tidak bentrok. Rekomendasi: pakai **Nginx sebagai reverse proxy** (kemungkinan sudah terpasang) + jalankan app Next.js di **port khusus** (mis. 3001) via PM2. Alternatif lebih rapi & aman dari bentrok: **Docker**.

### Opsi A — Native (PM2 + Nginx) — paling ringan
1. **Siapkan runtime:** pastikan Node 20 LTS terpasang (pakai `nvm` agar tidak ganggu web lain).
2. **Database:** install PostgreSQL 16 (kalau belum ada). Buat database `nobitos` + user khusus. Kalau sudah ada PostgreSQL untuk web lain, cukup buat database baru terpisah.
3. **Deploy app:**
   ```bash
   cd /var/www/nobitos
   git clone <repo> .
   npm ci
   npx prisma migrate deploy
   npm run build
   pm2 start npm --name nobitos-web -- start   # jalan di port 3001 (set di .env / start script)
   pm2 save
   ```
4. **Nginx server block** per domain brand (semua diarahkan ke app yang sama, port 3001):
   ```nginx
   server {
     server_name pecelleleaminoto.com www.pecelleleaminoto.com;
     location / {
       proxy_pass http://127.0.0.1:3001;
       proxy_set_header Host $host;               # WAJIB: agar app tahu brand dari hostname
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```
   > Kunci multi-brand: **`proxy_set_header Host $host;`** — tanpa ini app tidak bisa membedakan brand.
5. **SSL:** `sudo certbot --nginx -d pecelleleaminoto.com -d www.pecelleleaminoto.com` (ulangi per domain brand). Auto-renew via cron certbot.
6. **Uploads:** serve folder `/var/www/nobitos/uploads` langsung via Nginx `location /uploads/` dengan cache panjang, agar tidak membebani Node.

### Opsi B — Docker (lebih rapi, anti-bentrok)
- `docker-compose` berisi: service `web` (Next.js), service `db` (Postgres) dengan volume persisten, service `nginx` (atau tetap pakai Nginx host).
- App di container port internal, dipetakan ke port host khusus, lalu Nginx host reverse-proxy ke situ.
- Uploads pakai named volume agar aman saat rebuild.

### Menambah domain brand baru (alur operasional)
1. Admin tambah domain di panel (`/admin/domains`) → status `PENDING`.
2. Arahkan A record domain ke IP VPS (di registrar domain).
3. Buat/aktifkan Nginx server block untuk domain itu + jalankan Certbot.
   - (Opsi lanjutan: skrip otomatis yang membuat server block + Certbot saat domain ditambahkan. Untuk v1 boleh manual dulu.)
4. Cek status di panel → `ACTIVE`.

### Backup
- **Database:** `pg_dump` harian (cron) → simpan ke folder backup + salin ke storage eksternal.
- **Uploads:** backup folder `/uploads` (rsync/tar harian).

---

## 13. Konfigurasi & Environment Variables

File `.env` (jangan commit ke git):
```env
# App
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_APP_URL=https://nobitos.com

# Database
DATABASE_URL=postgresql://nobitos_user:PASSWORD@localhost:5432/nobitos

# Auth
AUTH_SECRET=<random-panjang>
ADMIN_HOST=admin.nobitos.com        # host yang memicu panel admin

# Upload
UPLOAD_DIR=/var/www/nobitos/uploads
MAX_UPLOAD_MB=15

# Email (untuk lupa password) — isi kalau pakai SMTP
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM="Nobitos Admin <admin@nobitos.com>"
```
> Kalau SMTP belum siap, fitur "Lupa Password" bisa diganti sementara: reset password lewat script server. Tapi idealnya pakai SMTP (bisa pakai layanan gratis/murah, atau email hosting yang sudah ada).

---

## 14. Roadmap Pembangunan (Milestone) — Urutan untuk Claude Code

Kerjakan berurutan. Jangan lompat.

### Milestone 1 — Fondasi (Setup)
- Init Next.js 15 + TypeScript + Tailwind.
- Setup Prisma + koneksi PostgreSQL + tulis semua model (Bagian 7).
- `prisma migrate` + seed data brand & cabang Nobitos.
- Setup struktur folder & layout dasar.
- **Selesai kalau:** app jalan lokal, DB terisi seed, bisa query brand.

### Milestone 2 — Multi-Brand Engine
- Middleware resolusi brand dari hostname + mode dev (`?brand=slug`).
- Terapkan warna/logo brand sebagai CSS variables.
- Halaman "brand not found".
- **Selesai kalau:** buka `?brand=aminoto` vs `?brand=bolu` menampilkan brand berbeda.

### Milestone 3 — Situs Publik (konten statis dari DB, belum animasi berat)
- Bangun 5 halaman publik (Home, Menu, Galeri, Cerita, Cabang) menarik data dari DB per brand.
- Responsive mobile-first, format harga Rupiah.
- **Selesai kalau:** semua halaman tampil benar untuk tiap brand, tanpa animasi dulu.

### Milestone 4 — Panel Admin + Auth
- Auth.js login/logout, proteksi `/admin/*`, seed akun Super Admin.
- CRUD: Brand, Menu (+kategori), Galeri, Promo, Cabang, Konten Halaman.
- Upload media + optimasi sharp.
- Dropdown pilih brand aktif.
- **Selesai kalau:** Fran bisa menamb/ubah menu & konten lewat admin dan langsung tampil di situs publik.

### Milestone 5 — Analitik
- Endpoint `/api/track` + script tracking di situs publik (pageview & click).
- Dashboard admin: kartu ringkas, ringkasan per brand, grafik tren, top halaman/klik.
- **Selesai kalau:** buka situs publik → event tercatat → tampil di dashboard.

### Milestone 6 — Kelola Domain
- Halaman admin domain: tambah/petakan domain ke brand, status, instruksi DNS, cek status.
- **Selesai kalau:** domain bisa didaftarkan & statusnya terlihat di panel.

### Milestone 7 — Animasi (Gaya Nescafe)
- Integrasi Lenis + GSAP ScrollTrigger + Framer Motion.
- Terapkan: hero reveal, parallax, pinned storytelling di Cerita, transisi halaman, hover interaktif, preloader.
- Hormati `prefers-reduced-motion` + optimasi mobile.
- **Selesai kalau:** web terasa mulus & interaktif seperti referensi, LCP mobile tetap < 2.5s.

### Milestone 8 — Deploy & Go-Live
- Deploy ke VPS (Bagian 12), Nginx + PM2/Docker, SSL 1 domain brand dulu.
- Backup DB & uploads.
- QA lintas device.
- **Selesai kalau:** minimal 1 brand tayang di domain sendiri dengan HTTPS & admin jalan.

---

## 15. Struktur Folder (Saran)

```
nobitos/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ app/
│  │  ├─ (public)/               # situs publik per brand
│  │  │  ├─ page.tsx             # Home
│  │  │  ├─ menu/
│  │  │  ├─ galeri/
│  │  │  ├─ cerita/
│  │  │  └─ cabang/
│  │  ├─ admin/                  # panel admin
│  │  │  ├─ login/
│  │  │  ├─ page.tsx             # dashboard
│  │  │  ├─ brands/
│  │  │  ├─ domains/
│  │  │  └─ settings/
│  │  ├─ api/
│  │  │  ├─ track/route.ts       # analitik
│  │  │  └─ upload/route.ts      # upload media
│  │  └─ brand-not-found/
│  ├─ components/
│  │  ├─ public/                 # komponen situs (Hero, MenuCard, Gallery, ...)
│  │  ├─ admin/                  # komponen panel
│  │  └─ animations/             # wrapper GSAP/Framer reusable
│  ├─ lib/
│  │  ├─ prisma.ts
│  │  ├─ brand.ts                # resolusi & cache brand
│  │  ├─ auth.ts                 # Auth.js config
│  │  ├─ analytics.ts
│  │  └─ media.ts                # sharp optimasi
│  ├─ middleware.ts              # resolusi brand + proteksi admin
│  └─ styles/
├─ public/
├─ .env
└─ PRD.md                        # dokumen ini
```

---

## 16. Keamanan (Checklist)

- Password admin di-hash (argon2/bcrypt), tidak pernah plaintext.
- Semua route `/admin/*` & API tulis wajib cek session.
- Validasi & sanitasi semua input (Zod) — cegah injection.
- Batasi tipe & ukuran upload; simpan di luar path yang bisa dieksekusi.
- Rate-limit endpoint publik (`/api/track`, login).
- Set security headers (CSP, X-Frame-Options, dll).
- `.env` & kredensial DB tidak masuk git.
- Backup rutin DB + uploads.
- HTTPS wajib (redirect HTTP → HTTPS).

---

## 17. Risiko & Catatan

| Risiko | Mitigasi |
|--------|----------|
| Animasi berat bikin lambat di HP murah | Mobile-first, sederhanakan animasi di layar kecil, hormati reduced-motion, lazy-load |
| Bentrok dengan web lain di VPS | Pakai port khusus + database terpisah; pertimbangkan Docker |
| Middleware query DB tiap request → lambat | Cache pemetaan domain→brand di memory dgn revalidate berkala |
| Tabel analitik membengkak | Cron ringkasan harian ke tabel `DailyStat` |
| Tambah domain masih manual (Nginx+Certbot) | v1 manual dgn instruksi jelas di panel; otomatisasi di fase lanjutan |
| Satu Super Admin = single point | Struktur role sudah disiapkan; tambah admin per-brand mudah nanti |

---

## 18. Pertanyaan Terbuka (Perlu Diputuskan Saat Build)
1. Domain admin final: `admin.nobitos.com` atau `nobitos.com/admin`? (default PRD: subdomain `admin.nobitos.com`.)
2. SMTP untuk "Lupa Password" pakai apa? (kalau belum ada, sementara reset via script.)
3. Perlukah video background di hero (lebih berat) atau cukup gambar + animasi? (bisa diatur per brand di admin.)
4. Native (PM2) atau Docker untuk deploy? (default PRD: mulai PM2, siapkan opsi Docker.)

---

*Akhir dokumen. Rancang untuk dikerjakan bertahap per milestone di Claude Code.*
