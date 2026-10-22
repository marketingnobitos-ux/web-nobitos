// Konten halaman Ayam Panggang Wicaksono untuk template GERABAH (pengganti TUNGKU), ditulis di kode.
// Referensi desain dari Fran (22 Okt 2026): Dribbble "Daily Dishes Lab — Culinary Web Experience" — blok warna tanah,
// garis grid tipis, judul kapital besar, sajian bulat "melayang", kartu kaca berisi data.
// Sumber fakta: BRIEF-APW.md (menu cetak resmi, bio IG) + caption TikTok resmi @ayampanggang.wicaksono
// (grand opening 14 Juni 2026, "depan Jagoan Khitan", "dipanggang pakai tungku grabah", "kalau udah agak gelap tandanya matang").
// Web ini etalase, bukan untuk pesan: tidak ada keranjang, tombol order, atau link GrabFood/GoFood.
// Klaim yang belum dikonfirmasi (pendiri, resep turun-temurun, halal, penghargaan, rating) tidak ditulis.
import { APW, APW_BRANCH } from "@/data/brands/apw";

export type GerabahPhoto = { src: string; alt: string; width: number; height: number };

/**
 * Foto: potongan adegan video TikTok resmi APW (lebar 576 px; teks & watermark TikTok dipotong atau dihaluskan).
 * `ayamTungku` & `sajian` berlatar transparan (bulat) untuk sajian "melayang" di hero.
 * Ganti file di public/brands/apw/tiktok/ dengan nama yang sama (WebP) kalau ada foto asli resolusi tinggi.
 */
export const GR_PHOTOS = {
  ayamTungku: {
    src: "/brands/apw/tiktok/ayam-tungku-atas.webp",
    alt: "Potongan ayam berbumbu rempah dipanggang di atas jaring dalam tungku gerabah, dilihat dari atas",
    width: 552,
    height: 552,
  },
  sajian: {
    src: "/brands/apw/tiktok/sajian-piring-atas.webp",
    alt: "Sepiring ayam panggang, nasi di atas daun pisang, sambal, timun, dan lalapan dilihat dari atas",
    width: 490,
    height: 490,
  },
  tungkuApi: {
    src: "/brands/apw/tiktok/hero-tungku-api.webp",
    alt: "Ayam di atas jaring dalam tungku gerabah, api kompor biru menyala di bawahnya",
    width: 576,
    height: 850,
  },
  api: { src: "/brands/apw/tiktok/api-tungku.webp", alt: "Api kompor biru menyala di dalam lubang tungku gerabah", width: 576, height: 664 },
  asap: {
    src: "/brands/apw/tiktok/asap-tungku.webp",
    alt: "Ayam dibalik dengan penjepit di atas jaring tungku gerabah yang berasap",
    width: 576,
    height: 664,
  },
  masuk: {
    src: "/brands/apw/tiktok/masuk-tungku.webp",
    alt: "Tangan bersarung plastik menata ayam berbumbu ke dalam tungku gerabah",
    width: 576,
    height: 432,
  },
  bumbu: { src: "/brands/apw/tiktok/bumbu-meresap.webp", alt: "Potongan ayam direndam bumbu rempah di dalam wadah", width: 576, height: 462 },
  deretan: {
    src: "/brands/apw/tiktok/deretan-tungku-asap.webp",
    alt: "Deretan tungku gerabah mengepulkan asap saat juru masak membuka tutupnya",
    width: 576,
    height: 324,
  },
  piringLengkap: {
    src: "/brands/apw/tiktok/piring-lengkap.webp",
    alt: "Ayam panggang dengan nasi, timun, lalapan, dan segelas teh di meja putih",
    width: 576,
    height: 324,
  },
  piringDaun: {
    src: "/brands/apw/tiktok/piring-daun-pisang.webp",
    alt: "Ayam panggang berwarna gelap mengilap di atas daun pisang",
    width: 576,
    height: 622,
  },
  nampan: {
    src: "/brands/apw/tiktok/nampan-ayam.webp",
    alt: "Ayam panggang, lalapan, dan sate disajikan di piring beralas kertas",
    width: 500,
    height: 252,
  },
  senja: {
    src: "/brands/apw/tiktok/suasana-senja.webp",
    alt: "Pengunjung makan di bawah spanduk Ayam Panggang Wicaksono saat senja",
    width: 576,
    height: 332,
  },
  malamMinggu: {
    src: "/brands/apw/tiktok/suasana-malam-minggu.webp",
    alt: "Tenda Ayam Panggang Wicaksono penuh pengunjung pada malam Minggu",
    width: 576,
    height: 367,
  },
  depan: {
    src: "/brands/apw/tiktok/depan-jagoan-khitan.webp",
    alt: "Tampak depan warung Ayam Panggang Wicaksono di bawah papan nama Klinik Jagoan Khitan pada malam hari",
    width: 576,
    height: 562,
  },
  logo: { src: "/brands/apw/foto/logo-apw.webp", alt: "Logo Ayam Panggang Wicaksono", width: 150, height: 150 },
} satisfies Record<string, GerabahPhoto>;

export type GerabahPhotoKey = keyof typeof GR_PHOTOS;

/** Slide hero Beranda. Warna blok: kiri atas `clay` (gerabah), kanan `slate` (asap) & `leaf` (daun pisang). */
export const GR_SLIDES: { title: string[]; body: string; photo: GerabahPhotoKey; side: { label: string; value: string } }[] = [
  {
    title: ["Dipanggang", "di tungku", "gerabah"],
    body: "Ayam dibaluri bumbu rempah, lalu dipanggang di dalam tungku gerabah sampai wangi bakarannya keluar.",
    photo: "ayamTungku",
    side: { label: "Pemanggang", value: "Tungku gerabah" },
  },
  {
    title: ["Smokie-nya", "bikin", "nagih"],
    body: "Seporsi ayam panggang, nasi hangat di atas daun pisang, sambal, dan lalapan. Sederhana, tapi bikin balik lagi.",
    photo: "sajian",
    side: { label: "Satu porsi", value: "1/4 ekor" },
  },
  {
    title: ["Sore sampai", "tengah", "malam"],
    body: "Buka 16.00–00.00 WIB, Kamis libur. Datang sendiri, bareng teman, atau sekeluarga.",
    photo: "api",
    side: { label: "Jam buka", value: "16.00–00.00" },
  },
];

export const GR = {
  /** Nama pendek untuk ruang sempit (rail, footer kecil). */
  shortName: "APW",
  slogan: APW.slogan,
  tagline: APW.tagline,
  /** Sejak grand opening (caption TikTok resmi 13 & 14 Juni 2026). */
  since: "Buka sejak 14 Juni 2026",
  /** Patokan lokasi dari caption TikTok resmi ("Depan Jagoan Khitan"). */
  landmark: "Depan Klinik Jagoan Khitan",
  area: APW_BRANCH.area,
  hoursShort: "16.00–00.00",
  closedDay: "Kamis libur",

  home: {
    statsTitle: "Sekilas di meja",
    proses: {
      kicker: "Dari dapur",
      title: ["Tiga langkah", "sebelum sampai", "di piringmu"],
      lead: "Semua dikerjakan di dapur terbuka di bawah tenda kami, jadi kamu bisa lihat sendiri tungkunya mengepul.",
      steps: [
        {
          no: "01",
          title: "Bumbu rempah meresap",
          body: "Potongan ayam dibaluri bumbu rempah dan didiamkan dulu, biar bumbunya masuk sampai ke dalam.",
          photo: "bumbu",
        },
        {
          no: "02",
          title: "Masuk tungku gerabah",
          body: "Ayam ditata di atas jaring di dalam tungku gerabah, api kompor menyala di bawahnya. Asapnya yang bikin khas.",
          photo: "masuk",
        },
        {
          no: "03",
          title: "Diangkat saat gelap mengilap",
          body: "Kalau warnanya sudah gelap dan mengilap, tandanya matang. Diangkat, langsung disajikan selagi hangat.",
          photo: "asap",
        },
      ] as { no: string; title: string; body: string; photo: GerabahPhotoKey }[],
    },
    menu: { kicker: "Daftar menu", title: "Pilih ayam, lengkapi lauknya", cta: "Menu lengkap" },
    suasana: {
      kicker: "Suasana",
      title: "Malam Minggu kali ini makan di mana?",
      body: "Tenda kami di Kesambi ramai dari sore. Meja panjang di bawah tenda, makan bareng, ngobrol sampai malam.",
    },
    lokasi: { kicker: "Lokasi", cta: "Buka di Google Maps", more: "Detail cabang" },
  },

  menu: {
    title: ["Daftar", "menu"],
    lead: "Semua harga dalam rupiah. Harga dapat berubah sewaktu-waktu.",
    /** Catatan tercetak di menu resmi. */
    note: "Menu anak tidak pedas, tanpa bumbu panggang.",
  },

  story: {
    title: ["Cerita", "dari tungku"],
    lead: "Ayam Panggang Wicaksono buka di Kesambi, Cirebon, sejak 14 Juni 2026. Dapur kami berpusat di deretan tungku gerabah.",
    chapters: [
      {
        kicker: "Tungku",
        title: "Dipanggang di tungku gerabah",
        body: "Bukan di atas arang terbuka: ayam masuk ke dalam tungku gerabah, api kompor menyala di bawahnya. Panasnya tertahan di dinding tanah liat, asapnya ikut membungkus ayam. Dari situ aroma smokie yang khas.",
        photo: "tungkuApi",
      },
      {
        kicker: "Bumbu",
        title: "Rempahnya meresap dulu",
        body: "Sebelum dipanggang, ayam dibaluri bumbu rempah dan didiamkan supaya bumbunya masuk. Saat dipanggang, rempah itu terbakar pelan sampai wanginya keluar.",
        photo: "bumbu",
      },
      {
        kicker: "Matang",
        title: "Tandanya: gelap mengilap",
        body: "Kami tunggu sampai warnanya gelap dan mengilap. Baru diangkat, ditaruh di atas daun pisang, dan disajikan bersama nasi hangat, sambal, dan lalapan.",
        photo: "piringDaun",
      },
    ] as { kicker: string; title: string; body: string; photo: GerabahPhotoKey }[],
    extras: [
      {
        title: "Pilih sesukamu",
        body: "Ayam negeri atau ayam kampung, bagian dada atau paha. Mau selain ayam? Ada bebek panggang. Lengkapi dengan sate usus, sate kulit, sate ati ampela, tempe, tahu, kol goreng, pete, atau krupuk.",
      },
      { title: "Buat semua umur", body: "Datang bareng anak? Ada menu anak yang tidak pedas, tanpa bumbu panggang." },
      { title: "Sore sampai tengah malam", body: "Buka 16.00–00.00 WIB, Kamis libur. Kami tunggu di Kesambi, Cirebon." },
    ],
    // TODO: konfirmasi Fran — asal-usul (siapa Wicaksono; logo tertulis "Sejak 2024"). Sengaja belum ditulis.
  },

  branches: {
    title: ["Cabang", "Kesambi"],
    lead: "Satu-satunya cabang kami, di Jl. DR. Cipto Mangunkusumo, Kesambi, Cirebon.",
    follow: "Kabar terbaru di media sosial",
  },

  footer: { note: "Web ini hanya informasi menu & lokasi. Pesan langsung di tempat." },
};
