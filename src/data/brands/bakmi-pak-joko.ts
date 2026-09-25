// Konten halaman Bakmi Jowo Anglo Pak Joko (template ANGLO), ditulis di kode.
// Sumber: BRIEF-Bakmi-Pak-Joko.md Bagian 4. Brand, warna & menu ada di database (prisma/bakmi-pak-joko.ts).
// Web ini etalase, bukan untuk pesan: tidak ada keranjang, tombol order, atau link GrabFood/GoFood.
// TODO: konfirmasi Fran — info GrabFood/GoFood ditampilkan sebagai teks ("Tersedia di GrabFood & GoFood") atau tidak sama sekali.

export type AngloBranch = {
  slug: string;
  name: string;
  address: string;
  /** Kosong = jam belum dikonfirmasi, baris jam tidak ditampilkan. */
  hours?: string;
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
    // TODO: konfirmasi Fran — jam dari caption IG 2 Sep 2026 (catatan lama 17.00–24.00), dan apakah berlaku untuk kedua cabang.
    hours: "Buka 16.00 – 23.00 · Rabu libur",
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
      "Bakmi Jowo Anglo Pak Joko membawa cara masak bakmi khas Temanggung ke Cirebon. Resepnya sederhana dan caranya tetap tradisional: wajan, arang, dan anglo.",
      "Karena dimasak di atas bara, setiap porsi butuh waktu. Tapi dari situ datang aroma *smoky* yang nggak bisa ditiru kompor biasa, bercampur bumbu medok yang bikin nagih.",
      "Tempatnya dibuat buat santai. Datang sore bareng teman, makan malam sama keluarga, atau mampir sendiri habis kerja. Yang datang dari anak muda sampai orang tua.",
      // TODO: konfirmasi Fran — cerita asal-usul (sejak kapan, siapa Pak Joko, kenapa dari Temanggung ke Cirebon). Sengaja tidak dikarang.
    ],
  },

  // 4.5 Halaman Cabang (WA & Maps dari lynk.id)
  branches: [
    {
      slug: "kartini",
      name: "Kartini",
      address: "Jl. Kartini, belakang Masjid At-Taqwa, Kebonbaru, Kejaksan, Kota Cirebon",
      hours: "16.00 – 23.00, Rabu libur",
      whatsapp: "0851-9602-8889",
      mapsUrl: "https://maps.app.goo.gl/GGHteoTdiRDwydY57",
      showBuJoko: true,
    },
    {
      slug: "ciperna",
      name: "Ciperna",
      // TODO: konfirmasi Fran — alamat dari video TikTok @rute.kuliner, bukan akun resmi.
      address:
        "Komplek Ruko Taman Kota Ciperna, Jl. Jenderal Sudirman No.2 Blok A (samping Alfamart Taman Kota), Ciperna, Kec. Talun",
      // TODO: konfirmasi Fran — jam buka Ciperna [CEK], dan apakah Rabu libur juga berlaku di sini.
      hours: undefined,
      whatsapp: "0813-2472-6222",
      mapsUrl: "https://maps.app.goo.gl/rMm8BdsMNKPqSgUY9",
    },
  ] satisfies AngloBranch[],

  // 4.6 Notice Dapur Bu Joko (Beranda & kartu Cabang Kartini)
  buJoko: {
    title: "Pagi di tempat yang sama: Dapur Bu Joko.",
    // TODO: konfirmasi Fran — "Mulai 7 ribuan" dari thumbnail post, dan apakah benar satu lokasi dengan Bakmi Kartini (Jl. Kartini No.4).
    body: "Sebelum bakmi buka sore, pagi harinya ada sarapan rumahan: nasi sayur lodeh, sayur asem, sayur sabrang, dan lauk pilihan. Mulai 7 ribuan. Websitenya menyusul.",
    cta: "Instagram @sayurlodeh.bujoko",
    url: "https://www.instagram.com/sayurlodeh.bujoko",
  },
};
