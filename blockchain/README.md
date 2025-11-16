# LaporIn Blockchain

Smart contracts untuk audit trail dan transparansi laporan warga.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
# Buat .env file dengan:
BLOCKCHAIN_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your_key
PRIVATE_KEY=your_wallet_private_key
```

3. Compile contracts:
```bash
npm run compile
```

4. Deploy contracts:
```bash
npm run deploy
```

Setelah deploy, copy contract address ke backend `.env` sebagai `CONTRACT_ADDRESS`.

## Contracts

### WargaLapor.sol

Smart contract untuk logging events:
- `logReportEvent` - Log perubahan status laporan
- `logBantuanEvent` - Log distribusi bantuan sosial

## Network

Default: Polygon Mumbai Testnet

