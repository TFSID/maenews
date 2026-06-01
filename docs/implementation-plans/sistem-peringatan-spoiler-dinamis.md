# Rencana Implementasi: Sistem Peringatan Spoiler Dinamis

## Pendahuluan
Mengingat Maenews adalah portal berita yang berfokus pada Anime, Manga, dan budaya pop Jepang, banyak artikel yang memuat ulasan, analisis episode, atau bocoran cerita (spoiler). Saat ini belum ada fitur bawaan yang memungkinkan konten spoiler disembunyikan secara selektif.
Fitur **Sistem Peringatan Spoiler Dinamis** bertujuan untuk melindungi pengalaman membaca pembaca dari bocoran cerita yang tidak diinginkan dengan cara menyembunyikan paragraf, gambar, atau blok teks tertentu yang ditandai oleh penulis, namun dapat diungkapkan kembali (reveal) oleh pembaca dengan satu kali klik.

## Arsitektur
Fitur ini berfokus pada integrasi di sisi klien (UI/UX) dan pengembangan spesifikasi data:
1. **Model Data (`Article.ts`)**: Akan ditambahkan field pendukung opsional seperti `hasSpoiler` (boolean) pada tipe data artikel. Untuk penandaan pada level konten/markdown, komponen renderer akan disesuaikan agar membaca tag khusus seperti `[spoiler]...[/spoiler]`.
2. **Komponen UI (`SpoilerGuard.tsx`)**: Pembuatan komponen atomik baru di dalam `app/components/ui/` berbasis Radix UI (atau Framer Motion untuk transisi halus) yang akan membungkus konten sensitif dengan overlay pelindung ("Klik untuk melihat spoiler").
3. **Renderer Artikel**: Meng-update renderer artikel yang saat ini ada di komponen `ArticleDetail` (atau komponen sejenisnya) agar mengenali blok spoiler dan merendernya menggunakan `SpoilerGuard.tsx`.

## Langkah Implementasi
1. **Pembaruan Tipe Data**:
   - Modifikasi `app/typing/Article.ts` untuk menambahkan parameter opsional `hasSpoiler?: boolean`.
2. **Pembuatan Komponen `SpoilerGuard.tsx`**:
   - Buat komponen di `app/components/ui/SpoilerGuard.tsx`.
   - Gunakan `useState` untuk melacak apakah konten spoiler sudah dibuka atau belum oleh pembaca.
   - Implementasikan *blur effect* atau *overlay* menggunakan Tailwind CSS v4 (misal: `backdrop-blur-md`, animasi dengan `framer-motion`).
3. **Integrasi ke Halaman Artikel**:
   - Pada komponen yang bertanggung jawab untuk me-render `content` dari `Article` (misalnya di `app/components/article/`), tambahkan logika untuk mem-parsing tag kustom (misalnya `[spoiler]`) yang membungkus konten dan menggantinya dengan `SpoilerGuard`.
4. **Mock Data**:
   - Update beberapa artikel di `app/data/mocks-data/mockArticles.ts` untuk mendemonstrasikan teks dengan tag spoiler.
5. **Pengujian Visual**:
   - Verifikasi responsivitas komponen di perangkat *mobile* dan *desktop*.

## Risiko
- **Dampak pada SEO**: Teks yang disembunyikan oleh JavaScript mungkin diperlakukan berbeda oleh crawler pencarian. Namun, spoiler content secara umum bukan prioritas utama dalam SEO, prioritas lebih pada snippet dan meta tag.
- **Kinerja Render**: Parsing teks markdown/HTML yang besar untuk mencari tag spoiler dengan regex pada sisi klien (jika tidak dilakukan saat build atau sebelum render) dapat memperkenalkan jeda render kecil (latency).
