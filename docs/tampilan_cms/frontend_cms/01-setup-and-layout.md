# Tasklist: Setup Routing & Layout CMS

Tasklist ini disesuaikan dengan arsitektur `maenews-nazca` yang sudah ada, mempertahankan konsistensi struktur folder, pemisahan *concerns* (komponen, hooks, query), dan penggunaan standar UI yang sama.

## 1. 🚦 Routing (Next.js App Router)
- [ ] **Setup:** Route Group CMS dengan membuat direktori `app/(admin)/` sejajar dengan `app/(main)/`. Penggunaan tanda kurung `(admin)` agar tidak memengaruhi struktur URL path (tetap `/dashboard` atau sesuai folder di dalamnya) namun memiliki *layout* terpisah.
- [ ] **Create:** Root Layout CMS (`app/(admin)/layout.tsx`).
  - [ ] Me-render tag `<html>` dan `<body>` tersendiri.
  - [ ] Meload komponen struktur: `<AdminSidebar />`, `<AdminHeader />`, dan area utama `<main>{children}</main>`.
  - [ ] Menyisipkan logika proteksi/middleware pengecekan token *session* (otomatis *redirect* ke `/login` jika user *unauthenticated*).
- [ ] **Create:** Halaman Utama Dashboard (`app/(admin)/page.tsx`) yang berfungsi sebagai *entry point* dengan memanggil komponen `<DashboardPage />`.
- [ ] **Create:** Struktur Halaman Entitas (CRUD Base):
  - [ ] `app/(admin)/article/page.tsx` -> Menampilkan tabel daftar artikel dengan `<DataTable />`.
  - [ ] `app/(admin)/article/create/page.tsx` -> Menampilkan form pembuatan artikel (kondisi kosong).
  - [ ] `app/(admin)/article/[slug]/edit/page.tsx` -> Menampilkan form edit yang datanya otomatis terisi (*pre-filled*) berdasarkan *fetch* ID/Slug.
  - [ ] Replikasi struktur tiga halaman di atas untuk entitas: `category`, `event`, `tag`, dan `gallery`.

## 2. 🧩 Komponen CMS (`app/components/`)
- [ ] **Create:** Layout Components (`app/components/layout/admin/`):
  - [ ] `AdminHeader.tsx`: Buat baris navigasi atas yang memiliki teks "Maenews Admin", ikon notifikasi, dan *dropdown* profil untuk eksekusi aksi "Logout".
  - [ ] `AdminSidebar.tsx`: Buat navigasi vertikal menggunakan `next/link`. Implementasikan *Active Route Pattern* (ubah warna teks/background menu jika URL saat ini sama dengan `href` menu tersebut).
  - [ ] `AdminClientLayout.tsx`: Buat *wrapper* khusus dengan deklarasi `"use client"` jika dibutuhkan untuk memuat *context provider* spesifik admin (misal: state sidebar terbuka/tertutup).
- [ ] **Create:** Pages Components (`app/components/pages/admin/`):
  - [ ] `DashboardPage.tsx`: Komponen untuk merender layout *summary widgets* dan *chart* pengunjung.
  - [ ] `ArticleManagementPage.tsx`: Komponen wrapper berisi integrasi *fetching* data dan pemanggilan `<DataTable />`.
  - [ ] `ArticleEditorPage.tsx`: Menyediakan form input panjang yang berisi field Judul, uploader Thumbnail, integrasi Editor WYSIWYG, dan *Submit button*.
- [ ] **Implement:** UI Components (`app/components/ui/admin/`):
  - [ ] **Reuse:** Integrasikan kembali komponen dari `app/components/ui/` publik (seperti `<Button />`, `<Input />`, `<Badge />`, `<Spinner />`).
  - [ ] **Create:** `DataTable.tsx`: Tabel dinamis *reusable*. Wajib menerima props berupa `columns` (array konfigurasi struktur kolom), `data` (array data), serta event handler `onSort` dan `onPageChange`.
  - [ ] **Create:** `FormPageHeader.tsx`: Komponen untuk diletakkan di bagian atas setiap halaman manajemen (Memiliki prop untuk Judul Halaman dan Tombol *Action Primary* di sebelah kanan, contoh: tombol "Tambah Artikel Baru").

## 3. 🔌 Data & Hooks (Query & Hooks)
- [ ] **Create:** API Services (`app/lib/apiAdmin.ts`):
  - [ ] Buat *instance Axios* khusus (atau modifikasi `apiClient.ts`) dengan menambahkan *Interceptor* agar setiap request memuat header `Authorization: Bearer <token>` secara otomatis.
  - [ ] Tulis fungsi *mutasi* atau fetcher: `postArticle(data)`, `putArticle(id, data)`, `deleteArticle(id)`.
- [ ] **Implement:** TanStack Query (`app/query/admin/`):
  - [ ] **Create:** File `apiAdminArticles.ts`.
  - [ ] **Create:** Hook `useAdminArticlesQuery` (untuk fetching tabel).
  - [ ] **Create:** Hook mutasi: `useCreateArticleMutation`, `useUpdateArticleMutation`, `useDeleteArticleMutation`.
  - [ ] **Implement:** Pada *options* `useMutation`, tambahkan *callback* `onSuccess` yang memanggil `queryClient.invalidateQueries({ queryKey: ['admin-articles'] })` agar tabel me-refresh data secara real-time sesudah penyimpanan sukses.
  - [ ] Replikasi pola hook Query ini untuk Events, Tags, Categories, dan Gallery.
- [ ] **Create:** Custom Hooks (`app/hooks/admin/`):
  - [ ] `useAdminPagination.ts`: Hook untuk me-manage state halaman (*current page*, *limit per page*) yang dihubungkan ke state `<DataTable />`.
  - [ ] `useImageUpload.ts`: Hook logika untuk *handle file selection*, konversi file menjadi objek *FormData*, melakukan POST ke server, dan mengembalikan *URL image*.

## 4. 📝 Typing & Data Mocking
- [ ] **Update:** Types Definition (`app/typing/`):
  - [ ] Modifikasi file `Article.ts`. Tambahkan interface baru `CreateArticlePayload` (hanya memuat data form dari user: `title`, `content`, `categoryId`, `image`). Hindari/omit *fields auto-generated backend* seperti `id` dan `createdAt`.
  - [ ] Tambahkan interface `CreateEventPayload` dan yang lainnya sesuai format backend.
- [ ] **Create:** Mock Data CMS (`app/data/mocks-data/admin/mockAdminMutations.ts`):
  - [ ] Sebagai jembatan selama API backend belum siap, siapkan fungsi simulasi yang mengembalikan `Promise` berbalut *delay* (menggunakan `setTimeout`).
  - [ ] Hal ini krusial untuk menirukan durasi *network request* saat tombol form "Simpan" diklik, sehingga *Developer Frontend* dapat merancang transisi UI *Loading state* dan men-trigger *Toast Notification* sukses/gagal di form CMS.
