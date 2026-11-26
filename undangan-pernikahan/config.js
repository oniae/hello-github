/**
 * KONFIGURASI UNDANGAN PERNIKAHAN
 * Edit file ini untuk menyesuaikan nama mempelai, tanggal, lokasi, rekening, dan foto.
 */
window.WEDDING_CONFIG = {
  brand: {
    issueNumber: "EDISI 01 — 2026",
    monogram: "A & N",
    footerNote: "Dengan penuh rasa syukur kami menantikan kehadiran Anda."
  },

  // Pengaturan nama tamu default jika URL tidak memiliki parameter ?to=Nama+Tamu
  guest: {
    defaultName: "Tamu Undangan"
  },

  // Data Mempelai
  couple: {
    title: "The Wedding of",
    shortNames: "Arka & Nadia",
    bride: {
      fullName: "Nadia Larasati, S.Ars.",
      nickName: "Nadia",
      childOrder: "Putri kedua dari",
      parents: "Bapak Hendra Wijaya & Ibu Ratna Dewi",
      city: "Jakarta Selatan",
      instagram: "@nadialarasati",
      photo: "assets/bride-portrait.svg"
    },
    groom: {
      fullName: "Arka Pratama Putra, S.T.",
      nickName: "Arka",
      childOrder: "Putra pertama dari",
      parents: "Bapak Bambang Santoso & Ibu Sri Mulyani",
      city: "Bandung",
      instagram: "@arkapratama",
      photo: "assets/groom-portrait.svg"
    }
  },

  // Kutipan Editorial
  quote: {
    text: "“Cinta bukan tentang menemukan seseorang yang sempurna, melainkan belajar melihat orang yang tidak sempurna dengan cara yang sempurna.”",
    source: "— Sam Keen"
  },

  // Jadwal & Lokasi Acara
  event: {
    // Format ISO untuk countdown akurat (WIB = +07:00)
    targetDateISO: "2026-12-20T09:00:00+07:00",
    displayDate: "Minggu, 20 Desember 2026",
    city: "Jakarta Selatan",
    akad: {
      title: "Akad Nikah",
      date: "Minggu, 20 Desember 2026",
      time: "09.00 — 10.30 WIB",
      venue: "Glasshouse Kemang",
      address: "Jl. Kemang Raya No. 48, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=Kemang+Jakarta+Selatan"
    },
    resepsi: {
      title: "Resepsi Pernikahan",
      date: "Minggu, 20 Desember 2026",
      time: "11.30 — 14.30 WIB",
      venue: "Glasshouse Kemang — Main Hall",
      address: "Jl. Kemang Raya No. 48, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=Kemang+Jakarta+Selatan"
    },
    calendar: {
      title: "Pernikahan Arka & Nadia",
      description: "Akad Nikah & Resepsi Pernikahan Arka Pratama & Nadia Larasati.",
      location: "Glasshouse Kemang, Jl. Kemang Raya No. 48, Jakarta Selatan",
      startUTC: "20261220T020000Z", // 09:00 WIB
      endUTC: "20261220T073000Z"    // 14:30 WIB
    }
  },

  // Kisah Singkat (Editorial Timeline)
  story: [
    {
      year: "2021",
      chapter: "Pertemuan Pertama",
      description: "Berawal dari proyek kolaborasi arsitektur dan rekayasa di Jakarta, percakapan sederhana soal kopi dan ruang publik menjadi awal segalanya."
    },
    {
      year: "2024",
      chapter: "Langkah Serius",
      description: "Setelah melewati berbagai musim bersama, kami sepakat untuk menyatukan visi dan melangkah menuju ikatan yang lebih bermakna."
    },
    {
      year: "2026",
      chapter: "Hari Bahagia",
      description: "Dengan restu kedua keluarga besar, kami siap memulai babak baru sebagai sepasang suami istri."
    }
  ],

  // Galeri Foto Editorial
  gallery: [
    {
      src: "assets/hero-couple.svg",
      caption: "01 / MONOCHROME PROMISE",
      location: "Jakarta, 2026",
      span: "tall"
    },
    {
      src: "assets/gallery-walk.svg",
      caption: "02 / QUIET AFTERNOON",
      location: "Kota Tua",
      span: "wide"
    },
    {
      src: "assets/gallery-hands.svg",
      caption: "03 / TIMELESS DETAIL",
      location: "Studio",
      span: "square"
    },
    {
      src: "assets/bride-portrait.svg",
      caption: "04 / GRACE IN SIMPLICITY",
      location: "Jakarta",
      span: "square"
    },
    {
      src: "assets/groom-portrait.svg",
      caption: "05 / TAILORED SILENCE",
      location: "Bandung",
      span: "square"
    }
  ],

  // Amplop Digital & Kado Fisik
  gifts: {
    intro: "Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun apabila memberi adalah ungkapan tanda kasih, Anda dapat mengirimkannya melalui kanal berikut:",
    banks: [
      {
        bankName: "Bank Central Asia (BCA)",
        bankCode: "BCA",
        accountNumber: "5480192837",
        accountHolder: "Nadia Larasati"
      },
      {
        bankName: "Bank Mandiri",
        bankCode: "MANDIRI",
        accountNumber: "1300028491023",
        accountHolder: "Arka Pratama Putra"
      }
    ],
    qris: {
      label: "QRIS — Arka & Nadia Wedding",
      merchantName: "ARKA & NADIA WEDDING",
      nmid: "ID1026000482910",
      image: "assets/qris-sample.svg"
    },
    physicalGift: {
      recipient: "Arka & Nadia",
      phone: "+62 812-3456-7890",
      address: "Jl. Cipete Raya No. 18B, Cilandak, Jakarta Selatan 12410"
    }
  },

  // Ucapan awal (sebelum tamu menambahkan ucapan baru)
  initialWishes: [
    {
      name: "Rizky & Farah",
      attendance: "Hadir",
      message: "Selamat menempuh hidup baru Arka dan Nadia! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
      createdAt: "2 jam lalu"
    },
    {
      name: "Dimas Mahendra",
      attendance: "Hadir",
      message: "Akhirnya! Lancar sampai hari-H ya bro Arka & Nadia. Sampai ketemu di Kemang!",
      createdAt: "5 jam lalu"
    },
    {
      name: "Siti Rahmawati",
      attendance: "Berhalangan",
      message: "Mohon maaf belum bisa hadir langsung karena sedang bertugas di luar kota. Doa terbaik selalu untuk kalian berdua.",
      createdAt: "1 hari lalu"
    }
  ]
};
