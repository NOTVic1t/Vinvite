// ============================================================================
// VINVITE ENGINE — SAMPLE DATA (preview mode)
// Shown whenever no ?slug= is in the URL, or the Supabase fetch fails.
// ============================================================================

window.VINVITE_SAMPLE_DATA = {
  guest_name: "Bapak/Ibu Tamu Undangan",

  groom_name: "Raditya Pradana",
  groom_nickname: "Radit",
  groom_parents: "Putra dari Bapak Sutrisno & Ibu Wulandari",
  bride_name: "Anindya Kirana",
  bride_nickname: "Nindy",
  bride_parents: "Putri dari Bapak Hartono & Ibu Suryani",

  cover_image_url:
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",

  groom_photo_url:
    "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=600&auto=format&fit=crop",
  bride_photo_url:
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=600&auto=format&fit=crop",

  events: [
    {
      name: "Akad Nikah",
      date: "2026-10-17",
      time_start: "08:00",
      time_end: "10:00",
      venue_name: "Kediaman Mempelai Wanita",
      venue_address: "Jl. Kenanga No. 12, Bandung, Jawa Barat",
      maps_url: "https://maps.google.com",
    },
    {
      name: "Resepsi",
      date: "2026-10-17",
      time_start: "11:00",
      time_end: "14:00",
      venue_name: "Gedung Graha Pertiwi",
      venue_address: "Jl. Asia Afrika No. 88, Bandung, Jawa Barat",
      maps_url: "https://maps.google.com",
    },
  ],

  hidden_sections: [],
  section_labels: {},
  quote_text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup agar kamu cenderung dan merasa tenteram kepadanya.",
  quote_source: "QS. Ar-Rum: 21",

  dress_code_label: "Formal Elegan",
  dress_code_colors: [
    { hex: "#C9A227", name: "Gold" },
    { hex: "#46594C", name: "Sage Green" },
    { hex: "#DCD0B8", name: "Sand" },
  ],
  hashtag: "#VictorDanNindy2026",
  instagram: "@vinvite.id",

  rundown: [
    { time: "08:00", title: "Persiapan & Kedatangan Tamu", desc: "Pengantin dan keluarga bersiap menyambut tamu.", icon: "flowers" },
    { time: "10:00", title: "Akad Nikah", desc: "Ijab kabul disaksikan keluarga dan kerabat.", icon: "rings" },
    { time: "11:00", title: "Resepsi", desc: "Sungkeman, sambutan, dan ramah tamah.", icon: "ceremony" },
    { time: "13:00", title: "Makan Bersama", desc: "Hidangan spesial dari kedua keluarga.", icon: "dinner" },
    { time: "14:00", title: "Foto Bersama & Penutup", desc: "Sesi foto dan perpisahan.", icon: "photo" },
  ],

  // Legacy fields kept for backward compat
  akad_date: "2026-10-17",
  akad_time: "08:00 – 10:00 WIB",
  akad_venue_name: "Kediaman Mempelai Wanita",
  akad_venue_address: "Jl. Kenanga No. 12, Bandung, Jawa Barat",
  akad_maps_url: "https://maps.google.com",
  resepsi_date: "2026-10-17",
  resepsi_time: "11:00 – 14:00 WIB",
  resepsi_venue_name: "Gedung Graha Pertiwi",
  resepsi_venue_address: "Jl. Asia Afrika No. 88, Bandung, Jawa Barat",
  resepsi_maps_url: "https://maps.google.com",

  love_story: [
    { date: "2019", title: "Pertama Bertemu", text: "Dipertemukan di sebuah acara kampus yang sama sekali tidak terduga." },
    { date: "2021", title: "Mulai Dekat", text: "Persahabatan perlahan tumbuh menjadi kasih sayang yang tulus." },
    { date: "2025", title: "Lamaran", text: "Radit melamar Nindy di tempat pertama kali mereka bertemu." },
  ],

  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=900&auto=format&fit=crop",
  ],

  gift_accounts: [
    { type: "Bank Transfer", bank_name: "BCA", account_number: "1234567890", account_holder: "Anindya Kirana" },
    { type: "E-Wallet", bank_name: "GoPay", account_number: "0812-3456-7890", account_holder: "Raditya Pradana" },
  ],
};
