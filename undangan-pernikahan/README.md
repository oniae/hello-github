# Undangan Pernikahan Digital — Modern Editorial

Website undangan pernikahan statis (`HTML / CSS / JS`) bergaya **Modern Editorial** (tipografi serif & sans kontras tinggi, palet monokrom hangat, garis editorial tipis, dan layout majalah).

## Struktur File
- `index.html` — Struktur lengkap halaman undangan
- `styles.css` — Desain Modern Editorial & layout responsif
- `app.js` — Fitur interaktif (Cover, Countdown, Kalender `.ics` & Google Calendar, Galeri Lightbox, Amplop Digital, RSVP & Buku Tamu)
- `config.js` — **Pusat pengaturan data** (nama mempelai, tanggal, lokasi, rekening, QRIS, galeri foto, dan kisah)
- `assets/` — Folder foto pre-wedding dan gambar QRIS

## Cara Kustomisasi Cepat
1. Buka file `config.js` dan ubah data mempelai, orang tua, tanggal (`targetDateISO`), lokasi venue, tautan Google Maps, nomor rekening, dan teks ucapan.
2. Ganti file gambar di folder `assets/` dengan foto pre-wedding serta gambar QRIS asli Anda, lalu sesuaikan nama filenya di `config.js`.
3. Untuk mengundang tamu secara personal, tambahkan parameter `?to=Nama+Tamu` pada URL, contoh:
   `https://domain-anda.com/?to=Budi+Santoso`

## Cara Membuka / Menjalankan
- Anda dapat membuka `index.html` langsung di browser, atau menjalankannya dengan server lokal sederhana:
  ```bash
  npx serve .
  ```
  atau
  ```bash
  python -m http.server 8080
  ```
