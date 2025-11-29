# 🔐 Akun Demo LaporIn

## 📋 Informasi Umum

**Password Default untuk Semua Akun:** `demo123`

---

## 👤 Akun dengan Email Asli (Real Emails)

### 1. Superadmin (Admin Sistem)
- **Email:** `abhisuryanu9roho@gmail.com`
- **Password:** `demo123`
- **Nama:** Abhi Surya Nugroho
- **Role:** `admin` (Superadmin)
- **RT/RW:** Tidak ada (admin kelurahan)
- **Status:** Verified ✅

### 2. Admin RW001
- **Email:** `kepodehlol54@gmail.com`
- **Password:** `demo123`
- **Nama:** Admin RW 001
- **Role:** `admin_rw`
- **RT/RW:** Tidak ada (admin RW)
- **Status:** Verified ✅

### 3. Ketua RT001/RW001
- **Email:** `gaminggampang20@gmail.com`
- **Password:** `demo123`
- **Nama:** Dyandra
- **Role:** `ketua_rt`
- **RT/RW:** RT001/RW001
- **Status:** Verified ✅

### 4. Pengurus RT001/RW001
- **Email:** `syncrazelled@gmail.com`
- **Password:** `demo123`
- **Nama:** Muhammad Alfarisi Setiyono
- **Role:** `pengurus`
- **RT/RW:** RT001/RW001
- **Status:** Verified ✅

### 5. Warga RT001/RW001
- **Email:** `wadidawcihuy@gmail.com`
- **Password:** `demo123`
- **Nama:** Muhammad Ghiffari
- **Role:** `warga`
- **RT/RW:** RT001/RW001
- **Status:** Verified ✅

---

## 🔄 Akun Generate (Dummy Emails)

### Admin RW002
- **Email:** `adminrw002@example.com`
- **Password:** `demo123`
- **Nama:** Admin RW002
- **Role:** `admin_rw`
- **RT/RW:** Tidak ada
- **Status:** Verified ✅

### RT002/RW001
- **Ketua RT:** `ketuart002rw001@example.com` / `demo123`
- **Sekretaris:** `sekretarisrt002rw001@example.com` / `demo123`
- **Pengurus:** `pengurusrt002rw001@example.com` / `demo123`
- **Warga:** `warga1@example.com`, `warga2@example.com`, dst. (10-15 warga per RT) / `demo123`

### RT003/RW001
- **Ketua RT:** `ketuart003rw001@example.com` / `demo123`
- **Sekretaris:** `sekretarisrt003rw001@example.com` / `demo123`
- **Pengurus:** `pengurusrt003rw001@example.com` / `demo123`
- **Warga:** `wargaX@example.com` (10-15 warga per RT) / `demo123`

### RW002 (Full Generate)
- **Admin RW:** `adminrw002@example.com` / `demo123`
- **RT001/RW002:** 
  - Ketua: `ketuart001rw002@example.com` / `demo123`
  - Sekretaris: `sekretarisrt001rw002@example.com` / `demo123`
  - Pengurus: `pengurusrt001rw002@example.com` / `demo123`
  - Warga: `wargaX@example.com` (10-15 warga) / `demo123`
- **RT002/RW002:**
  - Ketua: `ketuart002rw002@example.com` / `demo123`
  - Sekretaris: `sekretarisrt002rw002@example.com` / `demo123`
  - Pengurus: `pengurusrt002rw002@example.com` / `demo123`
  - Warga: `wargaX@example.com` (10-15 warga) / `demo123`
- **RT003/RW002:**
  - Ketua: `ketuart003rw002@example.com` / `demo123`
  - Sekretaris: `sekretarisrt003rw002@example.com` / `demo123`
  - Pengurus: `pengurusrt003rw002@example.com` / `demo123`
  - Warga: `wargaX@example.com` (10-15 warga) / `demo123`

---

## 🎯 Rekomendasi Akun untuk Testing/Demo

### Untuk Testing Superadmin:
- **Email:** `abhisuryanu9roho@gmail.com`
- **Password:** `demo123`
- **Fitur:** Bisa melihat semua data, mengelola semua user, tidak ada batasan peta

### Untuk Testing Admin RW:
- **Email:** `kepodehlol54@gmail.com` (RW001)
- **Password:** `demo123`
- **Fitur:** Bisa mengelola RT di bawah RW001, melihat laporan di area RW001

### Untuk Testing Ketua RT/Pengurus:
- **Email:** `gaminggampang20@gmail.com` (Ketua RT001/RW001)
- **Password:** `demo123`
- **Email:** `syncrazelled@gmail.com` (Pengurus RT001/RW001)
- **Password:** `demo123`
- **Fitur:** Bisa mengelola laporan di RT001/RW001

### Untuk Testing Warga:
- **Email:** `wadidawcihuy@gmail.com` (Warga RT001/RW001)
- **Password:** `demo123`
- **Fitur:** Bisa membuat laporan, melihat status laporan sendiri

---

## 📝 Catatan Penting

1. **Password:** Semua akun menggunakan password `demo123`
2. **Email Asli:** Hanya 5 akun yang menggunakan email asli (untuk notifikasi/testing)
3. **Email Generate:** Akun lainnya menggunakan email pattern `*@example.com` (tidak bisa menerima email)
4. **Face Recognition:** Akun dengan email asli mungkin sudah terdaftar face recognition
5. **Status:** Semua akun sudah verified (tidak perlu verifikasi email)
6. **Lokasi:** Semua data berada di area Cipete, Jakarta Selatan

---

## 🔄 Cara Reset Data

Jika ingin reset semua data dan seed ulang:

```bash
# Di Railway SSH atau local
cd backend
npm run clear-all-data
npm run seed:real
```

---

## 📱 Akses Aplikasi

- **Web App:** https://laporin.vercel.app (atau URL Vercel Anda)
- **Mobile App:** Build APK dari `laporin_app/`
- **Backend API:** https://api-weladalah-laporin.up.railway.app

---

## ⚠️ Peringatan

- **Jangan gunakan password `demo123` di production!**
- Email asli hanya untuk testing/demo
- Pastikan untuk mengganti password setelah testing selesai
- Data ini hanya untuk keperluan demo dan development

---

## 📊 Struktur Data

### RT/RW yang Tersedia:
- **RW001:** RT001, RT002, RT003
- **RW002:** RT001, RT002, RT003

### Lokasi:
- **RW Radius:** 1km (1000 meter)
- **RT Radius:** Minimal 200 meter
- **Area:** Cipete, Jakarta Selatan

### Laporan:
- Setiap RT memiliki minimal 2-3 laporan
- RT001/RW001 memiliki lebih banyak laporan untuk demo
- Laporan berada di sekitar area RT masing-masing

