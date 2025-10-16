-- Auto-initialize database schema
-- This file will be run automatically on first deployment

-- Drop existing tables (safe for fresh start)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS shared_files CASCADE;
DROP TABLE IF EXISTS team_folders CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create tables
CREATE TABLE IF NOT EXISTS subscription_plans (
  id SERIAL PRIMARY KEY,
  plan_name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  storage_limit BIGINT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  storage_used BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  object_key VARCHAR(500) NOT NULL UNIQUE,
  mime_type VARCHAR(100),
  size BIGINT NOT NULL,
  is_shared BOOLEAN DEFAULT FALSE,
  folder_id INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shared_files (
  id SERIAL PRIMARY KEY,
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  shared_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  share_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_folders (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  folder_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'manual_transfer',
  payment_proof_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(100) UNIQUE,
  notes TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_files_token ON shared_files(share_token);
CREATE INDEX IF NOT EXISTS idx_team_folders_owner_id ON team_folders(owner_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Insert default plans (only if not exists)
INSERT INTO subscription_plans (plan_name, display_name, storage_limit, price, features)
SELECT * FROM (VALUES
  ('free', 'Free Plan', 5368709120, 0, '["upload", "download", "delete"]'::jsonb),
  ('pro', 'Pro Plan', 53687091200, 50000, '["upload", "download", "delete", "share_file", "auto_backup"]'::jsonb),
  ('business', 'Business Plan', 214748364800, 200000, '["upload", "download", "delete", "share_file", "auto_backup", "team_folder", "statistics"]'::jsonb),
  ('enterprise', 'Enterprise Plan', -1, 500000, '["upload", "download", "delete", "share_file", "auto_backup", "team_folder", "statistics", "internal_employee", "api_integration"]'::jsonb)
) AS v(plan_name, display_name, storage_limit, price, features)
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE subscription_plans.plan_name = v.plan_name);
