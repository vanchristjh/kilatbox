-- Migration untuk menambahkan tabel payments
-- Jalankan: psql -U postgres -d Exora ID -f add_payments_table.sql

-- Tabel Payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'manual_transfer', -- manual_transfer, ewallet, credit_card
  payment_proof_url VARCHAR(500), -- URL bukti transfer (opsional)
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, completed
  transaction_id VARCHAR(100) UNIQUE,
  notes TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Comment
COMMENT ON TABLE payments IS 'Tabel untuk menyimpan histori pembayaran user';
COMMENT ON COLUMN payments.payment_method IS 'Metode pembayaran: manual_transfer, ewallet, credit_card';
COMMENT ON COLUMN payments.status IS 'Status pembayaran: pending, approved, rejected, completed';
COMMENT ON COLUMN payments.transaction_id IS 'ID transaksi unik yang digenerate otomatis';

-- Success message
SELECT 'Tabel payments berhasil dibuat!' as message;
