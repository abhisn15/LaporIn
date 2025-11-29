# 🔧 Fix Railway Dockerfile Configuration

Panduan perbaikan konfigurasi Dockerfile untuk Railway backend deployment.

---

## 🐛 Masalah yang Ditemukan

Railway membaca `Dockerfile` dari **root** project, bukan dari folder `backend/`. Ini menyebabkan:
- ❌ Railway build frontend Next.js (yang ada di root)
- ❌ Start command `npm run start` menjalankan Next.js, bukan backend
- ❌ Error: `next: not found` atau aplikasi crash

---

## ✅ Solusi yang Diterapkan

### 1. Update Dockerfile di Root

`Dockerfile` di root sekarang **khusus untuk backend**, bukan frontend:

```dockerfile
# Dockerfile untuk LaporIn Backend
FROM node:20-alpine

# Install dependencies untuk canvas dan native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

# Set working directory
WORKDIR /app

# Copy package files dari backend
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy Prisma schema
COPY backend/prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy seluruh kode backend
COPY backend .

# Create uploads directory
RUN mkdir -p uploads/faces

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server backend
CMD ["node", "server.js"]
```

**Perubahan utama:**
- ✅ Build dari folder `backend/`, bukan root
- ✅ Copy `backend/package*.json` dan install dependencies
- ✅ Copy seluruh kode backend
- ✅ Start command: `node server.js` (backend server)

---

### 2. Start Command di Railway

Di Railway Dashboard → Service → Settings → Deploy:

**Start Command:** `node server.js`

Atau jika menggunakan `railway.json`:
```json
{
  "deploy": {
    "startCommand": "node server.js"
  }
}
```

**Catatan:**
- ✅ `backend/package.json` sudah punya script `"start": "node server.js"`
- ✅ Bisa pakai `npm start` atau `node server.js` (keduanya sama)

---

### 3. Verifikasi Konfigurasi

#### A. Check Dockerfile

Pastikan `Dockerfile` di root:
- ✅ Build dari `backend/` folder
- ✅ Copy `backend/package*.json`
- ✅ CMD: `["node", "server.js"]`

#### B. Check backend/package.json

Pastikan ada script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

#### C. Check backend/server.js

Pastikan menggunakan PORT dari env:
```javascript
const PORT = process.env.PORT || 3001;
server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
```

---

## 🚀 Deployment Steps

### 1. Commit & Push Perubahan

```bash
git add Dockerfile
git commit -m "Fix Dockerfile: Build backend from backend/ folder for Railway"
git push origin main
```

### 2. Di Railway Dashboard

1. **Service Settings:**
   - Pastikan **Builder:** `DOCKERFILE`
   - Pastikan **Dockerfile path:** `Dockerfile` (root)
   - Pastikan **Start command:** `node server.js`

2. **Redeploy:**
   - Klik **Redeploy** di Deployments
   - Atau Railway akan auto-deploy setelah push

3. **Check Logs:**
   - Buka **Deploy Logs** atau **Logs**
   - Harus muncul: `🚀 Server running on http://0.0.0.0:3001`
   - Bukan lagi: `next: not found`

---

## ✅ Verifikasi Setelah Fix

### 1. Check Build Logs

Harus muncul:
```
✓ Installing dependencies
✓ Generating Prisma Client
✓ Copying backend files
```

**Tidak boleh muncul:**
```
✗ next build
✗ next: not found
```

### 2. Check Deploy Logs

Harus muncul:
```
🚀 Server running on http://0.0.0.0:3001
📡 Socket.io ready for real-time updates
```

**Tidak boleh muncul:**
```
> next start
sh: next: not found
```

### 3. Test API

```bash
curl https://your-backend-url.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "LaporIn API is running"
}
```

---

## 🔄 Alternatif: Gunakan backend/Dockerfile

Jika ingin Railway menggunakan `backend/Dockerfile` langsung:

1. **Hapus Dockerfile dari root** (atau rename ke `Dockerfile.frontend`)

2. **Di Railway Dashboard:**
   - Settings → Build
   - Set **Root Directory:** `backend`
   - Railway akan otomatis detect `backend/Dockerfile`

3. **Atau via railway.json:**
   ```json
   {
     "build": {
       "builder": "DOCKERFILE",
       "dockerfilePath": "backend/Dockerfile"
     }
   }
   ```

**Note:** Solusi saat ini (Dockerfile di root yang build backend) lebih simple dan tidak perlu set root directory.

---

## 📋 Checklist

- [ ] Dockerfile di root sudah build backend (bukan frontend)
- [ ] Start command di Railway: `node server.js`
- [ ] `backend/package.json` punya script `"start": "node server.js"`
- [ ] `backend/server.js` menggunakan `process.env.PORT`
- [ ] Build logs menunjukkan build backend (bukan Next.js)
- [ ] Deploy logs menunjukkan `Server running on port 3001`
- [ ] API health check berhasil

---

## 🎯 Summary

**Masalah:**
- Railway membaca Dockerfile dari root (untuk frontend Next.js)
- Start command menjalankan Next.js, bukan backend

**Solusi:**
- ✅ Update Dockerfile di root untuk build backend dari `backend/` folder
- ✅ Start command: `node server.js` (backend server)
- ✅ Railway akan build dan run backend dengan benar

**Hasil:**
- ✅ Backend berjalan di Railway
- ✅ API accessible di `https://your-backend-url.up.railway.app`
- ✅ Frontend tetap di Vercel (tidak terpengaruh)

---

**Need Help?** Check `RAILWAY_DEPLOYMENT_GUIDE.md` untuk panduan lengkap.

