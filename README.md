<a href="https://animae.id">
  <img width="100%" src="https://blsfkizrchqzahqa.public.blob.vercel-storage.com/Screenshot%202025-07-23%20153608.png" alt="Maenews Banner" />
</a>

<div align="center">

# Maenews — Portal Berita Anime & Kultur Pop Jepang

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)]()

**Sumber terpercaya untuk semua hal tentang anime, manga, light novel, dan kultur pop Jepang.**
Berita terkini · Ulasan mendalam · Jadwal event · Galeri media

</div>

---

## 📖 Tentang Project

**Maenews** (branded sebagai **Animae.id**) adalah portal berita berbasis web yang berfokus pada dunia **anime, manga, light novel, figur, cosplay, dan kultur pop Jepang**. Dibangun di atas stack modern dengan performa tinggi, arsitektur komponen yang bersih, dan SEO-first approach untuk menjangkau komunitas seluas-luasnya.

> Website ini dirancang sebagai proyek profesional dengan kualitas produksi, menggabungkan best practice Next.js App Router, TypeScript strict typing, dan design system yang konsisten.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **🗞️ Homepage Dinamis** | Hero bento grid, section "Terbaru", slider rekomendasi full-width, dan infinite scroll artikel |
| **📰 Detail Artikel** | Halaman artikel lengkap dengan konten, tags, view counter, dan artikel terkait |
| **🗂️ Halaman Kategori** | Filter artikel per kategori (Anime, Manga, Creator, dll.) dengan carousel horizontal |
| **🏷️ Halaman Tag** | Jelajahi artikel berdasarkan tag spesifik |
| **🔍 Pencarian** | Full-text search artikel berdasarkan judul, excerpt, dan tags |
| **🖼️ Galeri Media** | Pinterest-style masonry gallery dengan lightbox & filter kategori |
| **📅 Halaman Event** | Daftar event mendatang, ongoing, dan yang sudah berakhir |
| **⏱️ Event Countdown** | Banner countdown real-time untuk event mendatang |
| **📱 Fully Responsive** | Tampilan optimal di seluruh ukuran layar (mobile, tablet, desktop) |
| **🌐 SEO Optimized** | Open Graph, Twitter Card, sitemap, robots, structured metadata |

---

## 🧱 Tech Stack

### Core
| Teknologi | Versi | Kegunaan |
|---|---|---|
| [Next.js](https://nextjs.org/) | `^14.1.0` | Framework utama (App Router + SSR) |
| [React](https://react.dev/) | `19.1.0` | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | `^5` | Type safety |

### Styling & UI
| Teknologi | Versi | Kegunaan |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | `^4` | Utility-first styling |
| [Radix UI](https://www.radix-ui.com/) | `^1-2` | Accessible headless components |
| [Framer Motion](https://www.framer.com/motion/) | `^12` | Animasi & transisi |
| [Lucide React](https://lucide.dev/) | `^0.462` | Icon library |
| [Embla Carousel](https://www.embla-carousel.com/) | `^8.3` | Carousel / slider |
| [Recharts](https://recharts.org/) | `^2.12` | Grafik & visualisasi data |

### Data & State
| Teknologi | Versi | Kegunaan |
|---|---|---|
| [TanStack Query](https://tanstack.com/query) | `^5.56` | Server state management & caching |
| [Axios](https://axios-http.com/) | `^1.13` | HTTP client |
| [Zod](https://zod.dev/) | `^3.23` | Schema validation |
| [React Hook Form](https://react-hook-form.com/) | `^7.53` | Form management |

### Developer Experience
| Teknologi | Versi | Kegunaan |
|---|---|---|
| [ESLint](https://eslint.org/) | `^8.57` | Linting |
| [date-fns](https://date-fns.org/) | `^3.6` | Date formatting utility |
| [next-themes](https://github.com/pacocoursey/next-themes) | `^0.3` | Theme management |

---

## 📁 Struktur Proyek

```
maenews-nazca/
├── app/
│   ├── (main)/                  # Route group utama
│   │   ├── layout.tsx           # Root layout + SEO metadata global
│   │   ├── globals.css          # Global styles
│   │   ├── page.tsx             # Homepage (SSR)
│   │   ├── article/[slug]/      # Halaman detail artikel
│   │   ├── category/[name]/     # Halaman per kategori
│   │   ├── event/               # Halaman daftar & detail event
│   │   ├── gallery/             # Halaman galeri media
│   │   ├── search/              # Halaman hasil pencarian
│   │   └── tag/[name]/          # Halaman per tag
│   │
│   ├── components/
│   │   ├── layout/              # Komponen struktural global
│   │   │   ├── Header.tsx       # Navigasi utama + search bar
│   │   │   ├── Footer.tsx       # Footer dengan links & social
│   │   │   ├── Sidebar.tsx      # Sidebar trending & event widget
│   │   │   ├── ClientLayout.tsx # Wrapper client-side (providers)
│   │   │   └── MainLayout.tsx   # Layout wrapper konten utama
│   │   │
│   │   ├── pages/               # Komponen besar per halaman
│   │   │   ├── Hero.tsx         # Hero bento grid di homepage
│   │   │   ├── ArticleFeed.tsx  # Feed artikel dengan infinite scroll
│   │   │   ├── CategoryPageLayout.tsx
│   │   │   ├── ArticleDetailPage/
│   │   │   ├── EventDetailPage/
│   │   │   ├── GalleryPage/     # Masonry gallery + lightbox
│   │   │   ├── SearchPage/
│   │   │   ├── TagDetailPage/
│   │   │   └── Homepage/        # Sub-komponen homepage
│   │   │
│   │   ├── article/             # Komponen terkait artikel
│   │   ├── slider/              # SliderNews carousel
│   │   ├── gallery/             # GalleryCard + Lightbox
│   │   └── ui/                  # Komponen atomik reusable
│   │
│   ├── lib/
│   │   ├── api.ts               # API service (Strategy Pattern: mock/live)
│   │   ├── apiClient.ts         # Axios instance terkonfigurasi
│   │   └── utils.ts             # Helper functions (cn, dll.)
│   │
│   ├── data/
│   │   ├── mocks-data/          # Fixture data per entitas
│   │   │   ├── mockArticles.ts
│   │   │   ├── mockEvents.ts
│   │   │   ├── mockGallery.ts
│   │   │   ├── mockTrending.ts
│   │   │   ├── mockTags.ts
│   │   │   └── mockCategories.ts
│   │   └── Navigation.ts        # Konfigurasi navigasi
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useArticles.ts
│   │   ├── useEvents.ts
│   │   ├── useSearch.ts
│   │   ├── useTags.ts
│   │   ├── usePagination.ts
│   │   └── useMobile.ts
│   │
│   ├── query/                   # TanStack Query fetchers
│   │   ├── apiArticles.ts
│   │   ├── apiEvents.ts
│   │   ├── apiSearch.ts
│   │   └── apiTags.ts
│   │
│   ├── typing/                  # TypeScript interfaces & types
│   │   ├── Article.ts
│   │   ├── Event.ts
│   │   ├── Author.ts
│   │   ├── Category.ts
│   │   ├── Tag.ts
│   │   ├── GalleryItem.ts
│   │   ├── TrendingItem.ts
│   │   ├── Navigation.ts
│   │   ├── Api.ts
│   │   └── index.ts             # Barrel export
│   │
│   └── utils/
│       └── dateUtils.ts         # Date formatting helpers
│
├── docs/
│   ├── ARCHITECTURE.md          # Panduan arsitektur & coding standards
│   ├── openapi.yaml             # API contract (OpenAPI 3.0)
│   └── swagger.html             # Swagger UI untuk docs API
│
├── public/                      # Aset statis
├── .env.example                 # Template environment variables
├── next.config.js               # Konfigurasi Next.js
├── tailwind.config.ts           # Konfigurasi Tailwind CSS
└── tsconfig.json                # Konfigurasi TypeScript
```

---

## 🔌 API Architecture

Proyek ini menggunakan **Strategy Pattern** pada API layer yang memungkinkan developer bekerja dengan **mock data lokal** tanpa perlu backend, atau langsung terhubung ke **live REST API**.

```
NEXT_PUBLIC_API_MODE=mock  →  Data statis dari app/data/mocks-data/
NEXT_PUBLIC_API_MODE=live  →  Fetch dari REST API (Golang backend)
```

### Endpoint yang Tersedia

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/articles` | Semua artikel |
| `GET` | `/articles/:slug` | Artikel by slug |
| `GET` | `/category/:name` | Artikel by kategori |
| `GET` | `/tag/:name` | Artikel by tag |
| `GET` | `/search/:query` | Full-text search artikel |
| `POST` | `/articles/:slug/view` | Increment view counter |
| `GET` | `/trending` | Daftar item trending |
| `GET` | `/events/upcoming` | Event mendatang |
| `GET` | `/events/:slug` | Detail event by slug |

> Lihat [`docs/openapi.yaml`](./docs/openapi.yaml) untuk API contract lengkap, atau buka [`docs/swagger.html`](./docs/swagger.html) untuk Swagger UI interaktif.

---

## ⚡ Memulai Pengembangan

### Prasyarat

- **Node.js** >= 18.x
- **npm** >= 9.x

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/your-org/maenews-nazca.git
cd maenews-nazca

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
```

### Konfigurasi Environment

Buka `.env.local` dan sesuaikan dengan kebutuhanmu:

```env
# Mode API: 'mock' (default) atau 'live'
NEXT_PUBLIC_API_MODE=mock

# URL Base API (hanya dipakai saat mode=live)
NEXT_PUBLIC_API_BASE_URL=https://golang-maenews-animae-id2569-ksgm0g96.leapcell.dev/api/v1
```

### Menjalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

---

## 📜 Perintah yang Tersedia

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint |

---

## 🗺️ Halaman & Routes

| Route | Deskripsi |
|---|---|
| `/` | Homepage — Hero, Terbaru, Slider Rekomendasi, Feed |
| `/article/[slug]` | Detail artikel lengkap |
| `/category/[name]` | Semua artikel dalam satu kategori |
| `/tag/[name]` | Semua artikel dengan tag tertentu |
| `/search` | Halaman pencarian |
| `/gallery` | Galeri media (gambar & video) |
| `/event` | Daftar semua event |
| `/event/[slug]` | Detail event |

---

## 🤝 Commit Convention

Gunakan prefix berikut untuk setiap commit message agar riwayat Git tetap bersih dan terstruktur:

| Prefix | Makna |
|---|---|
| `CMP` | Component Update — perubahan pada komponen UI |
| `SC` | Screen Update — perubahan pada halaman/screen |
| `FC` | Function Update — perubahan pada logika/fungsi |
| `ST` | State Update — perubahan state management |
| `RV` | Revision Update — revisi atau perbaikan umum |

**Contoh:**
```
CMP: update HeroCard layout for mobile responsiveness
FC: fix search normalization for multi-word queries
SC: add gallery page with masonry layout
```

---

## 📄 Dokumentasi Lanjutan

| File | Isi |
|---|---|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Panduan arsitektur folder, coding standards, do's & don'ts |
| [`docs/openapi.yaml`](./docs/openapi.yaml) | API contract lengkap dalam format OpenAPI 3.0 |
| [`docs/swagger.html`](./docs/swagger.html) | Swagger UI — visualisasi interaktif API docs |
| [`.env.example`](./.env.example) | Daftar semua environment variable yang dibutuhkan |

---

## 🌐 Domain & Deployment

| Environment | URL |
|---|---|
| **Production** | [animae.id](https://animae.id) |
| **API Backend** | [golang-maenews-animae-id2569-ksgm0g96.leapcell.dev](https://golang-maenews-animae-id2569-ksgm0g96.leapcell.dev/api/v1) |

---

<div align="center">

Dibuat dengan ❤️ oleh **Tim Animae**

</div>
