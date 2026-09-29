// Konten halaman Ayam Panggang Wicaksono (template TUNGKU), ditulis di kode.
// Sumber: menu cetak resmi & keterangan Fran (29 Sep 2026). Brand, menu & cabang ada di database (prisma/apw.ts).
// Web ini etalase, bukan untuk pesan: tidak ada keranjang, tombol order, atau link GrabFood/GoFood.
// Aturan copy: hanya fakta yang dikonfirmasi Fran. Klaim lain (tahun berdiri, pendiri, resep turun-temurun, halal,
// bahan tertentu, penghargaan) ditulis sebagai TODO dan tidak ditampilkan.

/** Gambar sementara (ilustrasi SVG). Ganti file di public/brands/apw/ dengan nama yang sama, atau ubah path di sini. */
export const APW_IMAGES = {
  hero: { src: "/brands/apw/hero-tungku-bara.svg", alt: "Ilustrasi tungku gerabah dengan bara menyala dan asap tipis, tempat ayam dipanggang" },
  cerita: { src: "/brands/apw/cerita-tungku-gerabah.svg", alt: "Ilustrasi deretan tungku gerabah berisi panci tanah liat di atas meja warung" },
  suasana: { src: "/brands/apw/suasana-warung.svg", alt: "Ilustrasi suasana warung Ayam Panggang Wicaksono dengan meja, kursi, dan lampu gantung" },
  cabang: { src: "/brands/apw/cabang-kesambi.svg", alt: "Ilustrasi bagian depan warung Ayam Panggang Wicaksono cabang Kesambi, Cirebon" },
} as const;

/** Cabang (satu-satunya): Kesambi. Nilai ini ditulis ke DB oleh `npm run apw:seed`; halaman membaca dari DB. */
export const APW_BRANCH = {
  slug: "kesambi",
  name: "Kesambi",
  /** Wilayah (bukan alamat jalan), untuk label kartu cabang. */
  area: "Kesambi, Cirebon",
  // TODO: konfirmasi Fran — alamat lengkap cabang Kesambi. Kosong = tidak dirender (juga tidak masuk JSON-LD).
  address: "",
  // TODO: konfirmasi Fran — jam buka & hari libur (7 hari). Kosong = badge Buka/Tutup & openingHours tidak dirender.
  openHours: null as string | null,
  // TODO: konfirmasi Fran — nomor WhatsApp cabang. Kosong = tombol WA tidak dirender.
  whatsapp: null as string | null,
  // TODO: konfirmasi Fran — link Google Maps. Kosong = tombol Maps tidak dirender.
  mapsUrl: null as string | null,
  // TODO: konfirmasi Fran — titik koordinat (JSON-LD `geo`).
  lat: null as number | null,
  lng: null as number | null,
};

export const APW = {
  /** Teks tagline tercetak di menu resmi. */
  tagline: "Nikmati sajian lezat ayam panggang dan aneka pilihan menu segar!",

  hero: {
    /** Baris kecil di atas nama brand. */
    label: "Kesambi · Cirebon",
    /** Nama brand dipecah dua baris di hero & logo sementara. */
    lines: ["Ayam Panggang", "Wicaksono"],
  },

  // Section "Cerita" di Beranda.
  intro: {
    title: "Cerita",
    body: "Ayam dan bebek kami dipanggang di dalam tungku gerabah. Pilih ayam panggang negeri, ayam panggang kampung, atau bebek panggang, lalu lengkapi dengan menu tambahan dan minuman segar. Kami tunggu di Kesambi, Cirebon.",
    cta: "Cerita lengkap",
  },

  featured: {
    title: "Menu Unggulan",
    more: "Lihat deskripsi",
    cta: "Semua menu",
  },

  /** Kalimat di atas ilustrasi suasana (Beranda). */
  quote: "Ayam panggang, nasi, sate, dan es teh. Sesederhana itu makan enak.",

  location: {
    title: "Cabang",
    body: "Satu cabang, di Kesambi, Cirebon.",
    cta: "Lihat cabang",
  },

  instagram: {
    title: "Ikuti di Instagram",
    body: "Kabar terbaru, menu, dan suasana warung ada di sana.",
  },

  // Halaman Cerita.
  story: {
    title: "Cerita",
    lead: "Ayam panggang dari tungku gerabah, di Kesambi, Cirebon.",
    paragraphs: [
      "Ayam Panggang Wicaksono adalah warung ayam panggang di Kesambi, Cirebon. Yang kami sajikan sederhana: ayam dan bebek panggang, nasi, dan teman makan yang bikin betah.",
      "Ayam dan bebeknya dipanggang di dalam tungku gerabah. Pilih ayam negeri atau ayam kampung, bagian dada atau paha. Mau yang beda? Ada bebek panggang.",
      "Lengkapi dengan tempe, tahu, sate usus, sate kulit, sate ati ampela, kol goreng, pete, atau krupuk. Untuk minum ada teh panas atau es, es teh kampul, jeruk, dan air mineral.",
      "Datang bareng anak? Ada menu anak yang tidak pedas, tanpa bumbu panggang.",
      // TODO: konfirmasi Fran — asal-usul (tahun berdiri, siapa Wicaksono, sejak kapan pakai tungku gerabah). Sengaja tidak dikarang.
    ],
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
    /** Tampil selama alamat/jam/WA/Maps belum ada di data cabang. */
    pending: "Alamat lengkap, jam buka, dan kontak segera kami lengkapi. Sementara itu, kabar terbaru ada di Instagram dan TikTok kami.",
  },
};
