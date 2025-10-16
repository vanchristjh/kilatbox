# 🚀 Deploy Exora ID ke CloudKilat - Panduan Lengkap

## 📋 Tentang CloudKilat Hosting

CloudKilat menyediakan beberapa opsi hosting:
- **Cloud VPS** - Virtual Private Server (Recommended)
- **Cloud Server** - Dedicated resources
- **Kubernetes** - Container orchestration

Untuk Exora ID, kita akan gunakan **Cloud VPS** karena:
- ✅ Lebih terjangkau
- ✅ Full control
- ✅ Mudah dikonfigurasi
- ✅ Cocok untuk Node.js app

---

## 💰 Estimasi Biaya CloudKilat VPS

### Paket Recommended untuk Exora ID:

**VPS Small (Recommended untuk mulai):**
- 1 vCPU
- 2 GB RAM
- 40 GB SSD
- **Harga: ~Rp 75.000 - 150.000/bulan**

**VPS Medium (Untuk production dengan traffic tinggi):**
- 2 vCPU
- 4 GB RAM
- 80 GB SSD
- **Harga: ~Rp 150.000 - 300.000/bulan**

---

## 🎯 LANGKAH 1: Order CloudKilat VPS (10 menit)

### 1.1 Buka CloudKilat Panel

1. **Login ke:** https://panel.cloudkilat.com
2. **Masuk dengan akun yang sama** untuk storage

### 1.2 Order VPS

1. **Klik "Cloud VPS"** atau **"Compute"** di menu

2. **Pilih "Create VPS"** atau **"New Instance"**

3. **Konfigurasi VPS:**

   **Operating System:**
   - Pilih: **Ubuntu 22.04 LTS** (Recommended)
   - Atau: Ubuntu 20.04 LTS

   **Instance Type:**
   - **Small:** 1 vCPU, 2GB RAM (untuk testing/small traffic)
   - **Medium:** 2 vCPU, 4GB RAM (untuk production)

   **Storage:**
   - Minimal 40GB SSD

   **Region:**
   - **Jakarta** (id-jkt-1) - Recommended untuk Indonesia

   **SSH Key:**
   - Generate SSH key atau gunakan password
   - **PENTING:** Simpan SSH key/password dengan aman!

   **Hostname:**
   - Contoh: `Exora ID-server` atau `Exora ID-prod`

4. **Klik "Create"** atau **"Deploy"**

5. **Tunggu 2-5 menit** untuk VPS provisioning

### 1.3 Catat Informasi VPS

Setelah VPS ready, catat:
- ✅ **IP Address** (contoh: `103.xxx.xxx.xxx`)
- ✅ **Username** (biasanya: `root` atau `ubuntu`)
- ✅ **Password/SSH Key**

---

## 🎯 LANGKAH 2: Akses VPS via SSH (5 menit)

### 2.1 Connect ke VPS

**Windows (PowerShell):**
```powershell
# Ganti IP_ADDRESS dengan IP VPS Anda
ssh root@IP_ADDRESS

# Atau jika pakai key
ssh -i path/to/key.pem root@IP_ADDRESS
```

**Masukkan password jika diminta**

### 2.2 Update System

Setelah login, update system:

```bash
# Update package list
sudo apt update

# Upgrade packages
sudo apt upgrade -y
```

---

## 🎯 LANGKAH 3: Install Dependencies (15 menit)

### 3.1 Install Node.js

```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 3.2 Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
sudo systemctl status postgresql
```

### 3.3 Install Git

```bash
sudo apt install -y git
```

### 3.4 Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify
pm2 --version
```

### 3.5 Install Nginx (Web Server)

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
```

---

## 🎯 LANGKAH 4: Setup Database PostgreSQL (10 menit)

### 4.1 Create Database dan User

```bash
# Switch to postgres user
sudo -u postgres psql

# Di PostgreSQL prompt, jalankan:
```

```sql
-- Create database
CREATE DATABASE Exora ID;

-- Create user dengan password kuat
CREATE USER Exora ID_user WITH PASSWORD 'YOUR_STRONG_PASSWORD_HERE';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE Exora ID TO Exora ID_user;

-- Keluar
\q
```

### 4.2 Configure PostgreSQL untuk Remote Access

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Tambahkan line ini:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   Exora ID        Exora ID_user                           md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 4.3 Test Connection

```bash
psql -U Exora ID_user -d Exora ID -h localhost
# Masukkan password yang tadi dibuat
```

---

## 🎯 LANGKAH 5: Deploy Aplikasi (15 menit)

### 5.1 Clone Repository

```bash
# Buat directory untuk aplikasi
cd /var/www
sudo mkdir -p Exora ID

# Ubah ownership
sudo chown -R $USER:$USER /var/www/Exora ID

# Clone dari GitHub
cd /var/www
git clone https://github.com/vanchristjh/Exora ID.git

cd Exora ID
```

### 5.2 Install Dependencies

```bash
# Install npm packages
npm install --production
```

### 5.3 Create .env File

```bash
# Create .env file
nano .env
```

**Paste konfigurasi ini (ganti dengan nilai Anda):**

```bash
# CloudKilat Storage Configuration
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=Hml1ntk1WEUwyKr8lZZJkjFm1pQI4AEcx28LAvZL
S3_BUCKET_NAME=Exora ID-storage

# JWT Secret (Generate dengan: node generate-secret.js)
JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE

# Database Configuration
DATABASE_URL=postgresql://Exora ID_user:YOUR_DB_PASSWORD@localhost:5432/Exora ID

# Server Configuration
PORT=3000
NODE_ENV=production
```

**Save:** `Ctrl+X`, `Y`, `Enter`

### 5.4 Generate JWT Secret

```bash
# Generate JWT secret
node generate-secret.js

# Copy hasil dan update di .env
nano .env
# Update JWT_SECRET dengan hasil generate
```

### 5.5 Setup Database Schema

```bash
# Import schema
psql -U Exora ID_user -d Exora ID -h localhost -f schema.sql
# Masukkan password database
```

### 5.6 Test Application

```bash
# Test jalankan aplikasi
node server.js

# Jika berhasil, Ctrl+C untuk stop
```

---

## 🎯 LANGKAH 6: Setup PM2 (Process Manager) (5 menit)

### 6.1 Start dengan PM2

```bash
# Start aplikasi dengan PM2
pm2 start server.js --name Exora ID

# Setup auto-start on reboot
pm2 startup systemd
# Copy dan jalankan command yang muncul

# Save PM2 process list
pm2 save
```

### 6.2 Monitor Application

```bash
# Check status
pm2 status

# View logs
pm2 logs Exora ID

# Monitor real-time
pm2 monit
```

---

## 🎯 LANGKAH 7: Configure Nginx (15 menit)

### 7.1 Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/Exora ID
```

**Paste konfigurasi ini:**

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client body size (untuk upload file)
    client_max_body_size 100M;

    # Proxy ke Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout untuk upload file besar
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }

    # Logs
    access_log /var/log/nginx/Exora ID_access.log;
    error_log /var/log/nginx/Exora ID_error.log;
}
```

**Ganti `YOUR_DOMAIN_OR_IP`** dengan:
- IP VPS Anda (contoh: `103.xxx.xxx.xxx`), atau
- Domain Anda (jika sudah punya)

**Save:** `Ctrl+X`, `Y`, `Enter`

### 7.2 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/Exora ID /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🎯 LANGKAH 8: Setup Firewall (5 menit)

### 8.1 Configure UFW

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (untuk nanti)
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

## 🎯 LANGKAH 9: Setup SSL/HTTPS (10 menit)

### 9.1 Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2 Get SSL Certificate

**Jika punya domain:**

```bash
# Ganti YOUR_DOMAIN dengan domain Anda
sudo certbot --nginx -d YOUR_DOMAIN
```

Ikuti instruksi:
- Masukkan email
- Setuju terms
- Pilih redirect HTTP ke HTTPS (recommended)

**Certificate akan auto-renew!**

---

## 🎉 LANGKAH 10: TEST APLIKASI LIVE!

### 10.1 Akses Aplikasi

**Buka browser:**
```
http://YOUR_VPS_IP
```

Atau jika sudah setup SSL:
```
https://YOUR_DOMAIN
```

### 10.2 Test Semua Fitur

1. ✅ **Health Check:**
   ```
   http://YOUR_IP/api/health
   ```

2. ✅ **Register User:**
   - Buka aplikasi
   - Register user baru

3. ✅ **Login:**
   - Login dengan user

4. ✅ **Upload File:**
   - Upload file test
   - Verify tersimpan di CloudKilat

5. ✅ **Download & Delete:**
   - Download file
   - Delete file

---

## 📊 Monitoring & Maintenance

### Check Logs

```bash
# PM2 logs
pm2 logs Exora ID

# Nginx access logs
sudo tail -f /var/log/nginx/Exora ID_access.log

# Nginx error logs
sudo tail -f /var/log/nginx/Exora ID_error.log
```

### Monitor Resources

```bash
# PM2 monitoring
pm2 monit

# System resources
htop
# Install dulu: sudo apt install htop

# Disk usage
df -h

# Memory usage
free -h
```

### Restart Services

```bash
# Restart aplikasi
pm2 restart Exora ID

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 🔄 Update Aplikasi

### Cara Update Code:

```bash
# Go to app directory
cd /var/www/Exora ID

# Pull latest code
git pull origin main

# Install new dependencies (jika ada)
npm install --production

# Restart dengan PM2
pm2 restart Exora ID
```

---

## 💾 Backup Database

### Manual Backup:

```bash
# Backup database
pg_dump -U Exora ID_user -h localhost Exora ID > backup_$(date +%Y%m%d).sql

# Compress backup
gzip backup_$(date +%Y%m%d).sql
```

### Automated Backup (Cron):

```bash
# Edit crontab
crontab -e

# Tambahkan line ini (backup setiap hari jam 2 pagi):
0 2 * * * pg_dump -U Exora ID_user -h localhost Exora ID | gzip > /var/backups/Exora ID_$(date +\%Y\%m\%d).sql.gz
```

---

## 🆘 Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs Exora ID --lines 100

# Check .env file
cat .env

# Test manual
node server.js
```

### Database Connection Error

```bash
# Check PostgreSQL running
sudo systemctl status postgresql

# Test connection
psql -U Exora ID_user -d Exora ID -h localhost
```

### Nginx 502 Error

```bash
# Check PM2 status
pm2 status

# Check Nginx error log
sudo tail -50 /var/log/nginx/Exora ID_error.log

# Restart both
pm2 restart Exora ID
sudo systemctl restart nginx
```

### High Memory Usage

```bash
# Check memory
free -h

# Restart PM2
pm2 restart Exora ID

# If needed, upgrade VPS plan
```

---

## 📈 Performance Optimization

### Enable Gzip in Nginx

Sudah included di config, tapi bisa optimize lebih:

```bash
sudo nano /etc/nginx/nginx.conf
```

Uncomment atau tambah:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### PM2 Cluster Mode

Untuk multi-core CPU:

```bash
pm2 delete Exora ID
pm2 start server.js --name Exora ID -i max
pm2 save
```

---

## 💰 Estimasi Biaya Total

### Setup Awal:
- CloudKilat VPS Small: **Rp 75.000 - 150.000/bulan**
- CloudKilat Storage: **Gratis** untuk storage yang dipakai
- Domain (optional): **Rp 100.000 - 200.000/tahun**

### Total per Bulan:
- **Minimal: ~Rp 75.000/bulan**
- **Recommended: ~Rp 150.000/bulan**

Jauh lebih murah dari kebanyakan cloud provider internasional!

---

## ✅ Checklist Deployment

- [ ] VPS CloudKilat ordered dan running
- [ ] SSH access berhasil
- [ ] Node.js, PostgreSQL, Nginx installed
- [ ] Database created dan configured
- [ ] Application cloned dan dependencies installed
- [ ] .env file configured dengan benar
- [ ] Database schema imported
- [ ] PM2 setup dan auto-start enabled
- [ ] Nginx configured dan running
- [ ] Firewall configured
- [ ] SSL certificate installed (jika punya domain)
- [ ] Application tested dan working
- [ ] Monitoring setup
- [ ] Backup strategy configured

---

## 🎉 CONGRATULATIONS!

**Exora ID sekarang LIVE di CloudKilat VPS!**

### Yang Sudah Dicapai:
✅ Full control atas server
✅ Production-ready setup
✅ SSL/HTTPS (jika punya domain)
✅ Auto-restart on crash
✅ Professional deployment
✅ Monitoring & logs
✅ Backup strategy

---

## 📞 Support

**CloudKilat Support:**
- Website: https://cloudkilat.com
- Email: support@cloudkilat.com
- Live Chat: Di panel CloudKilat

**Dokumentasi Project:**
- `DEPLOYMENT_GUIDE.md` - Alternative platforms
- `SECURITY_CHECKLIST.md` - Security best practices
- `nginx.conf` - Nginx config example

---

**Happy Hosting with CloudKilat! 🚀**

*Exora ID CloudKilat Deployment Guide*
*October 2025*
