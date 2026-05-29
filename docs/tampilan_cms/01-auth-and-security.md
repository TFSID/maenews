# Tasklist: Autentikasi & Keamanan CMS

Lini ini fokus pada pengamanan akses dashboard agar hanya admin dan editor resmi yang dapat masuk.

## 1. 🔑 Autentikasi Admin
- [ ] **Setup:** Sistem Autentikasi (NextAuth.js atau Custom JWT).
  - [ ] **Implement:** Konfigurasi *Provider* (Credentials atau OAuth).
  - [ ] **Create:** Halaman Login CMS (`app/(admin)/login/page.tsx`) yang terpisah dari layout admin utama.
- [ ] **Implement:** Manajemen Session/Token.
  - [ ] **Polish:** Fitur "Remember Me" dan *Session Timeout* otomatis demi keamanan.
- [ ] **Integrate:** API Login.
  - [ ] **Connect:** Hubungkan form login dengan endpoint `/api/auth/login`.

## 2. 🛡️ Keamanan & Akses
- [ ] **Create:** Middleware Proteksi Rute.
  - [ ] **Implement:** Logika pada `middleware.ts` untuk mengecek status login setiap kali rute `/(admin)` diakses.
  - [ ] **Fix:** *Redirect* otomatis ke `/login` jika session tidak valid atau expired.
- [ ] **Design:** Role-Based Access Control (RBAC).
  - [ ] **Define:** Perbedaan izin akses antara *Super Admin* (bisa semua) dan *Editor/Penulis* (hanya bisa artikel sendiri).
- [ ] **Implement:** Validasi Keamanan API.
  - [ ] **Create:** *Server-side checks* untuk memastikan user yang melakukan mutasi data benar-benar memiliki izin.
- [ ] **Fix:** Proteksi CSRF dan sanitasi input form untuk mencegah serangan injeksi.
