-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'warga', 'pengurus', 'admin'
  rt_rw VARCHAR(50), -- 'RT001/RW005'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100), -- 'infrastruktur', 'sosial', 'administrasi', 'bantuan'
  urgency VARCHAR(50), -- 'high', 'medium', 'low'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'resolved', 'rejected'
  location VARCHAR(255),
  blockchain_tx_hash VARCHAR(255), -- Hash dari blockchain transaction
  ai_summary TEXT, -- Ringkasan dari AI
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report status history (untuk timeline)
CREATE TABLE report_status_history (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id),
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  updated_by INTEGER REFERENCES users(id),
  blockchain_tx_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bantuan table (untuk bansos)
CREATE TABLE bantuan (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  jenis_bantuan VARCHAR(100) NOT NULL, -- 'sembako', 'tunai', 'kesehatan', dll
  nominal DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'distributed', 'rejected'
  alasan TEXT,
  blockchain_tx_hash VARCHAR(255),
  distributed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI processing log (untuk tracking)
CREATE TABLE ai_processing_log (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id),
  original_text TEXT,
  ai_summary TEXT,
  ai_category VARCHAR(100),
  ai_urgency VARCHAR(50),
  processing_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

