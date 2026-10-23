# Panduan Google Search Console & Google Business Profile

> Untuk Fran (F6.4). Dibuat 23 Okt 2026. Kerjakan sekali per domain / per cabang.
> Pakai **satu akun Google kantor** untuk semuanya, supaya nanti mudah dibagikan ke tim.
> DNS keempat domain ada di **Sumopod** (`ns1.sumopod.com`, `ns2.sumopod.com`, dicek 23 Okt).
> Tampilan menu Google & Sumopod bisa sedikit berbeda dari tulisan di sini. Kalau bingung, kirim screenshot ke Claude.

## Bagian A — Google Search Console (supaya web muncul & terpantau di Google)

Lakukan untuk 4 domain di tabel bawah. **Jangan** daftarkan `nobitos.web.id` (Admin memang disembunyikan dari Google).

| Domain | Isi kolom sitemap | Jumlah halaman di sitemap |
|---|---|---|
| `pecelleleaminoto.web.id` | `sitemap.xml` | 4 |
| `bolusunyaragi.web.id` | `sitemap.xml` | 5 |
| `bakmijowopakjoko.web.id` | `sitemap.xml` | 4 |
| `ayampanggangwicaksono.web.id` | `sitemap.xml` | 4 |

**Langkah per domain**

1. Buka https://search.google.com/search-console dan masuk dengan akun Google kantor.
2. Klik **Tambahkan properti** → pilih kotak kiri **Domain** → ketik domainnya saja, mis. `bakmijowopakjoko.web.id` (tanpa `https://`, tanpa `www`) → **Lanjutkan**.
3. Google menampilkan kode seperti `google-site-verification=AbC123…`. Klik **Salin**. Biarkan tab ini terbuka.
4. Di tab lain, masuk ke **Sumopod** → pilih domain yang sama → menu DNS (biasanya **Kelola DNS** / **DNS Records**) → **Tambah record**:
   - Type: `TXT`
   - Name / Host: `@` (atau kosong, artinya domain utama)
   - Value / Content: tempel kode dari Google (lengkap dengan `google-site-verification=`)
   - TTL: biarkan bawaan
   - Simpan. **Jangan ubah atau hapus record `A`** (itu yang mengarahkan domain ke server web).
5. Kembali ke tab Google → klik **Verifikasi**. Kalau gagal, tunggu 10–60 menit lalu klik lagi (DNS butuh waktu menyebar).
6. Setelah terverifikasi, buka menu kiri **Peta situs (Sitemaps)** → isi `sitemap.xml` → **Kirim**. Status harus **Berhasil** dengan jumlah halaman sesuai tabel.
7. Opsional tapi bagus: menu **Inspeksi URL** → tempel `https://<domain>/` → **Minta pengindeksan**. Ulangi untuk `/menu` dan `/cabang`.

Data di Search Console baru terisi 2–3 hari setelah verifikasi. Setelah itu Claude bisa membantu membaca laporannya kalau Fran menambahkan akses (menu **Setelan → Pengguna dan izin**), atau cukup kirim screenshot.

**Bonus (5 menit, setelah keempat domain beres):** buka https://www.bing.com/webmasters → **Impor dari Google Search Console**. Bing ikut memakai sitemap yang sama, dan Copilot/ChatGPT banyak mengambil dari indeks Bing.

## Bagian B — Google Business Profile (kartu warung di Google Maps)

Sebagian besar cabang kemungkinan **sudah punya** kartu di Google Maps (tombol Maps di web menunjuk ke kartu itu). Tujuannya: **klaim** kartu itu supaya Nobitos bisa mengatur isinya, lalu hubungkan ke web.

**Langkah per cabang**

1. Buka https://business.google.com dengan akun Google kantor → **Tambahkan bisnis** / cari nama usaha.
2. Kalau nama cabang muncul: pilih → **Klaim bisnis ini** / **Kelola sekarang**. Kalau sudah dikelola orang lain, Google memberi tombol **Minta akses** ke pemilik lama.
   Kalau tidak muncul: buat baru dengan nama, kategori, dan alamat di tabel bawah, lalu pasang pin tepat di lokasi.
3. Verifikasi dengan cara yang ditawarkan Google (biasanya video singkat keliling lokasi: papan nama, dapur/etalase, area pembeli; kadang telepon/SMS). Siapkan HP di lokasi saat jam buka.
4. Setelah terverifikasi, isi atau samakan dengan web:
   - **Situs web**: alamat di kolom "Situs web" tabel bawah.
   - **Menu** (bagian Makanan & minuman → tautan menu): `https://<domain>/menu`.
   - **Jam buka** dan **hari libur** persis seperti tabel.
   - **Telepon**: nomor di tabel (format +62).
   - Foto: tampak depan, papan nama, menu andalan, suasana. Minimal 5 foto.
5. Kirim link kartu (tombol **Bagikan** di Google Maps) ke Claude untuk dipasang sebagai pin Maps resmi di web bila berbeda dengan yang sekarang.

| Cabang | Kategori (saran, pilih yang paling dekat) | Jam buka | Telepon | Situs web |
|---|---|---|---|---|
| Aminoto — Cipto | Restoran / Warung makan pecel lele | 11.00–22.00 setiap hari | +62 851-9424-2550 | https://pecelleleaminoto.web.id |
| Aminoto — Sumber | sama | 11.00–22.00 setiap hari | +62 851-8590-7890 | https://pecelleleaminoto.web.id |
| Aminoto — Ciledug | sama | 11.00–22.00 setiap hari | +62 851-9602-8883 | https://pecelleleaminoto.web.id |
| Bolu Sunyaragi — Kartini | Toko kue | 08.00–21.00 setiap hari | +62 851-6520-6098 | https://bolusunyaragi.web.id |
| Bolu Sunyaragi — Kedawung (pabrik) | Toko kue | 08.00–20.00 setiap hari | +62 851-6520-6098 | https://bolusunyaragi.web.id |
| Bolu Sunyaragi — Stasiun Kejaksan | Toko kue | 06.00–21.00 setiap hari | +62 851-6520-6098 | https://bolusunyaragi.web.id |
| Bakmi Pak Joko — Kartini | Restoran mi / Warung makan | 16.00–23.00, **Rabu libur** | +62 851-9602-8889 | https://bakmijowopakjoko.web.id |
| Bakmi Pak Joko — Ciperna | Restoran mi / Warung makan | 16.00–23.00, **Senin libur** | +62 813-2472-6222 | https://bakmijowopakjoko.web.id |
| APW — Kesambi | Restoran ayam | 16.00–00.00, **Kamis libur** | [CEK] belum ada | https://ayampanggangwicaksono.web.id |

Catatan:
- Alamat di Google sebaiknya sama persis dengan web (lihat halaman **Cabang** tiap domain). Pak Joko Ciperna: tulis lengkap dengan "Kabupaten Cirebon" dan kode pos.
- Bolu Stasiun Kejaksan ada di dalam stasiun: pin boleh di gerai, alamat tetap alamat stasiun.
- Nama di Google: nama brand + cabang, tanpa kata promosi (mis. "Bakmi Jowo Anglo Pak Joko Kartini", bukan "Bakmi Terenak Cirebon"). Nama berisi kata promosi bisa membuat profil ditangguhkan.
- APW: begitu kartu Kesambi jadi, kirim nomor WA dan link kartunya ke Claude. Dua data itu yang masih kurang di web APW.

## Setelah semua selesai

Kabari Claude. Yang dikerjakan Claude berikutnya:
1. Pasang link kartu Google Maps resmi dan nomor yang baru ke web (APW, dan cabang lain bila berubah).
2. Cek laporan Search Console setelah 1–2 minggu: halaman yang belum terindeks, kata kunci yang mulai muncul.
3. Centang F6.4 di `ROADMAP.md`.
