# 🔧 Fix Vercel Deployment Error: "next: not found"

## Masalah
Error `sh: next: not found` muncul saat deployment di Vercel.

## Penyebab
1. **`output: 'standalone'` di `next.config.ts`** - Ini untuk Docker, bukan Vercel
2. **Install command tidak optimal** - Perlu `npm ci` untuk production
3. **Tidak ada engines specification** - Node version tidak jelas

## Solusi yang Sudah Diterapkan

### 1. Perbaikan `next.config.ts`
```typescript
// Sebelum (SALAH):
output: 'standalone', // Untuk Docker deployment

// Sesudah (BENAR):
// Hanya set standalone jika DOCKER_BUILD env var ada
...(process.env.DOCKER_BUILD === 'true' ? { output: 'standalone' as const } : {}),
```

### 2. Perbaikan `package.json`
```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

### 3. Perbaikan `vercel.json`
```json
{
  "installCommand": "npm ci",  // Lebih reliable untuk production
  "buildCommand": "npm ci && npm run build"
}
```

## Langkah Selanjutnya

1. **Redeploy di Vercel:**
   - Vercel Dashboard → Deployments → Pilih deployment terbaru
   - Klik "Redeploy"
   - Atau push perubahan baru ke GitHub (auto-deploy)

2. **Pastikan Environment Variables:**
   - `NEXT_PUBLIC_API_URL` sudah di-set
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)

3. **Cek Build Logs:**
   - Pastikan `npm ci` berhasil
   - Pastikan `npm run build` berhasil
   - Pastikan tidak ada error "next: not found"

## Catatan
- Vercel otomatis detect Next.js dan handle deployment
- Tidak perlu `output: 'standalone'` untuk Vercel
- `npm ci` lebih reliable daripada `npm install` untuk production

