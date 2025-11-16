# LaporIn Backend

Express.js API server untuk LaporIn platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
# Edit .env dengan konfigurasi yang sesuai
```

3. Setup database:
```bash
# Buat database PostgreSQL
createdb wargalapor

# Jalankan schema
psql wargalapor < database/schema.sql
```

4. Run development server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Reports
- `POST /api/reports` - Buat laporan baru
- `GET /api/reports` - Get semua laporan (dengan filter)
- `GET /api/reports/:id` - Get detail laporan
- `PATCH /api/reports/:id/status` - Update status laporan (pengurus only)

### Health
- `GET /api/health` - Health check

