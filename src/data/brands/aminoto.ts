// Konten halaman Pecel Lele Sambel Dadak Aminoto (template DADAK), ditulis di kode.
// Sumber fakta (22 Okt 2026): daftar menu cabang Cipto kiriman Fran, situs deliveryaminoto.my.id, Google Maps tiap cabang,
// IG/TikTok resmi @pecellele.aminoto, jam buka dari Fran. Cerita ditulis Claude atas permintaan Fran, tanpa tahun/pendiri karangan.
// Web ini etalase: tidak ada keranjang, tombol pesan, atau link ojol. Menu, harga & cabang ada di DB (prisma/aminoto.ts).
import { weeklyHours, type DayHours } from "@/lib/hours";

/** Foto asli dari reel IG resmi @pecellele.aminoto (frame video, teks overlay dipotong). */
export const AMINOTO_IMAGES = {
  hero: { src: "/brands/aminoto/foto/hero-pecel-lele.webp", alt: "Pecel lele goreng di atas daun pisang dengan nasi, lalapan, dan sambal dadak" },
  pecelLele: { src: "/brands/aminoto/foto/menu-pecel-lele.webp", alt: "Sepiring pecel lele dengan nasi, lalapan, dan sambal" },
  ayamBakar: { src: "/brands/aminoto/foto/menu-ayam-bakar.webp", alt: "Dua potong ayam bakar di atas piring" },
  ayamSate: { src: "/brands/aminoto/foto/menu-ayam-sate.webp", alt: "Sate usus dan ayam bakar di atas piring" },
  sambal: { src: "/brands/aminoto/foto/sambal-ulek.webp", alt: "Sambal dadak sedang diulek di cobek batu" },
  bara: { src: "/brands/aminoto/foto/bara-panggang.webp", alt: "Ayam dibakar di atas bara" },
  setMakan: { src: "/brands/aminoto/foto/set-makan.webp", alt: "Nasi, ayam, sambal di cobek, dan es teh di meja makan" },
  suasana: { src: "/brands/aminoto/foto/suasana-warung.webp", alt: "Suasana makan ramai di warung Aminoto" },
} as const;

export type AminotoImage = (typeof AMINOTO_IMAGES)[keyof typeof AMINOTO_IMAGES];

/** Jam buka semua cabang (keputusan Fran 22 Okt 2026): setiap hari 10.00–22.00. */
export const AMINOTO_HOURS: DayHours[] = weeklyHours("10:00", "22:00");
export const AMINOTO_OPEN_HOURS = "10.00 – 22.00 setiap hari";

/** Cabang resmi. Alamat, titik & telepon dari Google Maps; link Maps dari deliveryaminoto.my.id; WA Sumber dari daftar menu ("Admin Sumber"). */
export const AMINOTO_BRANCHES = [
  {
    name: "Cipto",
    address: "Jl. DR. Cipto Mangunkusumo No.199, Pekiringan, Kec. Kesambi, Kota Cirebon 45132",
    mapsUrl: "https://www.google.com/maps/place/Pecel+Lele+Sambel+Dadak+Aminoto/data=!4m2!3m1!1s0x2e6ee3a563e85147:0xacc385845008a051",
    lat: -6.7228936,
    lng: 108.5501909,
    phone: "0851-9424-2550",
    whatsapp: null,
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
    whatsapp: null,
  },
];

export const AMINOTO = {
  shortName: "Aminoto",
  kicker: "Pecel Lele · Sambel Dadak",
  hoursShort: "10.00–22.00",

  hero: {
    /** Kata di antara *...* diberi stabilo. */
    title: "Sambalnya *diulek* pas kamu pesan.",
    lead: "Lele garing, ayam & bebek per porsi, ikan bisa dibakar. Sambal dadaknya baru dibuat waktu pesananmu masuk, jadi selalu segar dan nendang.",
    primary: "Lihat menu",
    secondary: "Cari cabang",
    price: { label: "Pecel Lele", value: "18rb" },
    /** Pintasan kategori ke halaman menu. */
    shortcuts: [
      { label: "Lauk utama", href: "/menu#lauk-utama" },
      { label: "Lauk tambahan", href: "/menu#lauk-tambahan" },
      { label: "Sambal & sayur", href: "/menu#sambal-sayur" },
      { label: "Minuman", href: "/menu#minuman" },
    ],
  },

  featured: {
    title: "Paling sering dipesan",
    lead: "Yang ini jarang sisa sampai tutup.",
  },

  sambal: {
    title: "Kenapa namanya *sambel dadak*?",
    body: "Karena dibuat dadakan. Cabai, tomat, dan bumbu baru diulek di cobek saat pesananmu masuk, bukan disiapkan dari pagi. Sambalnya sudah termasuk di harga menu.",
    points: [
      "Sambal diulek dadakan, sudah termasuk harga",
      "Ayam & bebek dijual per porsi, bukan per ekor",
      "Gurame, nila, ayam & bebek bisa dibakar (+Rp2.000)",
      "Nasi dihitung terpisah",
    ],
    badge: { top: "Bisa", bottom: "dibakar" },
  },

  branches: {
    title: "Tiga cabang, buka tiap hari",
    lead: "Datang langsung ke cabang terdekat. Buka setiap hari pukul 10.00–22.00.",
    pageTitle: "Cabang & Kontak",
    pageLead: "Tiga cabang di Cirebon, buka setiap hari pukul 10.00–22.00.",
  },

  catering: {
    title: "Ada acara? Ada *catering* Aminoto.",
    body: "Paket nasi box mulai 20 ribuan per box, minimal 10 box. Tanya menu dan harganya langsung ke admin catering.",
    cta: "Tanya catering via WhatsApp",
    whatsapp: "0882-1304-4259",
    message: "Halo Admin Catering Aminoto, saya mau tanya paket catering untuk acara.",
  },

  menu: {
    title: "Menu & Harga",
    lead: "Harga sudah termasuk sambal dadak. Nasi dihitung terpisah.",
    notes: ["Gurame, nila, ayam & bebek bisa dibakar, tambah Rp2.000.", "Ayam & bebek per porsi.", "Harga dapat berubah sewaktu-waktu."],
  },

  story: {
    title: "Sambal dadak, dari cobek langsung ke piringmu.",
    paragraphs: [
      "Pecel Lele Sambel Dadak Aminoto berangkat dari satu hal sederhana: sambal paling enak itu sambal yang baru diulek. Karena itu sambal kami dibuat dadakan, diulek di cobek saat pesananmu masuk.",
      "Lelenya digoreng sampai garing, ayam dan bebeknya dijual per porsi, dan gurame, nila, ayam, juga bebek bisa dibakar di atas bara kalau kamu lebih suka aroma panggang. Sambalnya sudah termasuk di harga menu, tinggal pilih lauk dan nasinya.",
      "Sekarang Aminoto ada di tiga tempat di Cirebon: Cipto, Sumber, dan Ciledug. Buka setiap hari dari pukul 10.00 sampai 22.00, buat makan siang, makan malam, atau ramai-ramai bareng keluarga dan teman.",
    ],
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
