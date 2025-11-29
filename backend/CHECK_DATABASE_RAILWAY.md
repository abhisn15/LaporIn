# 🔍 Cara Check Database di Railway

Panduan lengkap untuk mengecek koneksi dan data database di Railway.

---

## 🚀 Metode 1: Via Railway Terminal (Paling Mudah) ⭐

### A. Via Railway Dashboard Terminal

1. **Buka Railway Dashboard:**
   - Login ke [Railway Dashboard](https://railway.app)
   - Pilih project → Backend Service
   - Klik tab **Deployments** → Pilih deployment terbaru
   - Klik **View Logs** → Klik **Terminal** (atau icon terminal)

2. **Test Koneksi Database:**
   ```bash
   npx prisma db push
   ```
   
   Jika berhasil, akan muncul:
   ```
   ✔ Generated Prisma Client
   ✔ Database schema is up to date
   ```

3. **Check Data di Database:**
   ```bash
   # Check users
   node scripts/view-users.js
   
   # Atau langsung query via Prisma
   node -e "const prisma = require('./database/prisma'); prisma.user.findMany().then(users => console.log(JSON.stringify(users, null, 2))).finally(() => prisma.$disconnect())"
   ```

### B. Via Railway CLI

1. **Install Railway CLI (jika belum):**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Link ke Project:**
   ```bash
   cd backend
   railway link
   ```

3. **Test Koneksi:**
   ```bash
   railway run npx prisma db push
   ```

4. **Check Data:**
   ```bash
   railway run node scripts/view-users.js
   ```

---

## 🌐 Metode 2: Via API Health Check

### Test Health Endpoint

```bash
curl https://your-backend-url.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "LaporIn API is running"
}
```

### Test Database Connection via API

Jika health endpoint sudah include database status, akan muncul:
```json
{
  "status": "ok",
  "message": "LaporIn API is running",
  "database": "connected"
}
```

---

## 🗄️ Metode 3: Check Database Langsung (Railway PostgreSQL)

### A. Via Railway Dashboard

1. **Buka PostgreSQL Service:**
   - Railway Dashboard → PostgreSQL Service
   - Klik tab **Data** atau **Query**

2. **Run Query:**
   ```sql
   -- Check tables
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   
   -- Check users
   SELECT id, email, name, role, "isVerified" 
   FROM users 
   LIMIT 10;
   
   -- Check reports
   SELECT id, title, status, "createdAt" 
   FROM reports 
   ORDER BY "createdAt" DESC 
   LIMIT 10;
   ```

### B. Via Railway Terminal (PostgreSQL CLI)

1. **Connect ke Database:**
   ```bash
   # Via Railway terminal di PostgreSQL service
   psql $DATABASE_URL
   ```

2. **Run SQL Queries:**
   ```sql
   -- List all tables
   \dt
   
   -- Check users
   SELECT * FROM users LIMIT 10;
   
   -- Check reports
   SELECT * FROM reports LIMIT 10;
   
   -- Exit
   \q
   ```

---

## 📊 Metode 4: Via Prisma Studio (Visual Database Browser)

### Setup Prisma Studio di Railway

1. **Via Railway Terminal:**
   ```bash
   # Install Prisma Studio (jika belum)
   npm install -g prisma
   
   # Run Prisma Studio (akan expose di port 5555)
   npx prisma studio --port 5555 --host 0.0.0.0
   ```

2. **Access via Railway Public URL:**
   - Railway akan expose port 5555
   - Buka URL yang diberikan Railway
   - Login dan browse database secara visual

**Note:** Prisma Studio biasanya untuk development lokal. Untuk production, lebih aman pakai Railway terminal atau API.

---

## 🔧 Metode 5: Via Script Custom

### Buat Script Check Database

1. **Buat file `scripts/check-database.js`:**
   ```javascript
   const prisma = require('../database/prisma');
   
   async function checkDatabase() {
     try {
       console.log('🔍 Checking database connection...');
       
       // Test connection
       await prisma.$connect();
       console.log('✅ Database connected!');
       
       // Check tables
       const users = await prisma.user.count();
       const reports = await prisma.report.count();
       
       console.log('\n📊 Database Stats:');
       console.log(`- Users: ${users}`);
       console.log(`- Reports: ${reports}`);
       
       // Check admin kelurahan
       const admin = await prisma.user.findFirst({
         where: { role: 'admin' }
       });
       
       if (admin) {
         console.log(`\n👤 Admin Kelurahan:`);
         console.log(`- Email: ${admin.email}`);
         console.log(`- Name: ${admin.name}`);
         console.log(`- Verified: ${admin.isVerified}`);
       } else {
         console.log('\n⚠️ Admin Kelurahan belum di-seed!');
         console.log('Run: npm run seed:admin-kelurahan');
       }
       
     } catch (error) {
       console.error('❌ Database connection failed:', error.message);
       process.exit(1);
     } finally {
       await prisma.$disconnect();
     }
   }
   
   checkDatabase();
   ```

2. **Run Script:**
   ```bash
   # Via Railway terminal
   node scripts/check-database.js
   
   # Atau via Railway CLI
   railway run node scripts/check-database.js
   ```

---

## ✅ Quick Check Commands

### 1. Test Connection
```bash
railway run npx prisma db push
```

### 2. Check Users
```bash
railway run node scripts/view-users.js
```

### 3. Check Database URL
```bash
# Via Railway terminal
echo $DATABASE_URL

# Atau check di Railway Dashboard → Variables
```

### 4. Test API
```bash
curl https://your-backend-url.up.railway.app/api/health
```

---

## 🔍 Troubleshooting

### Problem: Database Connection Failed

**Error:**
```
Error: Can't reach database server
```

**Solusi:**
1. Cek `DATABASE_URL` di Railway Variables
2. Pastikan PostgreSQL service sudah running
3. Test connection: `railway run npx prisma db push`

### Problem: Schema Not Synced

**Error:**
```
Error: Table 'users' does not exist
```

**Solusi:**
```bash
# Sync schema
railway run npx prisma db push

# Atau dengan migration
railway run npx prisma migrate deploy
```

### Problem: No Data

**Solusi:**
```bash
# Seed admin kelurahan
railway run npm run seed:admin-kelurahan

# Check data
railway run node scripts/view-users.js
```

---

## 📋 Checklist Check Database

- [ ] Database connection test berhasil (`npx prisma db push`)
- [ ] Schema sudah sync dengan database
- [ ] Admin kelurahan sudah di-seed
- [ ] API health check mengembalikan status OK
- [ ] Data bisa di-query (users, reports, dll)

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Test connection | `railway run npx prisma db push` |
| Check users | `railway run node scripts/view-users.js` |
| Seed admin | `railway run npm run seed:admin-kelurahan` |
| Health check | `curl https://your-backend-url.up.railway.app/api/health` |
| View DATABASE_URL | Railway Dashboard → Variables → DATABASE_URL |

---

**Need Help?** Check `RAILWAY_SETUP.md` atau `DATABASE_PRODUCTION_SETUP.md` untuk panduan lengkap.

