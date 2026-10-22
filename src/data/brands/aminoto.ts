// Konten halaman Pecel Lele Sambel Dadak Aminoto (template DADAK), ditulis di kode.
// Sumber fakta (22 Okt 2026): daftar menu cabang Cipto kiriman Fran, situs deliveryaminoto.my.id, Google Maps tiap cabang,
// IG/TikTok resmi @pecellele.aminoto, jam buka dari Fran. Cerita ditulis Claude atas permintaan Fran, tanpa tahun/pendiri karangan.
// Web ini etalase: tidak ada keranjang, tombol pesan, atau link ojol. Menu, harga & cabang ada di DB (prisma/aminoto.ts).
import { weeklyHours, type DayHours } from "@/lib/hours";

/** Foto asli dari reel IG resmi @pecellele.aminoto (frame video tanpa teks overlay), dipotong portrait 3:4 untuk strip & kartu. */
const F = "/brands/aminoto/foto";
export const AMINOTO_IMAGES = {
  hero: { src: `${F}/hero-bara.webp`, srcHp: `${F}/hero-bara-hp.webp`, alt: "Ayam dibakar di atas bara yang menyala" },
  heroMenu: { src: `${F}/hero-menu.webp`, alt: "Pecel lele di atas daun pisang dengan nasi, lalapan, dan sambal" },
  heroCerita: { src: `${F}/hero-cerita.webp`, alt: "Pembeli antre di depan papan menu Sambel Dadak Aminoto" },
  heroCabang: { src: `${F}/hero-cabang.webp`, alt: "Warung tenda Aminoto di malam hari" },
  panelBara: { src: `${F}/panel-bara.webp`, alt: "Ayam dibakar di atas bara" },
  latar: { src: `${F}/latar-ramai.webp`, alt: "Papan nama Aminoto di atas ruang makan" },
  ctaPiring: { src: `${F}/cta-piring.webp`, alt: "Sepiring pecel lele dengan sambal dadak" },
  strip: [
    { src: `${F}/strip-papan.webp`, alt: "Pembeli di depan papan menu Sambal Dadak Aminoto" },
    { src: `${F}/strip-melayani.webp`, alt: "Kru Aminoto mengantar pesanan ke meja" },
    { src: `${F}/strip-tenda.webp`, alt: "Meja makan di bawah tenda Aminoto" },
    { src: `${F}/strip-malam.webp`, alt: "Warung Aminoto ramai di malam hari" },
    { src: `${F}/strip-dalam.webp`, alt: "Pembeli antre di dalam ruang makan Aminoto" },
    { src: `${F}/strip-spanduk.webp`, alt: "Spanduk Sambel Dadak: lele, ayam, bebek, nila" },
    { src: `${F}/strip-ramai.webp`, alt: "Pembeli memesan di kasir Aminoto" },
  ],
};

export type AminotoImage = { src: string; alt: string; srcHp?: string };

/** Jam buka semua cabang (dikoreksi Fran 22 Okt 2026, sama dengan bio IG & spanduk): setiap hari 11.00–22.00. */
export const AMINOTO_HOURS: DayHours[] = weeklyHours("11:00", "22:00");
export const AMINOTO_OPEN_HOURS = "11.00 – 22.00 setiap hari";

/**
 * Cabang resmi. Alamat, titik & telepon dari Google Maps; link Maps dari deliveryaminoto.my.id.
 * WA admin tiap cabang: Sumber dari daftar menu ("Admin Sumber"), Cipto & Ciledug dari Fran (22 Okt 2026).
 */
export const AMINOTO_BRANCHES = [
  {
    name: "Cipto",
    address: "Jl. DR. Cipto Mangunkusumo No.199, Pekiringan, Kec. Kesambi, Kota Cirebon 45132",
    mapsUrl: "https://www.google.com/maps/place/Pecel+Lele+Sambel+Dadak+Aminoto/data=!4m2!3m1!1s0x2e6ee3a563e85147:0xacc385845008a051",
    lat: -6.7228936,
    lng: 108.5501909,
    phone: "0851-9424-2550",
    whatsapp: "0858-7146-6254",
  },
  {
    name: "Sumber",
    address: "Jl. Pangeran Cakrabuana No.8, Kemantren, Kec. Sumber, Kabupaten Cirebon 45611",
    mapsUrl: "https://www.google.com/maps/place/Pecel+Lele+Sambel+Dadak+Aminoto+Sumber/data=!4m2!3m1!1s0x2e6f1f32b0accab7:0xe032e0ec913fd605",
    lat: -6.7585171,
    lng: 108.4922366,
    phone: "0851-8590-7890",
    whatsapp: "0851-8590-7890",
  },
  {
    name: "Ciledug",
    address: "Dekat pintu tol Ciledug, Ciledug Kulon, Kec. Ciledug, Kabupaten Cirebon 45188",
    mapsUrl: "https://maps.app.goo.gl/5w4LEtTEFnhvY5Jy6",
    lat: -6.8894375,
    lng: 108.7526875,
    phone: null,
    whatsapp: "0851-9602-8883",
  },
];

export const AMINOTO = {
  shortName: "Aminoto",
  kicker: "Pecel Lele · Sambel Dadak",
  hoursShort: "11.00–22.00",

  hero: {
    title: "Sambalnya diulek pas kamu pesan.",
    sub: "Pecel lele, ayam, bebek & ikan bakar · Tiga cabang di Cirebon",
    cta: "Cari cabang terdekat",
  },

  intro: {
    label: "Selamat datang di",
    title: "Sambal dadak, diulek di cobek saat pesananmu masuk.",
    body: "Bukan sambal yang disiapkan dari pagi. Cabai, tomat, dan bumbunya baru diulek waktu kamu pesan, dan sudah termasuk di harga menu.",
    cta: "Kenalan dengan Aminoto",
  },

  featured: {
    label: "Menu andalan",
    title: "Yang bikin orang balik lagi.",
    cta: "Lihat semua menu",
  },

  catering: {
    title: "Ada acara? Pesan catering Aminoto.",
    body: "Paket nasi box mulai 20 ribuan per box, minimal 10 box. Tanya menu dan harganya langsung ke admin catering.",
    cta: "Tanya via WhatsApp",
    whatsapp: "0882-1304-4259",
    message: "Halo Admin Catering Aminoto, saya mau tanya paket catering untuk acara.",
  },

  bakar: {
    label: "Gurame · Nila · Ayam · Bebek",
    title: "Mau dibakar? Bisa.",
    sub: "Bilang saja waktu pesan",
    price: "Tambah Rp2.000",
    cta: "Lihat menu",
    body: "Semua lauk utama bisa digoreng atau dibakar di atas bara. Sambal dadaknya tetap ikut.",
  },

  branches: {
    title: "Tiga cabang, buka tiap hari.",
    lead: "Cipto, Sumber, dan Ciledug. Datang langsung, pesan di kasir, sambalnya diulek saat itu juga.",
    cta: "Info lengkap cabang",
    pageTitle: "Cabang & kontak",
    pageSub: "Tiga cabang di Cirebon · Buka setiap hari 11.00–22.00",
  },

  /** Rating Google Maps tiap cabang (dicek 22 Okt 2026). Perbarui kalau angkanya sudah jauh berubah. */
  ratings: {
    title: "Kata pembeli di Google Maps",
    note: "Rating Google Maps, Oktober 2026",
    items: [
      { branch: "Sumber", rating: "4,7", count: "453 ulasan" },
      { branch: "Ciledug", rating: "4,7", count: "169 ulasan" },
      { branch: "Cipto", rating: "4,5", count: "409 ulasan" },
    ],
  },

  closing: { left: "Sambalnya", right: "lagi diulek.", cta: "Cari cabang terdekat" },

  menu: {
    title: "Menu & harga",
    sub: "Sambal dadak sudah termasuk · Nasi dihitung terpisah",
    notes: ["Gurame, nila, ayam & bebek bisa dibakar, tambah Rp2.000.", "Ayam & bebek dijual per porsi.", "Harga dapat berubah sewaktu-waktu."],
  },

  story: {
    title: "Sambal dadak, dari cobek ke piringmu.",
    label: "Cerita kami",
    paragraphs: [
      "Pecel Lele Sambel Dadak Aminoto berangkat dari satu hal sederhana: sambal paling enak itu sambal yang baru diulek. Karena itu sambal kami dibuat dadakan, diulek di cobek saat pesananmu masuk.",
      "Lelenya digoreng sampai garing, ayam dan bebeknya dijual per porsi, dan gurame, nila, ayam, juga bebek bisa dibakar di atas bara kalau kamu lebih suka aroma panggang. Sambalnya sudah termasuk di harga menu, tinggal pilih lauk dan nasinya.",
      "Sekarang Aminoto ada di tiga tempat di Cirebon: Cipto, Sumber, dan Ciledug. Buka setiap hari dari pukul 11.00 sampai 22.00, buat makan siang, makan malam, atau ramai-ramai bareng keluarga dan teman.",
    ],
    valuesTitle: "Yang kami jaga.",
    values: [
      { title: "Diulek dadakan", body: "Sambal dibuat saat pesanan masuk, bukan dari pagi." },
      { title: "Per porsi", body: "Ayam dan bebek dijual per porsi, pas buat sendiri." },
      { title: "Bisa dibakar", body: "Gurame, nila, ayam & bebek, tambah Rp2.000." },
      { title: "Tiga cabang", body: "Cipto, Sumber, Ciledug. Buka setiap hari." },
    ],
  },

  footer: {
    note: "Bagian dari keluarga kuliner Nobitos · Cirebon",
  },
};
