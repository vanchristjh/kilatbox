#!/bin/bash
# Deploy Exora ID Application

echo "═══════════════════════════════════════════"
echo "   Deploy Exora ID Application"
echo "═══════════════════════════════════════════"
echo ""

# Clone repository
echo "📥 Cloning repository..."
cd /var/www
sudo mkdir -p Exora ID
sudo chown -R $USER:$USER /var/www/Exora ID
git clone https://github.com/vanchristjh/Exora ID.git
cd Exora ID

echo "✅ Repository cloned"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

echo "✅ Dependencies installed"
echo ""

# Generate JWT Secret
echo "🔐 Generating JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

echo "✅ JWT Secret generated"
echo ""

# Create .env file
echo "📝 Creating .env file..."

# Read DATABASE_URL if exists
if [ -f /tmp/database_url.txt ]; then
    DATABASE_URL=$(cat /tmp/database_url.txt)
else
    echo "⚠️  Database URL not found. Please run setup-database.sh first!"
    exit 1
fi

cat > .env << EOF
# CloudKilat Storage Configuration
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=Hml1ntk1WEUwyKr8lZZJkjFm1pQI4AEcx28LAvZL
S3_BUCKET_NAME=Exora ID-storage

# JWT Secret
JWT_SECRET=$JWT_SECRET

# Database Configuration
DATABASE_URL=$DATABASE_URL

# Server Configuration
PORT=3000
NODE_ENV=production
EOF

echo "✅ .env file created"
echo ""

# Import database schema
echo "🗃️  Importing database schema..."
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

PGPASSWORD=$DB_PASS psql -U $DB_USER -h localhost -d $DB_NAME -f schema.sql

echo "✅ Database schema imported"
echo ""

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start server.js --name Exora ID
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
pm2 save

echo "✅ Application started"
echo ""

# Check status
pm2 status

echo ""
echo "═══════════════════════════════════════════"
echo "   ✅ Application Deployed!"
echo "═══════════════════════════════════════════"
echo ""
echo "Application URL: http://$(curl -s ifconfig.me):3000"
echo ""
echo "Useful commands:"
echo "  - Check logs: pm2 logs Exora ID"
echo "  - Restart: pm2 restart Exora ID"
echo "  - Stop: pm2 stop Exora ID"
echo "  - Monitor: pm2 monit"
echo ""
echo "Next step: Setup Nginx reverse proxy"
echo "  Run: bash setup-nginx.sh"
echo ""
