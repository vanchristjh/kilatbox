#!/bin/bash
# CloudKilat VPS - Auto Setup Script untuk Exora ID
# Jalankan setelah SSH ke VPS: bash setup-vps.sh

echo "═══════════════════════════════════════════"
echo "   Exora ID VPS Setup - CloudKilat"
echo "═══════════════════════════════════════════"
echo ""

# Update system
echo "📦 Step 1/7: Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
echo ""
echo "📦 Step 2/7: Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install PostgreSQL
echo ""
echo "📦 Step 3/7: Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
echo "✅ PostgreSQL installed"

# Install Git
echo ""
echo "📦 Step 4/7: Installing Git..."
sudo apt install -y git
echo "✅ Git version: $(git --version)"

# Install PM2
echo ""
echo "📦 Step 5/7: Installing PM2..."
sudo npm install -g pm2
echo "✅ PM2 version: $(pm2 --version)"

# Install Nginx
echo ""
echo "📦 Step 6/7: Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
echo "✅ Nginx installed"

# Install other utilities
echo ""
echo "📦 Step 7/7: Installing utilities..."
sudo apt install -y htop curl wget nano ufw

echo ""
echo "═══════════════════════════════════════════"
echo "   ✅ Setup Dependencies Complete!"
echo "═══════════════════════════════════════════"
echo ""
echo "Installed:"
echo "  - Node.js $(node --version)"
echo "  - NPM $(npm --version)"
echo "  - PostgreSQL"
echo "  - Git $(git --version)"
echo "  - PM2 $(pm2 --version)"
echo "  - Nginx"
echo ""
echo "Next steps:"
echo "  1. Setup database: bash setup-database.sh"
echo "  2. Deploy app: bash deploy-app.sh"
echo ""
