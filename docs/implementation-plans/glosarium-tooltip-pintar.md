# Rencana Implementasi: Glosarium Istilah Kultur Pop Jepang & Tooltip Pintar

## Pendahuluan

Website Maenews (Animae.id) berfokus pada kultur pop Jepang yang sangat kaya akan istilah spesifik (seperti *Isekai*, *Tsundere*, *Sakuga*, *Seiyuu*, dll). Seringkali pembaca baru atau awam merasa kesulitan memahami istilah-istilah ini di dalam suatu artikel tanpa membuka tab baru untuk mencari artinya.

Fitur **Glosarium & Tooltip Pintar** ini dirancang untuk mengatasi masalah tersebut. Fitur ini terdiri dari dua bagian:
1. **Halaman Glosarium Utama:** Halaman direktori A-Z interaktif yang memuat kumpulan istilah-istilah kultur pop Jepang beserta maknanya, contoh, serta artikel terkait.
2. **Tooltip Pintar pada Artikel:** Komponen otomatis yang memindai teks artikel dan memberikan *highlight* (misal berupa *underline* putus-putus) pada istilah yang ada di glosarium. Ketika pengguna melakukan *hover* (atau *tap* pada perangkat mobile), sebuah *tooltip* kecil akan muncul menjelaskan makna dari istilah tersebut tanpa mengganggu alur membaca.

Tujuan utama fitur ini adalah meningkatkan keterlibatan pengguna (engagement) dan memperkaya pengalaman pengguna (UX) dengan menyediakan konteks langsung.

## Arsitektur

Fitur ini akan diimplementasikan sebagai bagian dari Next.js App Router dengan arsitektur berikut:

### 1. Struktur Data (Model)
- Penambahan `typing/Glossary.ts` untuk mendefinisikan *interface* term, definisi, serta relasi.
- **Mock Data:** Penambahan `app/data/mocks-data/mockGlossary.ts` untuk menyimpan koleksi *dictionary* sebagai bagian dari *Mock/Live Strategy* yang ada di Maenews.
- **API Services:** Endpoint `/glossary` (list) dan `/glossary/:term` (detail) di dalam `lib/api.ts` dan integrasi *TanStack Query* (`app/query/apiGlossary.ts`).

### 2. Komponen UI (React 19 + Tailwind CSS + Radix UI)
- **Tooltip Component:** Memanfaatkan `Tooltip` primitif dari Radix UI untuk komponen yang dapat di-*hover*.
- **Text Parser (Highlighter):** Sebuah utility/React Component (`GlossaryHighlightText`) yang memecah string atau *ReactNode* konten artikel, memindai kata-kata yang cocok dengan entri glosarium, dan membungkusnya ke dalam komponen Tooltip.
- **Halaman Glosarium:** `app/glossary/page.tsx` untuk menampilkan daftar *grid* kamus secara A-Z dengan fungsionalitas pencarian lokal.

### 3. Integrasi pada Artikel
- Di dalam komponen `ArticleDetailPage` (khususnya untuk render `content`), komponen teks bawaan akan dibungkus dengan `GlossaryHighlightText` untuk mengeksekusi *parsing*.

## Langkah Implementasi

1. **Persiapan Data dan API:**
   - Buat `app/typing/Glossary.ts`:
     ```typescript
     export interface GlossaryTerm {
       id: string;
       term: string;
       definition: string;
       aliases?: string[];
       examples?: string[];
     }
     ```
   - Buat file `app/data/mocks-data/mockGlossary.ts` dan isi dengan minimal 20 istilah umum (misal: *Shounen*, *Shoujo*, *Seinen*, *Josei*, *Isekai*, *Slice of Life*, *Mecha*, *Tsundere*, *Yandere*, *Kuudere*, *Sakuga*, *Seiyuu*, *Mangaka*, *Otaku*, *Weaboo*, *Hikikomori*, *Waifu*, *Husbando*, *Moe*, *Chibi*).
   - Tambahkan *fetcher logic* di `app/lib/api.ts` dan `app/query/apiGlossary.ts`.

2. **Pengembangan UI Halaman Glosarium:**
   - Buat rute baru: `app/(main)/glossary/page.tsx`.
   - Bangun UI menggunakan Tailwind CSS yang merender daftar istilah berdasarkan abjad.
   - Tambahkan *search bar* lokal menggunakan *state* untuk menyaring istilah secara instan di sisi klien.

3. **Pembuatan Komponen Tooltip Pintar:**
   - Gunakan pustaka Radix UI (`@radix-ui/react-tooltip`) yang sudah ada dalam *tech stack*.
   - Buat file `app/components/ui/GlossaryTooltip.tsx`. Komponen ini akan menerima `term` dan `definition` sebagai props.
   - Gunakan gaya visual (warna *sakura pink* / *electric indigo*) sesuai tema J-Pop pada *trigger* (teks *highlight*) dan latar belakang *tooltip* menggunakan *Tailwind classes*.

4. **Pembuatan Utility Parser & Integrasi:**
   - Buat komponen wrapper `app/components/article/GlossaryParser.tsx`.
   - Logika: Komponen menerima *raw text string* dari artikel, mencari kemunculan kata berdasarkan data glosarium, lalu me-return array React Element yang mencampur *string* biasa dan `GlossaryTooltip` untuk kata yang cocok.
   - Perbarui file `app/(main)/article/[slug]/page.tsx` atau komponen render konten terkait agar membungkus konten di dalam `GlossaryParser`.

5. **Pengujian & Styling:**
   - Uji respon *tooltip* pada perangkat mobile (apakah *tap* berfungsi baik alih-alih *hover*).
   - Uji dampak performa pada artikel yang sangat panjang dengan banyak istilah.

## Risiko

1. **Performa Parsing (Overhead):** Memindai artikel teks yang sangat panjang untuk mencocokkan *array* istilah bisa memakan waktu *CPU (blocking main thread)* di sisi klien.
   - *Mitigasi:* Parsing dapat dilakukan saat *build-time* atau *Server-Side Rendering (SSR)*. Kita juga dapat mengoptimalkan fungsi pencarian teks dengan membatasi *highlight* hanya pada kemunculan pertama setiap istilah dalam satu artikel (tidak perlu semua kata di-highlight).
2. **False Positives:** Istilah umum atau kependekan bisa tumpang tindih dengan kata sehari-hari dalam bahasa Indonesia.
   - *Mitigasi:* Gunakan ekspresi reguler yang mencocokkan *whole-word boundary* (contoh: `\bistilah\b`) agar bagian dari kata lain tidak tidak sengaja ter-*highlight*. Mendukung sensitivitas kapital/kecil yang cerdas juga disarankan.
3. **Pengalaman Mobile (Touch):** *Hover* *tooltip* adalah konsep yang spesifik desktop. Di perangkat sentuh, *tooltip* memerlukan aksi klik/tap, namun klik juga biasanya digunakan untuk navigasi *link*.
   - *Mitigasi:* Radix UI secara *default* sudah menangani perilaku aksesibilitas *touch*, namun harus dipastikan tidak ada konflik jika istilah yang di-*highlight* secara kebetulan berada di dalam sebuah *anchor tag*.
