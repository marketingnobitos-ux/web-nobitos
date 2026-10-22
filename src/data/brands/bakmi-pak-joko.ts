// Konten halaman Bakmi Jowo Anglo Pak Joko (template ANGLO), ditulis di kode.
// Sumber: BRIEF-Bakmi-Pak-Joko.md Bagian 4. Brand, warna & menu ada di database (prisma/bakmi-pak-joko.ts).
// Web ini etalase, bukan untuk pesan: tidak ada keranjang, tombol order, atau link GrabFood/GoFood.
// GrabFood/GoFood tidak disebut sama sekali: untuk sementara pembeli datang langsung (keputusan Fran 22 Okt 2026).
import { DAY, weeklyHours, type DayHours } from "@/lib/hours";

export type AngloBranch = {
  slug: string;
  name: string;
  address: string;
  /** Kosong = jam belum dikonfirmasi, baris jam tidak ditampilkan. */
  hours?: string;
  /** Jam terstruktur per hari (JSON-LD). Kosong = belum dikonfirmasi, tidak dirender. */
  openingHours?: DayHours[];
  /** Titik koordinat (JSON-LD `geo`). Kosong = tidak dirender. */
  lat?: number;
  lng?: number;
  /** Tampilan nomor; link wa.me dibentuk dari nomor ini. */
  whatsapp: string;
  mapsUrl: string;
  /** Tampilkan notice Dapur Bu Joko di kartu cabang ini. */
  showBuJoko?: boolean;
};

export const BAKMI_PAK_JOKO = {
  instagram: { handle: "@bakmi.pakjoko", url: "https://www.instagram.com/bakmi.pakjoko" },
  hashtag: "#bakmijowomasjoko",

  // 4.1 Hero (Beranda)
  hero: {
    label: "Rasa Asli Temanggung, Hadir di Kota Udang",
    /** Kata di antara *bintang* tampil miring (berlaku di semua teks). */
    title: "Bakmi Jowo, dimasak di atas bara.",
    subtitle:
      "Satu wajan, satu porsi, di atas anglo arang. Aroma *smoky*-nya sudah tercium sebelum bakmi sampai di meja.",
    ctaMenu: "Lihat Menu",
    ctaLocation: "Cari Lokasi",
    // Dikonfirmasi Fran 29 Sep 2026: kedua cabang 16.00–23.00; libur beda per cabang.
    hours: "Buka 16.00 – 23.00 · Libur: Rabu (Kartini), Senin (Ciperna)",
    /** Label stiker di kolase hero (brief 6.2). */
    stickers: ["Dimasak di atas anglo", "Buka 16.00–23.00"],
  },

  /** Teks antarmuka template Anglo (brief 6.2 & 6.3). */
  ui: {
    swipeHint: "<< Geser untuk lihat lainnya >>",
    featuredSticker: "Menu andalan",
    directions: "Petunjuk arah",
    whatsapp: "WhatsApp",
  },

  // 4.2 Section "Kenapa Anglo"
  whyAnglo: {
    title: "Pelan, karena pakai arang.",
    cards: [
      {
        title: "Tungku anglo",
        body: "Kami masih masak pakai anglo dan arang membara, bukan kompor gas. Lebih lama, tapi rasanya beda.",
      },
      {
        title: "Satu per satu",
        body: "Setiap porsi dimasak sendiri di wajan, jadi bumbunya meresap ke tiap helai mie.",
      },
      {
        title: "Medok khas Jawa",
        body: "Bumbu gurih ala Temanggung, kuah nyemek yang kental, dan sayur yang nggak pelit.",
      },
    ],
  },

  // 4.3 Menu Andalan (item & deskripsi dari database, isFeatured)
  featured: {
    title: "Pertama kali ke sini? Mulai dari dua ini.",
  },

  // 4.4 Halaman Cerita
  story: {
    title: "Rasa Temanggung di tengah Kota Udang.",
    paragraphs: [
      // Asal-usul dikonfirmasi Fran 22 Okt 2026: Pak Joko asli Temanggung, jualan sejak 2026. Alasan ke Cirebon = narasi yang diminta Fran.
      "Pak Joko asli Temanggung, Jawa Tengah. Di sana, bakmi jowo dimasak satu per satu di atas anglo arang, dan cara itulah yang ia bawa ke Cirebon. Resepnya sederhana dan caranya tetap tradisional: wajan, arang, dan anglo.",
      "Sejak 2026 warungnya buka di Kota Udang, karena Pak Joko ingin orang Cirebon bisa merasakan bakmi jowo seperti di kampung halamannya, tanpa harus jauh-jauh ke Temanggung.",
      "Karena dimasak di atas bara, setiap porsi butuh waktu. Tapi dari situ datang aroma *smoky* yang nggak bisa ditiru kompor biasa, bercampur bumbu medok yang bikin nagih.",
      "Tempatnya dibuat buat santai. Datang sore bareng teman, makan malam sama keluarga, atau mampir sendiri habis kerja. Yang datang dari anak muda sampai orang tua.",
    ],
  },

  // 4.5 Halaman Cabang (WA & Maps dari lynk.id)
  // lat/lng (`geo` JSON-LD) = titik pin dari link Google Maps resmi tiap cabang (dicek 22 Okt 2026).
  branches: [
    {
      slug: "kartini",
      name: "Kartini",
      address: "Jl. Kartini, belakang Masjid At-Taqwa, Kebonbaru, Kejaksan, Kota Cirebon",
      hours: "16.00 – 23.00, Rabu libur",
      openingHours: weeklyHours("16:00", "23:00", [DAY.RABU]),
      lat: -6.7096251,
      lng: 108.558381,
      whatsapp: "0851-9602-8889",
      mapsUrl: "https://maps.app.goo.gl/GGHteoTdiRDwydY57",
      showBuJoko: true,
    },
    {
      slug: "ciperna",
      name: "Ciperna",
      // Alamat dari video TikTok @rute.kuliner, dikonfirmasi benar oleh Fran 22 Okt 2026.
      address:
        "Komplek Ruko Taman Kota Ciperna, Jl. Jenderal Sudirman No.2 Blok A (samping Alfamart Taman Kota), Ciperna, Kec. Talun",
      hours: "16.00 – 23.00, Senin libur",
      openingHours: weeklyHours("16:00", "23:00", [DAY.SENIN]),
      lat: -6.761148,
      lng: 108.5318623,
      whatsapp: "0813-2472-6222",
      mapsUrl: "https://maps.app.goo.gl/rMm8BdsMNKPqSgUY9",
    },
  ] satisfies AngloBranch[],

  // 4.6 Notice Dapur Bu Joko (Beranda & kartu Cabang Kartini)
  buJoko: {
    // Dikonfirmasi Fran 22 Okt 2026: nama brand Sayur Lodeh Bu Joko, satu lokasi dengan Kartini, mulai 7 ribuan, buka 06.00–12.00.
    title: "Pagi di tempat yang sama: Sayur Lodeh Bu Joko.",
    body: "Sebelum bakmi buka sore, pagi harinya ada sarapan rumahan: nasi sayur lodeh, sayur asem, sayur sabrang, dan lauk pilihan. Mulai 7 ribuan, buka 06.00–12.00. Websitenya menyusul.",
    cta: "Instagram @sayurlodeh.bujoko",
    url: "https://www.instagram.com/sayurlodeh.bujoko",
  },
};
