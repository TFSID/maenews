# 🗂️ Outline Tasklist CMS Maenews

> Ringkasan task (level-1 & level-2) dari seluruh dokumentasi. Detail lengkap ada di tiap file sumber.

## 🎨 Lini Desain UI/UX

### 01. Design System → [./design_cms/01-design-system.md](./design_cms/01-design-system.md)

#### 1. Fondasi Visual
- [ ] **Define:** Palet Warna Admin
  - [ ] Primer, Sekunder, Neutral, Semantic
- [ ] **Define:** Tipografi Dashboard
  - [ ] Skala font tabel & form

#### 2. Komponen UI Dasar (Atomic)
- [ ] **Design:** Buttons & Links
  - [ ] **Create:** Primary, Secondary, Outline, Ghost, Destructive
- [ ] **Design:** Form Inputs
  - [ ] **Create:** Text Input, Textarea, Select, Checkbox, Toggle
  - [ ] **Create:** State Hover, Focus, Disabled, Error
- [ ] **Design:** Data Display
  - [ ] **Create:** Badge/Label status
  - [ ] **Create:** Avatar placeholder

#### 3. Komponen Kompleks (Molecules/Organisms)
- [ ] **Design:** Data Tables
  - [ ] **Create:** Baris tabel, header sortable, paginasi
- [ ] **Design:** Modals & Dialogs
  - [ ] **Create:** Modal konfirmasi & pop-up form
- [ ] **Design:** WYSIWYG Editor Toolbar
  - [ ] **Create:** Toolbar editor kustom
- [ ] **Design:** Feedback UI
  - [ ] **Create:** Toast Notification & Loading Skeleton

### 02. Wireframe & Mockup → [./design_cms/02-wireframe-and-mockup.md](./design_cms/02-wireframe-and-mockup.md)

#### 1. Arsitektur Layout (Shell)
- [ ] **Design:** Struktur Navigasi Utama
  - [ ] **Create:** Mockup Sidebar & Topbar
- [ ] **Design:** Responsivitas Dashboard
  - [ ] **Create:** Layout Desktop vs Tablet

#### 2. Halaman & Alur Kerja (Workflows)
- [ ] **Design:** Dashboard Home
  - [ ] **Create:** Layout widget statistik & grafik
- [ ] **Design:** Alur Manajemen Konten (Artikel/Event)
  - [ ] **Create:** Mockup daftar tabel + filter
  - [ ] **Create:** Mockup halaman editor (split-view)
- [ ] **Design:** Media Library
  - [ ] **Create:** Layout Grid & modal detail aset
- [ ] **Design:** Autentikasi
  - [ ] **Create:** Mockup halaman login

#### 3. Prototipe Interaktif
- [ ] **Polish:** Definisi transisi antar halaman
- [ ] **Implement:** (Optional) Prototipe klik-tayang Figma

---

## 💻 Lini Frontend Implementasi

### 01. Setup & Layout → [./frontend_cms/01-setup-and-layout.md](./frontend_cms/01-setup-and-layout.md)

#### 1. Routing (Next.js App Router)
- [ ] **Setup:** Route Group CMS (`app/(admin)/`)
- [ ] **Create:** Root Layout CMS (`app/(admin)/layout.tsx`)
  - [ ] Render `<html>` & `<body>`
  - [ ] Load `<AdminSidebar />`, `<AdminHeader />`, `<main>`
  - [ ] Proteksi/middleware session
- [ ] **Create:** Halaman Utama Dashboard (`app/(admin)/page.tsx`)
- [ ] **Create:** Struktur Halaman Entitas (CRUD Base)
  - [ ] `app/(admin)/article/page.tsx`
  - [ ] `app/(admin)/article/create/page.tsx`
  - [ ] `app/(admin)/article/[slug]/edit/page.tsx`
  - [ ] Replikasi untuk `category`, `event`, `tag`, `gallery`

#### 2. Komponen CMS (`app/components/`)
- [ ] **Create:** Layout Components (`app/components/layout/admin/`)
  - [ ] `AdminHeader.tsx`
  - [ ] `AdminSidebar.tsx`
  - [ ] `AdminClientLayout.tsx`
- [ ] **Create:** Pages Components (`app/components/pages/admin/`)
  - [ ] `DashboardPage.tsx`
  - [ ] `ArticleManagementPage.tsx`
  - [ ] `ArticleEditorPage.tsx`
- [ ] **Implement:** UI Components (`app/components/ui/admin/`)
  - [ ] **Reuse:** Komponen ui publik (`<Button />`, `<Input />`, dll)
  - [ ] **Create:** `DataTable.tsx`
  - [ ] **Create:** `FormPageHeader.tsx`

#### 2b. Komponen Pages per Modul (`app/components/pages/admin/`)
- [ ] **Artikel** (`.../article/`)
  - [ ] `ArticleManagementPage.tsx`
    - [ ] `ArticleFilterToolbar.tsx` (search + filter kategori/status/penulis)
    - [ ] `ArticleTableColumns.tsx` (config kolom DataTable)
  - [ ] `ArticleEditorPage.tsx`
    - [ ] `RichTextEditor.tsx` (TipTap/React-Quill)
    - [ ] `ArticleEditorSidebar.tsx` (kategori, tags, status, SEO)
    - [ ] `ThumbnailUploader.tsx`
- [ ] **Event** (`.../event/`)
  - [ ] `EventManagementPage.tsx`
    - [ ] `EventStatusIndicator.tsx` (Upcoming/Ongoing/Passed)
  - [ ] `EventEditorPage.tsx`
    - [ ] `EventDateRangePicker.tsx` (start-end date)
    - [ ] `EventLocationInput.tsx` (toggle Online/Offline)
    - [ ] `EventBannerUploader.tsx`
- [ ] **Galeri Media** (`.../gallery/`)
  - [ ] `GalleryManagementPage.tsx`
    - [ ] `MediaGrid.tsx` (grid + click-to-preview)
    - [ ] `MediaUploadDropzone.tsx` (drag-drop bulk + progress)
    - [ ] `MediaDetailModal.tsx` (alt text, title, caption)
- [ ] **Pengaturan & Pengguna** (`.../settings/`)
  - [ ] `AuthorProfilePage.tsx`
    - [ ] `AvatarUploader.tsx` (avatar, bio, sosial media)
  - [ ] `SiteSettingsPage.tsx`
    - [ ] `SiteSettingsForm.tsx` (logo, favicon, nama situs)
  - [ ] `TrendingManager.tsx` (Pin to Trending)
- [ ] **Shared (reuse):** `DataTable.tsx`, `FormPageHeader.tsx`, `ConfirmModal.tsx`

#### 3. Data & Hooks (Query & Hooks)
- [ ] **Create:** API Services (`app/lib/apiAdmin.ts`)
  - [ ] Instance Axios + Interceptor token
  - [ ] Fetcher: `postArticle`, `putArticle`, `deleteArticle`
- [ ] **Implement:** TanStack Query (`app/query/admin/`)
  - [ ] **Create:** `apiAdminArticles.ts`
  - [ ] **Create:** Hook `useAdminArticlesQuery`
  - [ ] **Create:** Hook mutasi (`useCreate/Update/DeleteArticleMutation`)
  - [ ] **Implement:** `onSuccess` → `invalidateQueries`
  - [ ] Replikasi untuk Events, Tags, Categories, Gallery
- [ ] **Create:** Custom Hooks (`app/hooks/admin/`)
  - [ ] `useAdminPagination.ts`
  - [ ] `useImageUpload.ts`

#### 4. Typing & Data Mocking
- [ ] **Update:** Types Definition (`app/typing/`)
  - [ ] `Article.ts` + interface `CreateArticlePayload`
  - [ ] Interface `CreateEventPayload` dll
- [ ] **Create:** Mock Data CMS (`app/data/mocks-data/admin/mockAdminMutations.ts`)
  - [ ] Fungsi simulasi `Promise` + delay
  - [ ] Untuk loading state & toast notification

### 02. Pages Implementation → [./frontend_cms/02-pages-implementation.md](./frontend_cms/02-pages-implementation.md)

#### 1. Modul Dashboard (Overview)
- [ ] **Create:** Widget Statistik Ringkasan (Cards)
  - [ ] Total artikel (Published & Draft)
  - [ ] Total event aktif & mendatang
  - [ ] Total aset galeri
- [ ] **Design:** Grafik Analitik Pengunjung
  - [ ] **Implement:** Grafik tren kunjungan 7 hari
- [ ] **Create:** Tabel Aktivitas Terbaru
  - [ ] Daftar 5-10 artikel terakhir
- [ ] **Polish:** Responsivitas dashboard

#### 2. Modul Manajemen Artikel
- [ ] **Create:** Halaman Daftar Artikel (List View)
  - [ ] **Implement:** Toolbar Pencarian & Filter
  - [ ] **Implement:** Kolom Tabel + Aksi
- [ ] **Create:** Halaman Editor Artikel (Create/Edit)
  - [ ] **Implement:** Rich Text Editor
  - [ ] **Design:** Sidebar Editor (kategori, tags, image, status, SEO)
- [ ] **Fix:** Validasi form

#### 3. Modul Manajemen Event
- [ ] **Create:** Halaman Daftar Event
  - [ ] **Implement:** Indikator status event
- [ ] **Create:** Form Editor Event
  - [ ] **Implement:** Input Tanggal & Waktu
  - [ ] **Implement:** Input Lokasi (Online/Offline)
  - [ ] **Implement:** Uploader Banner Event
- [ ] **Polish:** Pencarian event

#### 4. Modul Galeri Media
- [ ] **Create:** Tampilan Media Library (Grid View)
  - [ ] **Implement:** Click to Preview
- [ ] **Create:** Fitur Upload Media
  - [ ] **Implement:** Drag-and-Drop bulk upload
  - [ ] **Implement:** Progress bar per file
- [ ] **Create:** Modal Detail/Edit Media
  - [ ] **Implement:** Edit Alt Text, Title, Caption
- [ ] **Fix:** Hapus permanen + modal konfirmasi

#### 5. Modul Pengaturan & Pengguna
- [ ] **Create:** Manajemen Profil Penulis
  - [ ] **Implement:** Avatar, Bio, link sosial media
- [ ] **Design:** Pengaturan Umum Situs
  - [ ] **Create:** Form Logo, Favicon, Nama Situs
- [ ] **Implement:** Fitur "Pin to Trending"

---

## ⚙️ Lini Integrasi & Backend

### 01. Autentikasi & Keamanan → [./01-auth-and-security.md](./01-auth-and-security.md)

#### 1. Autentikasi Admin
- [ ] **Setup:** Sistem Autentikasi (NextAuth.js / Custom JWT)
  - [ ] **Implement:** Konfigurasi Provider
  - [ ] **Create:** Halaman Login CMS (`app/(admin)/login/page.tsx`)
- [ ] **Implement:** Manajemen Session/Token
  - [ ] **Polish:** "Remember Me" & Session Timeout
- [ ] **Integrate:** API Login
  - [ ] **Connect:** Form login ke `/api/auth/login`

#### 2. Keamanan & Akses
- [ ] **Create:** Middleware Proteksi Rute
  - [ ] **Implement:** Cek login di `middleware.ts`
  - [ ] **Fix:** Redirect ke `/login` jika session invalid
- [ ] **Design:** Role-Based Access Control (RBAC)
  - [ ] **Define:** Izin Super Admin vs Editor/Penulis
- [ ] **Implement:** Validasi Keamanan API
  - [ ] **Create:** Server-side checks
- [ ] **Fix:** Proteksi CSRF & sanitasi input

### 02. Integrasi API (CRUD) → [./02-api-integration.md](./02-api-integration.md)

#### 1. Arsitektur Data
- [ ] **Setup:** TanStack Query di level Admin
  - [ ] **Implement:** `QueryClientProvider` di `AdminClientLayout.tsx`
- [ ] **Create:** Axios Admin Instance
  - [ ] **Implement:** Request Interceptors (Token Bearer)
  - [ ] **Implement:** Response Interceptors (error 401)

#### 2. Operasi CRUD (Mutasi & Query)
- [ ] **Implement:** Integrasi API Artikel
  - [ ] **Connect:** `GET` ke DataTable (pagination server-side)
  - [ ] **Create:** `useCreateArticleMutation`
  - [ ] **Create:** `useUpdateArticleMutation`
  - [ ] **Create:** `useDeleteArticleMutation`
- [ ] **Implement:** Integrasi API Event, Kategori, Tags
- [ ] **Implement:** API Upload Media
  - [ ] **Connect:** Uploader ke endpoint upload
  - [ ] **Fix:** Penanganan respons URL

#### 3. Feedback & Notifikasi
- [ ] **Create:** Sistem Toast Notification
  - [ ] **Implement:** Notifikasi sukses/gagal
- [ ] **Design:** Loading States
  - [ ] **Create:** Skeletons / Overlay Spinner
