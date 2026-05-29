# Tasklist: Integrasi Data (CRUD)

Lini ini fokus pada sinkronisasi data antara Frontend UI CMS dengan Backend API.

## 1. ⚙️ Arsitektur Data
- [ ] **Setup:** TanStack Query (React Query) di level Admin.
  - [ ] **Implement:** `QueryClientProvider` di `AdminClientLayout.tsx`.
- [ ] **Create:** Axios Admin Instance.
  - [ ] **Implement:** Request *Interceptors* untuk menyisipkan Token Bearer.
  - [ ] **Implement:** Response *Interceptors* untuk menangani error 401 (Unauthorized) secara global.

## 2. 🔄 Operasi CRUD (Mutasi & Query)
- [ ] **Implement:** Integrasi API Artikel.
  - [ ] **Connect:** `GET` data ke DataTable dengan pagination server-side.
  - [ ] **Create:** Hook `useCreateArticleMutation` untuk simpan data baru.
  - [ ] **Create:** Hook `useUpdateArticleMutation` untuk simpan perubahan.
  - [ ] **Create:** Hook `useDeleteArticleMutation` untuk hapus data.
- [ ] **Implement:** Integrasi API Event, Kategori, dan Tags (Ulangi pola CRUD di atas).
- [ ] **Implement:** API Upload Media.
  - [ ] **Connect:** Integrasi uploader dengan endpoint upload gambar.
  - [ ] **Fix:** Penanganan respons URL untuk langsung disematkan ke editor/thumbnail.

## 3. 🔔 Feedback & Notifikasi
- [ ] **Create:** Sistem Toast Notification.
  - [ ] **Implement:** Tampilkan notifikasi sukses/gagal saat operasi simpan/hapus berhasil dilakukan.
- [ ] **Design:** Loading States.
  - [ ] **Create:** Skeletons atau Overlay Spinner saat data sedang di-fetch atau sedang proses submit.
