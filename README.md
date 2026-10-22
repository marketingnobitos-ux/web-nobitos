# Web Nobitos

Satu aplikasi Next.js 15 untuk situs semua brand kuliner Nobitos + panel Admin. Brand dipilih dari hostname
(mis. `bakmijowopakjoko.web.id`); Admin ada di host `ADMIN_HOST`. Rencana & status kerja: `ROADMAP.md`. Spesifikasi: `PRD.md`.

## Jalankan di komputer (dev)

```bash
npm install
npm run dev
```

- Admin: http://localhost:3000/admin
- Situs brand: http://localhost:3000/preview/<slug>, mis. `/preview/bakmi-pak-joko`
- Cek kode: `npm run typecheck` dan `npm run lint`

## Update situs live (VPS)

Setelah kode di-push:

```bash
cd /home/ubuntu/web-nobitos && git pull && npm ci && npx prisma migrate deploy && npm run build && pm2 restart web-nobitos
```

Data brand ke DB VPS selalu lewat seed khusus per brand (mis. `npm run apw:seed`), jangan `prisma db seed` penuh.

## Lupa password Admin

Jalankan satu perintah ini di VPS, ganti `emailanda@contoh.com` dengan email admin yang lupa password. Password baru
diminta langsung di terminal (minimal 8 karakter). Kalau email belum terdaftar, akun Super Admin baru dibuat.

```bash
cd /home/ubuntu/web-nobitos && npm run admin:set-password -- emailanda@contoh.com
```

Setelah itu login seperti biasa di halaman `/admin/login`.

## Preview brand yang belum tayang

Brand berstatus Draft atau yang belum punya domain bisa dilihat oleh admin yang sudah login lewat tombol **Preview ↗**
di halaman brand Admin (alamat `/preview/<slug>` di host Admin). Halaman preview diberi `noindex`, tidak tercatat di
analitik, dan menampilkan penanda "Mode preview".
