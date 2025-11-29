# 🌱 Panduan Menggunakan Seeder yang Sudah Di-Update

## 📋 Overview

Seeder yang sudah di-update (`seed-real-jakarta.js`) memiliki konfigurasi baru:

- **RW Radius**: Fixed **1km (1000 meter)**
- **RT Radius**: Minimal **200 meter** (range: 200-350m)
- **Lokasi**: RT berada di area **Cipete & Fatmawati, Jakarta Selatan**
- **Laporan**: Semua laporan berada di sekitar area RT masing-masing

## 🚀 Cara Menggunakan

### Opsi 1: Clear Semua Data Lalu Seed (Recommended)

```bash
cd backend

# 1. Clear semua data (kecuali chatbot training data)
npm run clear-all-data

# 2. Seed data dengan konfigurasi baru
npm run seed:real
```

### Opsi 2: Clear Hanya Lokasi & Laporan (Preserve Users)

```bash
cd backend

# 1. Clear hanya lokasi RT/RW dan laporan (user tetap ada)
npm run clear-location-reports

# 2. Seed data dengan konfigurasi baru
npm run seed:real
```

### Opsi 3: Clear + Reseed Sekaligus

```bash
cd backend

# Clear semua data lalu seed ulang dalam satu command
npm run clear-and-reseed
```

## 📍 Konfigurasi Lokasi

### RT/RW yang Akan Dibuat:

#### RW001 (Radius: 1km)
- **RT001/RW001**: 
  - Center: Cipete area
  - Radius: 300m
  - Address: Jl. Cipete Raya No. 1-50
  
- **RT002/RW001**: 
  - Center: Fatmawati area
  - Radius: 250m
  - Address: Jl. Fatmawati No. 51-100
  
- **RT003/RW001**: 
  - Center: Cipete area
  - Radius: 200m (minimal)
  - Address: Jl. Cipete Raya No. 101-150

#### RW002 (Radius: 1km)
- **RT001/RW002**: 
  - Center: Fatmawati area
  - Radius: 350m
  - Address: Jl. Fatmawati No. 1-50
  
- **RT002/RW002**: 
  - Center: Cipete area
  - Radius: 280m
  - Address: Jl. Pangeran Antasari No. 51-100
  
- **RT003/RW002**: 
  - Center: Fatmawati area
  - Radius: 220m
  - Address: Jl. Fatmawati No. 101-150

## 👤 Akun yang Dibuat

### Akun dengan Email Asli:
- **Superadmin**: `abhisuryanu9roho@gmail.com` / `demo123`
- **Admin RW001**: `kepodehlol54@gmail.com` / `demo123`
- **Ketua RT001/RW001**: `gaminggampang20@gmail.com` / `demo123`
- **Pengurus RT001/RW001**: `syncrazelled@gmail.com` / `demo123`
- **Warga RT001/RW001**: `wadidawcihuy@gmail.com` / `demo123`

### Akun Generate (Dummy):
- Semua akun lainnya menggunakan pattern `*@example.com`
- Password: `demo123`

## 🔍 Validasi Setelah Seeding

Setelah seeder selesai, akan muncul log validasi:

```
📍 RW001: Center (-6.2746, 106.8023), Radius: 1000m (1km) - menaungi 3 RT
   - RT radius: 200m - 300m (minimal 200m ✓)
   - Semua RT dalam area RW: ✓
   - Area: Cipete & Fatmawati, Jakarta Selatan
```

## ⚙️ Prerequisites

1. **Database sudah di-setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Environment variables sudah di-set**:
   - `DATABASE_URL` harus sudah dikonfigurasi
   - File `.env` sudah ada di folder `backend/`

3. **Dependencies sudah di-install**:
   ```bash
   npm install
   ```

## 🐛 Troubleshooting

### Error: "Cannot find module '../database/prisma'"
```bash
# Pastikan sudah generate Prisma client
npx prisma generate
```

### Error: "Database connection failed"
```bash
# Cek DATABASE_URL di file .env
# Pastikan database sudah running
```

### Error: "Table does not exist"
```bash
# Push schema ke database
npx prisma db push
```

## 📝 Catatan Penting

1. **Password Default**: Semua akun menggunakan password `demo123`
2. **Email Asli**: Hanya 5 akun yang menggunakan email asli (untuk notifikasi)
3. **Lokasi**: Semua data berada di area Cipete & Fatmawati, Jakarta Selatan
4. **RW Radius**: Fixed 1km untuk semua RW
5. **RT Radius**: Minimal 200m, maksimal 350m
6. **Laporan**: Setiap RT memiliki minimal 2-3 laporan (RT001/RW001 lebih banyak untuk demo)

## 🔄 Reset Database Lengkap

Jika ingin reset database dari awal:

```bash
cd backend

# 1. Reset Prisma (HATI-HATI: Ini akan drop semua tabel!)
npx prisma migrate reset

# 2. Push schema
npx prisma db push

# 3. Seed data
npm run seed:real
```

## 📚 Referensi

- **File Seeder**: `backend/scripts/seed-real-jakarta.js`
- **Akun Demo**: `DEMO_ACCOUNTS.md` (di root project)
- **User Credentials**: `USER_CREDENTIALS.md` (di root project)

---

**Last Updated**: 2025-01-XX  
**Maintained by**: Weladalah Team

