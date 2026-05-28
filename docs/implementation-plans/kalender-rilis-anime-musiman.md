# Spesifikasi Teknis: Kalender Rilis Anime Musiman (Seasonal Anime Release Calendar)

## Pendahuluan
Fitur "Kalender Rilis Anime Musiman" dirancang untuk memberikan informasi jadwal tayang mingguan bagi anime yang sedang tayang (ongoing) pada musim tertentu (misalnya, Winter, Spring, Summer, Fall). Pengguna dapat melihat daftar anime yang rilis setiap harinya secara terstruktur, dilengkapi dengan countdown untuk perilisan episode terbaru, platform streaming legal tempat anime tersebut tayang, dan fitur untuk mengatur pengingat (reminder) lokal atau melalui integrasi kalender pribadi pengguna (Google Calendar/ICS). Fitur ini menjawab kebutuhan komunitas pecinta anime untuk melacak tontonan mingguan mereka tanpa perlu membuka banyak sumber terpisah.

## Arsitektur
Fitur ini akan dibangun di atas stack teknologi yang sudah ada, memanfaatkan pola strategi API (Mock/Live) yang diterapkan pada Maenews:

1.  **Frontend (Next.js 14 & React 19):**
    *   **Komponen UI (`app/components/pages/SeasonalCalendar/`):**
        *   `WeeklyGrid.tsx`: Menampilkan grid jadwal selama 7 hari dalam seminggu, memungkinkan navigasi antar hari.
        *   `AnimeScheduleCard.tsx`: Komponen kartu untuk setiap entri anime, menampilkan poster, judul, jam rilis, badge musim, platform streaming legal, dan tombol "Set Reminder".
        *   `SeasonSelector.tsx`: Dropdown atau tab untuk berpindah antar musim yang tersedia.
    *   **State Management & Caching:** Menggunakan TanStack Query (`query/apiSchedules.ts`) untuk melakukan fetch data jadwal rilis dari backend, dengan caching agar navigasi antar hari tidak memerlukan re-fetch secara berlebihan.
    *   **Penyimpanan Lokal:** Memanfaatkan LocalStorage untuk menyimpan preferensi pengguna (seperti zona waktu lokal) dan preferensi anime yang sedang diikuti (watchlist offline).

2.  **API Layer (`lib/api.ts` & Mock Data):**
    *   Menambahkan endpoint `GET /schedules?season={season}&year={year}` pada API contract (`openapi.yaml`).
    *   Menambahkan data mock di `app/data/mocks-data/mockSchedules.ts` untuk keperluan pengembangan dengan `NEXT_PUBLIC_API_MODE=mock`.

3.  **Tipe Data (`app/typing/Schedule.ts`):**
    *   Mendefinisikan interface baru seperti `ScheduleItem`, `BroadcastTime`, dan `StreamingPlatform`.

## Langkah Implementasi
1.  **Definisi Struktur Data:**
    *   Buat file tipe data baru `app/typing/Schedule.ts` yang mendefinisikan interface dari objek jadwal tayang.
    *   Perbarui `docs/openapi.yaml` dengan endpoint `/schedules` yang mengembalikan struktur data jadwal per hari dalam seminggu.

2.  **Pembuatan Data Mock:**
    *   Buat file `app/data/mocks-data/mockSchedules.ts` yang berisi sekumpulan jadwal dummy untuk pengujian awal.
    *   Integrasikan fungsi pemanggilan data mock di `lib/api.ts` saat `NEXT_PUBLIC_API_MODE=mock`.

3.  **Pembuatan Komponen UI:**
    *   Buat direktori baru `app/components/pages/SeasonalCalendar/`.
    *   Implementasikan `AnimeScheduleCard.tsx` menggunakan komponen UI primitif dari Radix UI yang sudah ada (misalnya menggunakan elemen card sederhana atau membangun dari Tailwind) untuk menampilkan informasi esensial.
    *   Implementasikan `WeeklyGrid.tsx` untuk mengatur layout responsif (1 kolom di mobile, 3-7 kolom di desktop).

4.  **Integrasi TanStack Query:**
    *   Buat custom hook `useSchedules.ts` di `app/hooks/` yang menggunakan TanStack Query untuk me-manage fetch state.

5.  **Pembuatan Halaman Utama Fitur:**
    *   Buat halaman baru di `app/(main)/schedules/page.tsx`.
    *   Rakit komponen `SeasonSelector`, `WeeklyGrid`, dan `AnimeScheduleCard` di dalam halaman ini.

6.  **Fungsi Countdown dan Timezone:**
    *   Buat fungsi utilitas di `utils/dateUtils.ts` untuk mengonversi waktu rilis backend (biasanya JST atau UTC) ke zona waktu lokal pengguna browser.
    *   Terapkan countdown real-time di `AnimeScheduleCard.tsx`.

## Risiko
*   **Perbedaan Zona Waktu:** Kesalahan dalam konversi JST (Japan Standard Time) atau UTC ke zona waktu pengguna lokal dapat menyebabkan pengguna kehilangan episode baru. Ini dapat dimitigasi dengan pengujian ketat menggunakan modul tanggal seperti `date-fns-tz` atau browser native `Intl.DateTimeFormat`.
*   **Kinerja pada Mobile:** Menampilkan gambar poster dari puluhan anime dalam satu halaman (misalnya hari Minggu dengan jadwal rilis padat) bisa memberatkan kinerja memori pada perangkat low-end. Perlu mengimplementasikan Next.js `Image` component secara hati-hati (menggunakan lazy loading dan optimalisasi ukuran) agar scroll tetap mulus.
*   **Akurasi Data Live API:** Saat integrasi dengan backend Live, keterlambatan jadwal tayang di platform pihak ketiga atau perubahan mendadak sering terjadi. Frontend perlu disiapkan untuk menampilkan status "Ditunda" (Delayed) jika dikirimkan oleh backend.
