# Tasklist: Implementasi Halaman & Fitur CMS

Tasklist ini mendetailkan kebutuhan UI/UX untuk setiap modul utama di dalam Dashboard CMS Maenews.

## 1. 📊 Modul Dashboard (Overview)
- [ ] **Create:** Widget Statistik Ringkasan (Cards).
  - [ ] Menampilkan total artikel (Published & Draft).
  - [ ] Menampilkan total event aktif dan yang akan datang.
  - [ ] Menampilkan jumlah total aset di galeri.
- [ ] **Design:** Grafik Analitik Pengunjung.
  - [ ] **Implement:** Grafik garis atau batang menggunakan library seperti `recharts` atau `chart.js` untuk tren kunjungan 7 hari terakhir.
- [ ] **Create:** Tabel Aktivitas Terbaru.
  - [ ] Menampilkan daftar 5-10 artikel terakhir yang diubah atau ditambahkan.
- [ ] **Polish:** Responsivitas dashboard agar nyaman diakses via tablet/mobile.

## 2. 📰 Modul Manajemen Artikel
- [ ] **Create:** Halaman Daftar Artikel (List View).
  - [ ] **Implement:** Toolbar Pencarian dan Filter (berdasarkan Kategori, Status: Draft/Published, dan Penulis).
  - [ ] **Implement:** Kolom Tabel: Thumbnail (kecil), Judul, Kategori, Status Badge, Tanggal Dibuat, dan Aksi (Edit/Delete).
- [ ] **Create:** Halaman Editor Artikel (Create/Edit).
  - [ ] **Implement:** Integrasi Rich Text Editor (TipTap atau React-Quill) untuk isi konten.
  - [ ] **Design:** Sidebar Editor untuk pengaturan:
    - [ ] Pemilihan Kategori dan Multi-select Tags.
    - [ ] Uploader Featured Image dengan *preview*.
    - [ ] Switcher Status (Draft/Published).
    - [ ] Input SEO: Meta Title, Meta Description, dan Custom Slug.
- [ ] **Fix:** Validasi form (Judul wajib isi, slug unik, kategori terpilih) menggunakan library seperti `react-hook-form` dan `zod`.

## 3. 📅 Modul Manajemen Event
- [ ] **Create:** Halaman Daftar Event.
  - [ ] **Implement:** Indikator status event: *Upcoming*, *Ongoing*, *Passed*.
- [ ] **Create:** Form Editor Event.
  - [ ] **Implement:** Input khusus Tanggal & Waktu (Start Date - End Date) menggunakan date-picker.
  - [ ] **Implement:** Input Lokasi: Toggle antara *Online* (URL link) atau *Offline* (Alamat fisik).
  - [ ] **Implement:** Uploader Banner Event (Rasio aspek khusus).
- [ ] **Polish:** Fitur pencarian event berdasarkan nama atau penyelenggara.

## 4. 🖼️ Modul Galeri Media
- [ ] **Create:** Tampilan Media Library (Grid View).
  - [ ] **Implement:** Fitur "Click to Preview" untuk melihat gambar ukuran penuh.
- [ ] **Create:** Fitur Upload Media.
  - [ ] **Implement:** Drag-and-Drop zone untuk upload banyak file sekaligus (*bulk upload*).
  - [ ] **Implement:** Progress bar per file saat proses upload berlangsung.
- [ ] **Create:** Modal Detail/Edit Media.
  - [ ] **Implement:** Field edit untuk *Alt Text*, *Title*, dan *Caption* gambar guna optimasi SEO.
- [ ] **Fix:** Fitur hapus permanen dengan modal konfirmasi keamanan.

## 5. ⚙️ Modul Pengaturan & Pengguna
- [ ] **Create:** Manajemen Profil Penulis (*Author Profile*).
  - [ ] **Implement:** Upload foto avatar, Bio singkat, dan link sosial media.
- [ ] **Design:** Pengaturan Umum Situs.
  - [ ] **Create:** Form ubah Logo, Favicon, dan Nama Situs.
- [ ] **Implement:** Fitur "Pin to Trending" untuk menentukan artikel mana yang muncul di slider utama homepage publik.
