# 🧹 Cleanup Environment Variables di Railway

Daftar environment variables yang **TIDAK PERLU** di-set di Railway karena tidak digunakan di production code.

---

## ❌ Variabel yang Bisa Dihapus dari Railway

Variabel-variabel berikut **HANYA** digunakan di:
- File `backend/database/db.js` (yang hanya digunakan di test files)
- Development lokal (file `.env`)

**Variabel yang bisa dihapus:**
- ❌ `DB_HOST`
- ❌ `DB_PORT`
- ❌ `DB_NAME`
- ❌ `DB_USER`
- ❌ `DB_PASSWORD`

**Alasan:**
- Backend production menggunakan **Prisma** yang hanya butuh `DATABASE_URL`
- Prisma otomatis parse `DATABASE_URL` untuk koneksi database
- `db.js` hanya digunakan di test files, tidak di production routes/services

---

## ✅ Variabel yang Harus Tetap Ada di Railway

**Database:**
- ✅ `DATABASE_URL` (Railway otomatis generate jika pakai Railway PostgreSQL)

**Server:**
- ✅ `PORT` (Railway otomatis set)
- ✅ `NODE_ENV=production`

**Authentication:**
- ✅ `JWT_SECRET`

**Email (untuk OTP):**
- ✅ `EMAIL_HOST`
- ✅ `EMAIL_PORT`
- ✅ `EMAIL_USER`
- ✅ `EMAIL_PASS` (atau `EMAIL_PASSWORD`)

**AI/Chatbot:**
- ✅ `GROQ_API_KEY`

**Google Maps:**
- ✅ `GOOGLE_MAPS_API_KEY`

**Blockchain (optional):**
- ✅ `BLOCKCHAIN_RPC_URL`
- ✅ `PRIVATE_KEY`
- ✅ `CONTRACT_ADDRESS`
- ✅ `USE_MOCK_BLOCKCHAIN`

**Security:**
- ✅ `FACE_ENCRYPTION_KEY`

**Frontend URL (untuk CORS/redirect):**
- ✅ `FRONTEND_URL` (jika diperlukan untuk redirect)

---

## 🎯 Cara Hapus Variabel di Railway

1. Buka **Railway Dashboard** → Backend Service → **Variables**
2. Klik **...** (three dots) di sebelah variabel yang ingin dihapus
3. Pilih **Delete** atau **Remove**
4. Konfirmasi penghapusan

**Variabel yang aman untuk dihapus:**
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

---

## ✅ Checklist Cleanup

- [ ] Hapus `DB_HOST` dari Railway Variables
- [ ] Hapus `DB_PORT` dari Railway Variables
- [ ] Hapus `DB_NAME` dari Railway Variables
- [ ] Hapus `DB_USER` dari Railway Variables
- [ ] Hapus `DB_PASSWORD` dari Railway Variables
- [ ] Pastikan `DATABASE_URL` masih ada (Railway otomatis generate)
- [ ] Test API setelah cleanup: `curl https://your-backend-url.up.railway.app/api/health`

---

## 🔍 Verifikasi Setelah Cleanup

Setelah hapus variabel, test apakah backend masih berjalan:

```bash
# Test health check
curl https://your-backend-url.up.railway.app/api/health

# Test database connection (via Railway terminal)
railway run --service backend npx prisma db push
```

Jika semua test berhasil, berarti cleanup berhasil! ✅

---

## 📝 Catatan

- File `.env` lokal **TETAP** bisa pakai `DB_HOST`, `DB_PORT`, dll untuk development
- Railway production **HANYA** butuh `DATABASE_URL`
- Variabel lain tetap diperlukan sesuai kebutuhan fitur

