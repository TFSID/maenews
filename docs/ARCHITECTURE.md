# 🏛️ Maenews — Architecture & Development Guidelines

## 📁 Struktur Folder

Berikut peta folder utama di dalam direktori `app/` (tanpa folder `src`):

| Folder | Deskripsi |
|---|---|
| `app/components/layout/` | Komponen global pembungkus konten — `Header`, `Footer`, `Sidebar`, `ClientLayout` |
| `app/components/ui/` | Komponen atomik reusable — `Button`, `Input`, `Badge`, `Card`, dll. |
| `app/components/pages/` | Komponen besar spesifik per halaman — `Hero`, `ArticleFeed`, `CategoryPageLayout` |
| `app/components/article/` | Komponen terkait tampilan artikel — `ArticleDetail`, `LatestNewsSection` |
| `app/components/slider/` | Komponen carousel — `SliderNews` |
| `app/components/gallery/` | Komponen galeri — `GalleryCard`, `Lightbox` |
| `app/typing/` | Definisi tipe TypeScript per entitas: `Article.ts`, `Event.ts`, `GalleryItem.ts`, `TrendingItem.ts`, dll. Index re-export di `index.ts` |
| `app/lib/` | Konfigurasi API fetcher (`api.ts`), Axios instance (`apiClient.ts`), helper (`utils.ts`) |
| `app/query/` | TanStack Query fetchers per fitur — `apiArticles.ts`, `apiEvents.ts`, `apiSearch.ts`, `apiTags.ts` |
| `app/data/mocks-data/` | Fixture/mock data per entitas — `mockArticles.ts`, `mockEvents.ts`, dll. |
| `app/data/` | Data statis konfigurasi — `Navigation.ts` |
| `app/hooks/` | Custom React Hooks — `useArticles.ts`, `useEvents.ts`, `useSearch.ts`, `useMobile.ts` |
| `app/utils/` | Pure utility functions — `dateUtils.ts` |

---

## 🔌 API Layer (`app/lib/api.ts`)

API service menggunakan **Strategy Pattern** untuk switch antara mock dan live mode tanpa mengubah kode komponen:

```
NEXT_PUBLIC_API_MODE=mock  →  Data dari app/data/mocks-data/
NEXT_PUBLIC_API_MODE=live  →  Fetch dari REST API (Golang backend)
```

Lihat `.env.example` untuk konfigurasi dan `docs/openapi.yaml` untuk API contract.

### Alur Data (Live Mode)
```
Page (SSR/SSG) → lib/api.ts (active service) → apiClient.ts (Axios) → REST API
                       ↓
              query/ (TanStack Query)  ← Client-side fetching
```

---

## 🔬 TypeScript Types (`app/typing/`)

Semua interface didefinisikan di folder ini dan di-export melalui `index.ts` (barrel file).

| File | Interface | Field Utama |
|---|---|---|
| `Article.ts` | `Article` | `id`, `title`, `slug`, `content`, `author`, `tags`, `category`, `featured`, `views` |
| `Event.ts` | `Event` | `id`, `title`, `slug`, `location`, `startDate`, `endDate`, `status`, `organizer` |
| `GalleryItem.ts` | `GalleryItem` | `id`, `title`, `type` (image/video), `url`, `thumbnailUrl`, `category` |
| `TrendingItem.ts` | `TrendingItem` | Trending article metadata |
| `Author.ts` | `Author` | Author profile |
| `Api.ts` | `ApiConfig`, `ApiMode` | API configuration types |
| `Navigation.ts` | `NavItem` | Navigation link structure |

---

## 🚦 Aturan Per Folder

| Folder | Aturan |
|---|---|
| `components/` | ❌ Dilarang fetch API atau logic bisnis di luar hooks; hanya terima data lewat **props** |
| `lib/` & `utils/` | ❌ Dilarang memasukkan JSX/UI; hanya **pure functions** |
| `typing/` | ✅ Wajib beri nama file sesuai entitas (`Article.ts`, `Event.ts`) |
| `data/mocks-data/` | ✅ Hanya data statis & fixture; **tidak boleh ada logic** |
| `query/` | ✅ Hanya TanStack Query fetchers; gunakan untuk client-side fetching |
| `hooks/` | ✅ Custom hooks yang memanfaatkan `query/` atau `lib/api.ts` |

---

## ✅ Do's

- **PascalCase** untuk file komponen (`HeroCard.tsx`, `ArticleDetail.tsx`)
- **camelCase** untuk hooks (`useArticles.ts`) dan utilities (`dateUtils.ts`)
- **Modularitas** — Pecah komponen > 150 baris menjadi sub-komponen di subfolder
- **Type Safety** — Gunakan interface dari `typing/`; hindari `any`
- **Semantic HTML** — Gunakan tag yang tepat untuk SEO portal berita (`<article>`, `<section>`, `<nav>`)
- **Environment Variables** — Simpan konfigurasi di `.env.local`, dokumentasikan di `.env.example`
- **Lazy Loading** — Gunakan `next/dynamic` untuk komponen client-heavy (carousel, slider)
- **Image Optimization** — Selalu gunakan `next/image` dengan domain terdaftar di `next.config.js`

---

## ❌ Don'ts

- **Hindari `any`** — Gunakan types yang sudah ada di `typing/`
- **No Inline Styles** — Gunakan Tailwind CSS utility classes
- **No Hardcoded Values** — Jangan simpan API Key/URL di komponen; gunakan `.env`
- **No Direct State Mutation** — Gunakan setter dari `useState`
- **No Comment/Uncomment Switching** — Gunakan env-based strategy pattern di `api.ts`

---

## 🎨 Design System

- **Font Utama**: Poppins (400, 500, 600, 700, 800, 900) via `next/font/google`
- **Font Display**: ADLaM Display (judul dekoratif) via Google Fonts CDN
- **Color Primary**: Orange (digunakan untuk aksen, underline, dan highlight section)
- **CSS Framework**: Tailwind CSS v4 dengan `@tailwindcss/typography`
- **Animation**: Framer Motion untuk transisi halaman dan komponen interaktif
- **Icon Set**: Lucide React
- **Component Primitives**: Radix UI (accessible, unstyled)

---

## 📦 Commit Convention

| Prefix | Makna |
|---|---|
| `CMP` | Component Update |
| `SC` | Screen Update |
| `FC` | Function Update |
| `ST` | State Update |
| `RV` | Revision Update |