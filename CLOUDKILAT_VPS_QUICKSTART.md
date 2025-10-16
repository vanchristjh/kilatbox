# 🚀 CloudKilat VPS Deployment - Quick Guide

## ✅ Persiapan Selesai!

Semua script automation sudah dibuat! Anda tinggal jalankan step-by-step.

---

## 📋 LANGKAH 1: Order CloudKilat VPS (10 menit)

### 1.1 Login ke CloudKilat

1. **Buka:** https://panel.cloudkilat.com
2. **Login** dengan akun yang sama dengan Storage

### 1.2 Order VPS

1. **Di Panel CloudKilat:**
   - Klik **"Cloud VPS"** atau **"Compute"** di menu sidebar

2. **Pilih Paket VPS:**
   
   **Recommended untuk Exora ID:**
   ```
   Paket: VPS Small
   - 1 vCPU
   - 2 GB RAM
   - 40 GB SSD Storage
   - Harga: ~Rp 75.000 - 150.000/bulan
   ```

3. **Konfigurasi:**
   - **OS:** Ubuntu 22.04 LTS (pilih yang terbaru)
   - **Region:** Jakarta (id-jkt-1)
   - **Hostname:** `Exora ID-server`
   - **SSH Key/Password:** Pilih metode akses

4. **Klik "Create" atau "Deploy"**

5. **Tunggu 2-5 menit** untuk VPS provisioning

### 1.3 Catat Info VPS

Setelah VPS ready, **CATAT INI:**
```
IP Address: ___________________
Username: root (atau ubuntu)
Password/SSH Key: ___________________
```

---

## 📋 LANGKAH 2: Upload Scripts ke VPS (5 menit)

### 2.1 Copy Scripts ke VPS

**Di PowerShell lokal Anda:**

```powershell
# Ganti YOUR_VPS_IP dengan IP VPS Anda
$VPS_IP = "YOUR_VPS_IP"

# Upload semua script
scp setup-vps.sh root@${VPS_IP}:/tmp/
scp setup-database.sh root@${VPS_IP}:/tmp/
scp deploy-app.sh root@${VPS_IP}:/tmp/
scp setup-nginx.sh root@${VPS_IP}:/tmp/
scp setup-firewall.sh root@${VPS_IP}:/tmp/
```

**Masukkan password VPS jika diminta**

### Atau Manual (Alternatif):

1. SSH ke VPS dulu
2. Buat file manual dengan `nano`
3. Copy-paste isi script

---

## 📋 LANGKAH 3: SSH ke VPS (1 menit)

```powershell
# Ganti YOUR_VPS_IP
ssh root@YOUR_VPS_IP
```

**Masukkan password**

Setelah masuk, Anda akan lihat prompt seperti:
```
root@Exora ID-server:~#
```

---

## 📋 LANGKAH 4: Run Setup Scripts (30 menit)

### 4.1 Setup Dependencies

```bash
# Pindah ke /tmp
cd /tmp

# Buat executable
chmod +x *.sh

# Run setup VPS (install Node.js, PostgreSQL, dll)
bash setup-vps.sh
```

**Tunggu 5-10 menit** untuk instalasi semua package.

---

### 4.2 Setup Database

```bash
# Run database setup
bash setup-database.sh
```

**PENTING:** Script akan generate password otomatis!

**COPY & SAVE** output `DATABASE_URL`!

Contoh output:
```
DATABASE_URL:
postgresql://Exora ID_user:abc123xyz456@localhost:5432/Exora ID

⚠️  SAVE THIS PASSWORD!
```

---

### 4.3 Deploy Application

```bash
# Run deploy app
bash deploy-app.sh
```

Script akan:
- Clone repository dari GitHub
- Install dependencies
- Generate JWT secret
- Create .env file
- Import database schema
- Start aplikasi dengan PM2

**Tunggu 5-10 menit**

---

### 4.4 Setup Nginx

```bash
# Setup Nginx reverse proxy
bash setup-nginx.sh
```

Script akan configure Nginx dan restart.

---

### 4.5 Setup Firewall

```bash
# Setup UFW firewall
bash setup-firewall.sh
```

Firewall akan aktif untuk port 22, 80, 443.

---

## 🎉 LANGKAH 5: TEST APLIKASI! (5 menit)

### 5.1 Dapatkan IP VPS Anda

```bash
# Lihat IP public
curl ifconfig.me
```

### 5.2 Test di Browser

**Buka browser dan akses:**
```
http://YOUR_VPS_IP
```

Anda akan lihat halaman **Exora ID**! 🎉

### 5.3 Test API Health

```
http://YOUR_VPS_IP/api/health
```

Harus return JSON:
```json
{
  "success": true,
  "message": "Exora ID API is running"
}
```

### 5.4 Test Register & Login

1. Buka aplikasi: `http://YOUR_VPS_IP`
2. Register user baru
3. Login
4. Upload file test
5. **BERHASIL!** ✅

---

## 📊 Monitoring & Management

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs Exora ID

# Real-time monitoring
pm2 monit
```

### Check Nginx

```bash
# Nginx status
sudo systemctl status nginx

# View access logs
sudo tail -f /var/log/nginx/Exora ID_access.log

# View error logs
sudo tail -f /var/log/nginx/Exora ID_error.log
```

### Check Database

```bash
# Connect to database
psql -U Exora ID_user -d Exora ID -h localhost

# Check tables
\dt

# Exit
\q
```

---

## 🔄 Useful Commands

### Restart Services

```bash
# Restart app
pm2 restart Exora ID

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Update Application

```bash
cd /var/www/Exora ID
git pull origin main
npm install --production
pm2 restart Exora ID
```

### View System Resources

```bash
# Install htop if not exists
sudo apt install htop

# Monitor resources
htop

# Check disk space
df -h

# Check memory
free -h
```

---

## 🌐 Setup Custom Domain (Optional)

### Jika Punya Domain:

1. **Di Domain Provider**, tambah A Record:
   ```
   Type: A
   Name: @ (atau subdomain)
   Value: YOUR_VPS_IP
   TTL: 3600
   ```

2. **Update Nginx Config:**
   ```bash
   sudo nano /etc/nginx/sites-available/Exora ID
   ```
   
   Ganti `server_name` dengan domain Anda:
   ```nginx
   server_name yourdomain.com www.yourdomain.com;
   ```

3. **Install SSL (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

4. **Test:** https://yourdomain.com

---

## 💾 Backup Strategy

### Manual Backup Database

```bash
# Backup database
pg_dump -U Exora ID_user -h localhost Exora ID > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_$(date +%Y%m%d).sql
```

### Auto Backup (Cron)

```bash
# Edit crontab
crontab -e

# Add this line (backup every day at 2 AM):
0 2 * * * pg_dump -U Exora ID_user -h localhost Exora ID | gzip > /var/backups/Exora ID_$(date +\%Y\%m\%d).sql.gz
```

---

## 🆘 Troubleshooting

### App Won't Start

```bash
# Check PM2 logs
pm2 logs Exora ID --lines 50

# Try manual start
cd /var/www/Exora ID
node server.js
```

### Database Connection Error

```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Check connection
psql -U Exora ID_user -d Exora ID -h localhost
```

### Nginx 502 Error

```bash
# Check PM2 running
pm2 status

# Check Nginx logs
sudo tail -50 /var/log/nginx/Exora ID_error.log

# Restart both
pm2 restart Exora ID
sudo systemctl restart nginx
```

---

## 💰 Estimasi Biaya

| Item | Harga/Bulan |
|------|-------------|
| CloudKilat VPS Small | Rp 75.000 - 150.000 |
| CloudKilat Storage (sudah ada) | Included |
| Domain (optional) | Rp 100.000/tahun |
| **Total** | **~Rp 75.000 - 150.000/bulan** |

---

## ✅ Deployment Checklist

- [ ] VPS ordered dan IP obtained
- [ ] SSH access berhasil
- [ ] Scripts uploaded ke VPS
- [ ] Dependencies installed (setup-vps.sh)
- [ ] Database configured (setup-database.sh)
- [ ] Application deployed (deploy-app.sh)
- [ ] Nginx configured (setup-nginx.sh)
- [ ] Firewall enabled (setup-firewall.sh)
- [ ] Application tested dan working
- [ ] Custom domain setup (optional)
- [ ] SSL installed (optional)
- [ ] Backup configured
- [ ] Monitoring setup

---

## 🎉 SUCCESS!

**Exora ID sekarang LIVE di CloudKilat VPS!**

### Your Application:
```
🌐 http://YOUR_VPS_IP
```

### Access From Anywhere:
- ✅ Internet (bukan local)
- ✅ 24/7 uptime
- ✅ Full control
- ✅ Server di Indonesia

---

**Selamat! Aplikasi Anda sudah bisa diakses dari mana saja! 🚀**
