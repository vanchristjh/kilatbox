-- Database Schema for KilatBox
-- Sistem Manajemen File Berbasis Cloud dengan Subscription Plans

-- Drop tables if exists (untuk reset)
DROP TABLE IF EXISTS shared_files CASCADE;
DROP TABLE IF EXISTS team_folders CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabel Subscription Plans
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  plan_name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  storage_limit BIGINT NOT NULL, -- dalam bytes, -1 untuk unlimited
  price DECIMAL(10,2) DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb, -- Array fitur yang tersedia
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  storage_used BIGINT DEFAULT 0, -- dalam bytes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel User Subscriptions
CREATE TABLE user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- NULL untuk unlimited/free plan
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id)
);

-- Tabel Files
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  object_key VARCHAR(500) NOT NULL UNIQUE, -- S3 object key
  mime_type VARCHAR(100),
  size BIGINT NOT NULL, -- dalam bytes
  is_shared BOOLEAN DEFAULT FALSE,
  folder_id INTEGER, -- untuk team folder (Business+)
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Shared Files (Pro+)
CREATE TABLE shared_files (
  id SERIAL PRIMARY KEY,
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  shared_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  share_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Team Folders (Business+)
CREATE TABLE team_folders (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  folder_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Payments
CREATE TABLE payments (
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
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_shared_files_token ON shared_files(share_token);
CREATE INDEX idx_team_folders_owner_id ON team_folders(owner_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_name, display_name, storage_limit, price, features) VALUES
('free', 'Free Plan', 5368709120, 0, '["upload", "download", "delete"]'::jsonb),
('pro', 'Pro Plan', 53687091200, 50000, '["upload", "download", "delete", "share_file", "auto_backup"]'::jsonb),
('business', 'Business Plan', 214748364800, 200000, '["upload", "download", "delete", "share_file", "auto_backup", "team_folder", "statistics"]'::jsonb),
('enterprise', 'Enterprise Plan', -1, 500000, '["upload", "download", "delete", "share_file", "auto_backup", "team_folder", "statistics", "internal_employee", "api_integration"]'::jsonb);

-- Informasi
COMMENT ON TABLE users IS 'Tabel untuk menyimpan data pengguna';
COMMENT ON TABLE subscription_plans IS 'Tabel untuk menyimpan jenis-jenis subscription plan';
COMMENT ON TABLE user_subscriptions IS 'Tabel untuk menyimpan subscription aktif user';
COMMENT ON TABLE files IS 'Tabel untuk menyimpan metadata file yang disimpan di CloudKilat Storage';
COMMENT ON TABLE shared_files IS 'Tabel untuk menyimpan informasi file yang dibagikan (Pro+)';
COMMENT ON TABLE team_folders IS 'Tabel untuk menyimpan folder tim (Business+)';
COMMENT ON TABLE payments IS 'Tabel untuk menyimpan histori pembayaran user';
COMMENT ON COLUMN users.storage_used IS 'Total storage yang sudah digunakan dalam bytes';
COMMENT ON COLUMN subscription_plans.storage_limit IS 'Batas maksimal storage dalam bytes, -1 untuk unlimited';
COMMENT ON COLUMN files.object_key IS 'Unique key untuk object di S3 CloudKilat Storage';
