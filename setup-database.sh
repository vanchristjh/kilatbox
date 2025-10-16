#!/bin/bash
# Setup PostgreSQL Database untuk Exora ID

echo "═══════════════════════════════════════════"
echo "   PostgreSQL Database Setup"
echo "═══════════════════════════════════════════"
echo ""

# Generate random password
DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-20)

echo "Creating database and user..."
sudo -u postgres psql << EOF
-- Create database
CREATE DATABASE Exora ID;

-- Create user with password
CREATE USER Exora ID_user WITH PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE Exora ID TO Exora ID_user;

-- Verify
\l
EOF

echo ""
echo "✅ Database setup complete!"
echo ""
echo "═══════════════════════════════════════════"
echo "   📝 Save These Credentials!"
echo "═══════════════════════════════════════════"
echo ""
echo "Database: Exora ID"
echo "User: Exora ID_user"
echo "Password: $DB_PASSWORD"
echo ""
echo "DATABASE_URL:"
echo "postgresql://Exora ID_user:$DB_PASSWORD@localhost:5432/Exora ID"
echo ""
echo "⚠️  SAVE THIS PASSWORD! You'll need it for .env file"
echo ""

# Save to file
echo "postgresql://Exora ID_user:$DB_PASSWORD@localhost:5432/Exora ID" > /tmp/database_url.txt
echo "✅ DATABASE_URL saved to: /tmp/database_url.txt"
echo ""
