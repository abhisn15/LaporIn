# LaporIn - Platform Laporan Warga RT/RW dengan AI & Blockchain

Platform untuk mengelola laporan warga di level RT/RW dengan integrasi AI untuk klasifikasi dan prioritas, serta Blockchain untuk audit trail dan transparansi.

## 🏗️ Struktur Project

```
laporin/
├── backend/          # Express.js API Server
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── services/     # AI & Blockchain services
│   └── database/     # Database schema & connection
├── blockchain/       # Smart Contracts (Hardhat)
│   ├── contracts/    # Solidity contracts
│   └── scripts/      # Deployment scripts
└── app/              # Next.js Frontend
    ├── login/        # Login page
    ├── dashboard/    # Dashboard page
    └── reports/      # Report detail pages
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm atau yarn

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan konfigurasi database dan API keys
npm run dev
```

### 2. Setup Database

```bash
# Buat database PostgreSQL
createdb wargalapor

# Jalankan schema
psql wargalapor < database/schema.sql
```

### 3. Setup Blockchain

```bash
cd blockchain
npm install
# Edit .env dengan RPC URL dan private key
npm run compile
npm run deploy
```

### 4. Setup Frontend

```bash
# Di root directory
npm install
npm run dev
```

## 📝 Environment Variables

### Backend (.env)

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wargalapor
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your_key
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_contract_address
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎯 Fitur Utama

- ✅ **Laporan Warga**: Buat dan kelola laporan infrastruktur, sosial, administrasi
- ✅ **AI Processing**: Klasifikasi otomatis, prioritas, dan ringkasan
- ✅ **Blockchain Audit**: Audit trail transparan untuk semua laporan
- ✅ **Dashboard Pengurus**: Kelola laporan dan update status
- ✅ **Timeline**: Track progress setiap laporan

## 📅 Roadmap 19 Hari

- **Hari 1-2**: Setup & Planning
- **Hari 3-7**: Backend Core (Database, Auth, API)
- **Hari 8-12**: Frontend Core (UI, Components)
- **Hari 13-15**: AI Integration
- **Hari 16-17**: Blockchain Integration
- **Hari 18-19**: Testing & Polish

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, PostgreSQL, JWT
- **AI**: OpenAI GPT-3.5
- **Blockchain**: Hardhat, Solidity, Polygon Mumbai

## 📚 Dokumentasi

Lihat file `ROADMAP.md` untuk detail lengkap implementasi.

## 👥 Team

- Abhi
- Ghiffari
- Dyandra
- Faris
