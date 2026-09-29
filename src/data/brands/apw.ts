// Konten halaman Ayam Panggang Wicaksono (template TUNGKU), ditulis di kode.
// Sumber fakta: menu cetak resmi & keterangan Fran (29 Sep 2026) + akun Instagram resmi @ayampanggangwicaksono
// (bio: slogan, alamat, jam buka; caption & video reel 17 Jul dan 28 Agu 2026: proses panggang di tungku gerabah).
// Desain: Figma "APW — Template Tungku (web)" https://www.figma.com/design/LkzvL90pPoUNbf3GnoagWl
// Web ini etalase, bukan untuk pesan: tidak ada keranjang, tombol order, atau link GrabFood/GoFood.
// Klaim yang belum dikonfirmasi (tahun berdiri, pendiri, resep turun-temurun, halal, penghargaan) tidak ditulis.
import { DAY, weeklyHours } from "@/lib/hours";

/**
 * Foto sementara: potongan adegan dari video reel Instagram resmi APW (resolusi 720 px).
 * Ganti file di public/brands/apw/foto/ dengan nama yang sama (WebP), atau ubah path di sini.
 */
export const APW_IMAGES = {
  hero: {
    src: "/brands/apw/foto/hero-tungku-mengepul.webp",
    alt: "Tungku gerabah mengepul, ayam berbumbu sedang dipanggang di dalamnya",
  },
  ceritaMasuk: {
    src: "/brands/apw/foto/cerita-ayam-masuk-tungku.webp",
    alt: "Tangan bersarung plastik memasukkan ayam berbumbu rempah ke dalam tungku gerabah",
  },
  ceritaDeretan: {
    src: "/brands/apw/foto/cerita-deretan-tungku.webp",
    alt: "Juru masak membuka tutup tungku gerabah yang berasap di dapur warung",
  },
  suasana: {
    src: "/brands/apw/foto/suasana-warung-ramai.webp",
    alt: "Warung Ayam Panggang Wicaksono ramai pengunjung di bawah spanduk merah saat senja",
  },
  cabang: {
    src: "/brands/apw/foto/cabang-kesambi-malam.webp",
    alt: "Tampak depan warung Ayam Panggang Wicaksono di Kesambi pada malam hari, penuh pengunjung",
  },
  logo: { src: "/brands/apw/foto/logo-apw.webp", alt: "Logo Ayam Panggang Wicaksono" },
} as const;

/** Cabang (satu-satunya): Kesambi. Ditulis ke DB oleh `npm run apw:seed`; halaman membaca dari DB. */
export const APW_BRANCH = {
  slug: "kesambi",
  name: "Kesambi",
  /** Wilayah, untuk label singkat. */
  area: "Kesambi, Cirebon",
  // Alamat & jam dari bio Instagram resmi (dipakai atas persetujuan Fran, 29 Sep 2026).
  address: "Jl. DR. Cipto Mangunkusumo No.142, Kesambi, Kec. Kesambi, Kota Cirebon, Jawa Barat 45134",
  openHours: "16.00 – 00.00 WIB, Kamis libur",
  hours: weeklyHours("16:00", "00:00", [DAY.KAMIS]),
  // TODO: konfirmasi Fran — nomor WhatsApp cabang. Kosong = tombol WA tidak dirender.
  whatsapp: null as string | null,
  // TODO: konfirmasi Fran — link Google Maps resmi. Sementara tombol Maps memakai pencarian alamat.
  mapsUrl: null as string | null,
  // TODO: konfirmasi Fran — titik koordinat (JSON-LD `geo`).
  lat: null as number | null,
  lng: null as number | null,
};

export const APW = {
  /** Teks tagline tercetak di menu resmi. */
  tagline: "Nikmati sajian lezat ayam panggang dan aneka pilihan menu segar!",
  /** Slogan di bio & logo Instagram ("SMOKIE NYA BIKIN NAGIH"). */
  slogan: "Smokie-nya bikin nagih.",

  hero: {
    label: "Kesambi · Cirebon",
    /** Nama brand dipecah dua baris di hero & logo teks. */
    lines: ["Ayam Panggang", "Wicaksono"],
  },

  // Section "Cerita" di Beranda.
  intro: {
    title: "Cerita",
    body: "Ayam dibaluri bumbu rempah, lalu dipanggang di dalam tungku gerabah. Kalau warnanya sudah gelap mengilap, tandanya matang, dan wangi bakarannya sudah tercium dari jauh. Itu smokie yang bikin nagih.",
    cta: "Cerita lengkap",
  },

  featured: {
    title: "Menu Unggulan",
    more: "Lihat deskripsi",
    cta: "Semua menu",
  },

  /** Kalimat di atas foto suasana (Beranda). */
  quote: "Buka dari sore sampai tengah malam. Datang sendiri, bareng teman, atau sekeluarga.",

  location: { title: "Cabang", cta: "Lihat cabang" },

  instagram: { title: "Ikuti di Instagram" },

  // Halaman Cerita.
  story: {
    title: "Cerita",
    chapters: [
      {
        title: "Dari tungku gerabah",
        body: "Di warung kami di Jl. DR. Cipto Mangunkusumo, Kesambi, deretan tungku gerabah jadi pusat dapur. Ayam yang sudah dibaluri bumbu rempah masuk ke dalam tungku, lalu dipanggang di sana.",
        image: "ceritaDeretan",
      },
      {
        title: "Tanda matangnya",
        body: "Kami tunggu sampai warnanya gelap mengilap. Rempahnya meresap, lalu terpanggang sampai aromanya keluar. Wangi bakaran itu biasanya tercium duluan, bahkan dari jauh.",
        image: "ceritaMasuk",
      },
    ],
    extras: [
      {
        title: "Pilih sesukamu",
        body: "Ayam negeri atau ayam kampung, bagian dada atau paha. Mau selain ayam? Ada bebek panggang. Lengkapi dengan tempe, tahu, sate usus, sate kulit, sate ati ampela, kol goreng, pete, atau krupuk, lalu es teh kampul atau es jeruk.",
      },
      { title: "Buat semua umur", body: "Datang bareng anak? Ada menu anak yang tidak pedas, tanpa bumbu panggang." },
    ],
    closing: {
      title: "Sore sampai tengah malam",
      body: "Buka 16.00–00.00 WIB, Kamis libur. Kami tunggu di Kesambi, Cirebon.",
    },
    // TODO: konfirmasi Fran — asal-usul (siapa Wicaksono; logo tertulis "Sejak 2024"). Sengaja belum ditulis.
  },

  // Halaman Menu.
  menu: {
    title: "Menu",
    lead: "Semua harga dalam rupiah. Harga dapat berubah sewaktu-waktu.",
    /** Catatan tercetak di menu resmi. */
    note: "Menu anak tidak pedas, tanpa bumbu panggang.",
  },

  // Halaman Cabang.
  branches: {
    title: "Cabang",
    lead: "Temukan kami di Kesambi, Cirebon.",
    follow: "Ikuti kabar terbaru",
  },
};

export type ApwImageKey = keyof typeof APW_IMAGES;
