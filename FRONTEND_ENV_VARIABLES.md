# 🌐 Environment Variables untuk Frontend

Panduan lengkap environment variables yang diperlukan untuk frontend Next.js di Vercel.

---

## ✅ Variabel yang Diperlukan di Frontend (Vercel)

Frontend **HANYA** perlu 2 variabel berikut:

### 1. `NEXT_PUBLIC_API_URL` ⭐ (Required)

**Deskripsi:** URL backend API (Railway)

**Format:**
```
https://api-weladalah-laporin.up.railway.app
```

**Catatan:**
- ✅ Tanpa trailing slash (`/`)
- ✅ Tanpa `/api` di akhir (akan ditambahkan otomatis di `lib/api.ts`)
- ✅ Harus `NEXT_PUBLIC_` prefix (Next.js requirement untuk client-side)

**Cara Set di Vercel:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add variable:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api-weladalah-laporin.up.railway.app`
   - **Environment:** Production, Preview, Development

**Digunakan di:**
- `lib/api.ts` - API client
- `lib/socket.ts` - Socket.io connection

---

### 2. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Required untuk Maps)

**Deskripsi:** Google Maps API Key untuk menampilkan peta

**Format:**
```
AIzaSyAryzzk5CVzGDowt4AJ1JaDm9QeKrXl30M
```

**Cara Set di Vercel:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add variable:
   - **Name:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value:** `your_google_maps_api_key`
   - **Environment:** Production, Preview, Development

**Digunakan di:**
- `app/admin/peta-laporan/page.tsx` - Peta laporan

---

## ❌ Variabel yang TIDAK Perlu di Frontend

### Variabel Railway (Hanya untuk Backend)

Variabel berikut **TIDAK PERLU** di-set di frontend karena:
- ❌ Hanya tersedia di Railway backend service
- ❌ Frontend di-deploy di Vercel, bukan Railway
- ❌ Tidak digunakan di frontend code

**Variabel yang tidak perlu:**
- `RAILWAY_PUBLIC_DOMAIN`
- `RAILWAY_PRIVATE_DOMAIN`
- `RAILWAY_PROJECT_NAME`
- `RAILWAY_ENVIRONMENT_NAME`
- `RAILWAY_SERVICE_NAME`
- `RAILWAY_PROJECT_ID`
- `RAILWAY_ENVIRONMENT_ID`
- `RAILWAY_SERVICE_ID`
- `DATABASE_URL` (hanya untuk backend)
- `JWT_SECRET` (hanya untuk backend)
- `EMAIL_*` (hanya untuk backend)
- `GROQ_API_KEY` (hanya untuk backend)

---

## 📋 Checklist Environment Variables di Vercel

- [ ] `NEXT_PUBLIC_API_URL` sudah di-set (URL backend Railway)
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` sudah di-set
- [ ] Variabel di-set untuk semua environment (Production, Preview, Development)
- [ ] Frontend sudah di-redeploy setelah set variables

---

## 🔍 Verifikasi Environment Variables

### 1. Check di Vercel Dashboard

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Pastikan kedua variabel ada:
   - ✅ `NEXT_PUBLIC_API_URL`
   - ✅ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 2. Check di Browser Console (Development)

Buka browser console, akan muncul log:
```
[API Config] NEXT_PUBLIC_API_URL: https://api-weladalah-laporin.up.railway.app
[Socket Config] Connecting to: https://api-weladalah-laporin.up.railway.app
```

### 3. Test API Connection

```bash
# Test dari browser console
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
  .then(r => r.json())
  .then(console.log)
```

Expected response:
```json
{
  "status": "ok",
  "message": "LaporIn API is running"
}
```

---

## 🚀 Setup di Vercel

### Via Vercel Dashboard

1. **Login ke Vercel:**
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)

2. **Pilih Project:**
   - Pilih project LaporIn

3. **Settings → Environment Variables:**
   - Klik **Add New**
   - Tambahkan variabel satu per satu

4. **Redeploy:**
   - Setelah set variables, klik **Redeploy** di Deployments

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Masukkan: https://api-weladalah-laporin.up.railway.app

vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY production
# Masukkan: your_google_maps_api_key

# Redeploy
vercel --prod
```

---

## 🔄 Update Environment Variables

Jika perlu update variabel:

1. **Vercel Dashboard:**
   - Settings → Environment Variables
   - Klik **...** di sebelah variabel
   - Pilih **Edit** atau **Delete**

2. **Redeploy:**
   - Setelah update, klik **Redeploy** di Deployments
   - Atau push commit baru ke GitHub (auto-deploy)

---

## ⚠️ Important Notes

1. **`NEXT_PUBLIC_` Prefix:**
   - Next.js hanya expose variabel dengan prefix `NEXT_PUBLIC_` ke client-side
   - Variabel tanpa prefix hanya tersedia di server-side

2. **Security:**
   - `NEXT_PUBLIC_*` variabel akan ter-expose di browser
   - Jangan masukkan secrets/sensitive data di `NEXT_PUBLIC_*`
   - Google Maps API Key harus di-restrict di Google Cloud Console

3. **Build Time:**
   - Environment variables di-inject saat build time
   - Perlu redeploy setelah update variables

---

## 📝 Summary

**Frontend (Vercel) hanya perlu:**
- ✅ `NEXT_PUBLIC_API_URL` - URL backend Railway
- ✅ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API Key

**Tidak perlu:**
- ❌ Variabel Railway (hanya untuk backend)
- ❌ Database variables (hanya untuk backend)
- ❌ JWT_SECRET (hanya untuk backend)
- ❌ Email variables (hanya untuk backend)

---

**Need Help?** Check `VERCEL_DEPLOY_GUIDE.md` untuk panduan deployment lengkap.

