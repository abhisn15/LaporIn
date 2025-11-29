# 🗺️ Panduan Setup Google Maps API - LaporIn

Panduan lengkap untuk setup Google Maps API di backend (Railway) dan frontend (Vercel).

---

## 📋 Overview

Google Maps API digunakan di 2 tempat:

1. **Backend (Railway):**
   - Variable: `GOOGLE_MAPS_API_KEY`
   - Digunakan untuk: Geocoding (convert alamat ↔ koordinat)
   - File: `backend/services/geocodingService.js`

2. **Frontend (Vercel):**
   - Variable: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Digunakan untuk: Menampilkan peta Google Maps
   - File: `app/admin/peta-laporan/page.tsx`

**Catatan:** Bisa pakai **API key yang sama** untuk backend dan frontend, atau buat terpisah (recommended untuk production).

---

## 🔑 Cara Mendapatkan Google Maps API Key

### Step 1: Buka Google Cloud Console

1. Buka: https://console.cloud.google.com
2. **Sign up / Login** (gratis, pakai Google account)
3. **Create Project** atau pilih existing project
   - Nama project: `LaporIn` (atau sesuai keinginan)

### Step 2: Enable Required APIs

1. Di Google Cloud Console → **APIs & Services** → **Library**
2. Enable APIs berikut:
   - ✅ **Maps JavaScript API** (untuk frontend - peta)
   - ✅ **Geocoding API** (untuk backend - convert alamat)
   - ✅ **Places API** (optional - untuk autocomplete alamat)

### Step 3: Create API Key

1. **APIs & Services** → **Credentials**
2. Klik **+ CREATE CREDENTIALS** → **API Key**
3. Copy API Key yang di-generate

### Step 4: Restrict API Key (Recommended untuk Production)

**Penting untuk keamanan!**

1. Klik API Key yang baru dibuat
2. **Application restrictions:**
   - **HTTP referrers (web sites)** (untuk frontend)
   - Add referrers:
     ```
     https://laporin.vercel.app/*
     https://*.vercel.app/*
     http://localhost:3000/*
     ```
   - **IP addresses** (untuk backend)
   - Add IP: Railway IP ranges (atau biarkan kosong untuk development)

3. **API restrictions:**
   - **Restrict key**
   - Pilih APIs:
     - ✅ Maps JavaScript API
     - ✅ Geocoding API
     - ✅ Places API (jika digunakan)

4. **Save**

---

## 🚂 Setup di Railway (Backend)

### Step 1: Set Environment Variable

**Railway Dashboard** → **Service (backend)** → **Variables** → **Add:**

```
Name: GOOGLE_MAPS_API_KEY
Value: your_google_maps_api_key_here
```

### Step 2: Redeploy (jika perlu)

Railway otomatis redeploy setelah set variable. Atau manual:
```bash
railway restart
```

### Step 3: Test Geocoding

```bash
# Test dari Railway shell
railway run node -e "
const { forwardGeocode } = require('./services/geocodingService');
forwardGeocode('Jakarta, Indonesia')
  .then(r => console.log('Result:', r))
  .catch(e => console.error('Error:', e));
"
```

---

## 🚀 Setup di Vercel (Frontend)

### Step 1: Set Environment Variable

**Vercel Dashboard** → **Project** → **Settings** → **Environment Variables** → **Add:**

```
Name: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
Value: your_google_maps_api_key_here
Environment: Production, Preview, Development
```

**Penting:**
- ✅ Harus pakai prefix `NEXT_PUBLIC_` agar accessible di browser
- ✅ Set untuk semua environments (Production, Preview, Development)

### Step 2: Redeploy

**Vercel Dashboard** → **Deployments** → **Redeploy**

Atau otomatis redeploy jika ada perubahan di GitHub.

### Step 3: Test Peta

1. Buka frontend URL
2. Login sebagai admin
3. Buka halaman **Peta Laporan** (`/admin/peta-laporan`)
4. Peta Google Maps harus muncul

---

## 🔧 Konfigurasi API Key

### Option 1: Satu API Key untuk Semua (Development)

**Railway:**
```
GOOGLE_MAPS_API_KEY=AIzaSy...your_key_here
```

**Vercel:**
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...your_key_here (sama)
```

**Keuntungan:**
- ✅ Sederhana, hanya 1 key
- ✅ Mudah di-manage

**Restrictions:**
- HTTP referrers: `https://*.vercel.app/*`, `http://localhost:3000/*`
- IP addresses: (kosong atau Railway IP ranges)

### Option 2: Terpisah (Recommended untuk Production)

**Backend API Key:**
- Restrictions: IP addresses (Railway server IPs)
- APIs: Geocoding API only

**Frontend API Key:**
- Restrictions: HTTP referrers (Vercel domains)
- APIs: Maps JavaScript API, Places API

**Keuntungan:**
- ✅ Lebih aman (terpisah per use case)
- ✅ Bisa restrict lebih spesifik
- ✅ Jika satu key compromised, yang lain aman

---

## 🧪 Testing

### Test Backend Geocoding:

```bash
# Via Railway shell
railway run node -e "
const { forwardGeocode, reverseGeocode } = require('./services/geocodingService');

// Test forward geocoding
forwardGeocode('Jakarta, Indonesia')
  .then(r => {
    console.log('Forward:', r);
    // Test reverse geocoding
    return reverseGeocode(r.lat, r.lng);
  })
  .then(r => console.log('Reverse:', r))
  .catch(e => console.error('Error:', e));
"
```

### Test Frontend Maps:

1. Buka browser console di frontend
2. Cek apakah Google Maps loaded:
   ```javascript
   console.log('Maps API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
   ```
3. Buka halaman peta: `/admin/peta-laporan`
4. Peta harus muncul tanpa error

---

## ⚠️ Troubleshooting

### Backend: Geocoding Tidak Bekerja

**Error:** `GOOGLE_MAPS_API_KEY tidak ditemukan`

**Solusi:**
1. ✅ Pastikan `GOOGLE_MAPS_API_KEY` sudah di-set di Railway
2. ✅ Cek variable name (harus exact: `GOOGLE_MAPS_API_KEY`)
3. ✅ Redeploy setelah set variable

**Error:** `REQUEST_DENIED` atau `API key not valid`

**Solusi:**
1. ✅ Pastikan API key benar
2. ✅ Pastikan Geocoding API sudah di-enable
3. ✅ Cek API restrictions (jika ada)
4. ✅ Cek billing (Google Maps perlu billing enabled, tapi ada free tier)

### Frontend: Peta Tidak Muncul

**Error:** `Google Maps API key not found`

**Solusi:**
1. ✅ Pastikan `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` sudah di-set di Vercel
2. ✅ Pastikan prefix `NEXT_PUBLIC_` ada
3. ✅ Redeploy setelah set variable
4. ✅ Cek browser console untuk error detail

**Error:** `RefererNotAllowedMapError`

**Solusi:**
1. ✅ Cek HTTP referrer restrictions di Google Cloud Console
2. ✅ Pastikan domain Vercel sudah ditambahkan:
   - `https://*.vercel.app/*`
   - `https://laporin.vercel.app/*`
   - `http://localhost:3000/*` (untuk development)

**Error:** `This API project is not authorized to use this API`

**Solusi:**
1. ✅ Enable Maps JavaScript API di Google Cloud Console
2. ✅ Enable Geocoding API (jika digunakan)
3. ✅ Enable Places API (jika digunakan)

---

## 💰 Pricing & Billing

### Free Tier (Google Maps):

- ✅ **$200 credit per bulan** (gratis)
- ✅ Cukup untuk:
  - ~28,000 peta loads
  - ~40,000 geocoding requests
  - ~17,000 places requests

### Enable Billing:

1. Google Cloud Console → **Billing**
2. Link credit card (tidak akan di-charge selama masih dalam free tier)
3. Set budget alert (optional)

**Catatan:** Google Maps API **WAJIB** enable billing, tapi ada free tier $200/month yang cukup untuk development dan production kecil.

---

## 📝 Checklist Setup

### Backend (Railway):
- [ ] Dapatkan Google Maps API Key
- [ ] Enable Geocoding API
- [ ] Set `GOOGLE_MAPS_API_KEY` di Railway
- [ ] Test geocoding dari Railway shell
- [ ] Cek logs untuk error

### Frontend (Vercel):
- [ ] Enable Maps JavaScript API
- [ ] Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` di Vercel
- [ ] Set HTTP referrer restrictions
- [ ] Redeploy frontend
- [ ] Test peta muncul di browser
- [ ] Cek browser console untuk error

---

## 🎯 Quick Setup Summary

### 1. Dapatkan API Key:
- Buka: https://console.cloud.google.com
- Create project → Enable APIs → Create API Key

### 2. Set di Railway:
```
GOOGLE_MAPS_API_KEY=your_key_here
```

### 3. Set di Vercel:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

### 4. Restrict API Key:
- HTTP referrers: `https://*.vercel.app/*`
- APIs: Maps JavaScript API, Geocoding API

### 5. Test:
- Backend: Test geocoding
- Frontend: Buka halaman peta

---

## ✅ Summary

**Google Maps API Setup:**
- ✅ **Backend (Railway):** `GOOGLE_MAPS_API_KEY` - untuk geocoding
- ✅ **Frontend (Vercel):** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - untuk peta
- ✅ Bisa pakai API key yang sama atau terpisah
- ✅ Enable billing (ada free tier $200/month)
- ✅ Restrict API key untuk keamanan

**Need Help?**
- Google Maps Docs: https://developers.google.com/maps/documentation
- Google Cloud Console: https://console.cloud.google.com

