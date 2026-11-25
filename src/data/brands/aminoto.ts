// Konten halaman Pecel Lele Sambel Dadak Aminoto (template DADAK), ditulis di kode.
// Sumber fakta (22 Okt 2026): daftar menu cabang Cipto kiriman Fran, situs deliveryaminoto.my.id, Google Maps tiap cabang,
// IG/TikTok resmi @pecellele.aminoto, jam buka dari Fran. Cerita ditulis Claude atas permintaan Fran, tanpa tahun/pendiri karangan.
// Web ini etalase: tidak ada keranjang, tombol pesan, atau link ojol. Menu, harga & cabang ada di DB (prisma/aminoto.ts).
import { DAY, weeklyHours, type DayHours } from "@/lib/hours";

/**
 * Foto produk dari Google Drive Fran (folder "gambar", 25 Nov 2026), diolah di scratchpad: piring dilihat dari atas
 * dipotong bulat (latar transparan) untuk piring berputar, sisanya portrait 3:4. Hero Cerita, Cabang & latar rating
 * masih frame reel IG resmi @pecellele.aminoto (suasana warung).
 */
const F = "/brands/aminoto/foto";
export const AMINOTO_IMAGES = {
  heroMenu: { src: `${F}/hero-menu-meja.webp`, srcHp: `${F}/hero-menu-meja-hp.webp`, alt: "Nasi, ayam goreng, tahu, tempe, lalapan, dan sambal dadak di meja kayu" },
  heroCerita: { src: `${F}/hero-cerita.webp`, alt: "Pembeli antre di depan papan menu Sambel Dadak Aminoto" },
  heroCabang: { src: `${F}/hero-cabang.webp`, alt: "Warung tenda Aminoto di malam hari" },
  panelBara: { src: `${F}/panel-lele-bakar.webp`, alt: "Lele bakar di cobek batu dengan tahu, tempe, dan sambal dadak" },
  latar: { src: `${F}/latar-ramai.webp`, alt: "Papan nama Aminoto di atas ruang makan" },
  catering: { src: `${F}/catering-sebar.webp`, alt: "Sate usus, nasi ayam, kangkung, dan sambal dadak tersaji di meja" },
  sambal: { src: `${F}/sambal-cobek.webp`, alt: "Sambal dadak merah di cobek batu" },
  /** Piring dari atas, dipotong bulat dengan latar transparan. */
  plates: {
    lele: { src: `${F}/piring-lele.webp`, alt: "Lele bakar dengan tahu, tempe, timun, dan lalapan di cobek batu, dilihat dari atas" },
    ayam: { src: `${F}/piring-ayam.webp`, alt: "Ayam goreng di atas selada, dilihat dari atas" },
    sate: { src: `${F}/piring-sate.webp`, alt: "Sate usus dengan tahu, tempe, dan timun, dilihat dari atas" },
    kangkung: { src: `${F}/piring-kangkung.webp`, alt: "Tumis kangkung bertabur bawang goreng di piring merah" },
  },
  strip: [
    { src: `${F}/strip-lele.webp`, alt: "Dua ekor lele bakar dengan tahu, tempe, dan jeruk limau" },
    { src: `${F}/strip-sambal.webp`, alt: "Nasi, ayam goreng, tahu, dan sambal dadak" },
    { src: `${F}/strip-sate.webp`, alt: "Sate usus dengan lalapan dan sambal dadak" },
    { src: `${F}/strip-makan.webp`, alt: "Tangan menyuwir lele bakar di cobek" },
    { src: `${F}/strip-ayam.webp`, alt: "Ayam goreng dengan bawang goreng, tahu, tempe, dan sambal" },
    { src: `${F}/strip-kangkung.webp`, alt: "Tumis kangkung bertabur bawang goreng" },
    { src: `${F}/strip-nasi.webp`, alt: "Nasi putih, ayam goreng, tahu, tempe, kol, dan timun" },
  ],
};

export type AminotoImage = { src: string; alt: string; srcHp?: string };

/** Jam buka semua cabang (Fran 25 Nov 2026): setiap hari 10.00–22.00, Jumat 12.45–22.00 (setelah salat Jumat). */
export const AMINOTO_HOURS: DayHours[] = weeklyHours("10:00", "22:00").map((h) => (h.dayOfWeek === DAY.JUMAT ? { ...h, opens: "12:45" } : h));
export const AMINOTO_OPEN_HOURS = "10.00 – 22.00, Jumat 12.45 – 22.00";

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
  hoursShort: "10.00–22.00",
  hoursNote: "Jumat mulai 12.45",

  hero: {
    title: "Sambalnya diulek pas kamu pesan.",
    sub: "Pecel lele, ayam, bebek & ikan bakar · Tiga cabang di Cirebon",
    cta: "Cari cabang terdekat",
  },

  /** Hero Beranda: kata raksasa di belakang piring, teks melingkar, stiker. */
  orbit: {
    words: ["Sambel", "Dadak"],
    ring: "Diulek pas kamu pesan · Pecel lele · Ayam · Bebek · Ikan bakar · ",
    sticker: "Sambal sudah termasuk",
    menuCta: "Lihat menu",
  },

  /** Adegan zoom ke cobek sambal saat halaman digulir. */
  cobek: {
    lines: ["Cabai.", "Tomat.", "Cobek.", "Diulek sekarang."],
    body: "Sambal dadak baru diulek waktu pesananmu masuk, dan sudah termasuk di harga menu.",
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
    pageSub: "Tiga cabang di Cirebon · Buka setiap hari 10.00–22.00, Jumat mulai 12.45",
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
      "Sekarang Aminoto ada di tiga tempat di Cirebon: Cipto, Sumber, dan Ciledug. Buka setiap hari dari pukul 10.00 sampai 22.00 (hari Jumat mulai pukul 12.45, setelah salat Jumat), buat makan siang, makan malam, atau ramai-ramai bareng keluarga dan teman.",
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
