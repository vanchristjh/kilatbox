# 🚀 Deploy KilatBox ke Internet - Panduan Lengkap

**Estimasi Waktu: 15-20 menit**
**Platform: Railway.app (Gratis!)**

---

## ✅ Persiapan Selesai!

Yang sudah OK:
- ✅ Testing local berhasil
- ✅ Database PostgreSQL working
- ✅ CloudKilat Storage ready
- ✅ Semua file konfigurasi sudah siap

---

## 🎯 Langkah 1: Setup Git & GitHub (5 menit)

### 1.1 Initialize Git Repository

Buka PowerShell di folder project dan jalankan:

```powershell
cd D:\PROJECT\ITB\kilatbox

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - KilatBox ready for deployment"
```

### 1.2 Buat Repository di GitHub

1. **Buka GitHub:** https://github.com/new

2. **Isi Form:**
   - Repository name: `kilatbox` (atau nama lain)
   - Description: `Cloud Storage Management System with CloudKilat`
   - Visibility: **Private** (recommended untuk production)
   - **JANGAN centang** "Initialize with README" (sudah ada)

3. **Klik "Create repository"**

### 1.3 Push ke GitHub

Setelah repository dibuat, GitHub akan tampilkan instruksi. Gunakan yang ini:

```powershell
# Add remote (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/kilatbox.git

# Rename branch ke main
git branch -M main

# Push
git push -u origin main
```

**Login GitHub jika diminta!**

---

## 🎯 Langkah 2: Deploy ke Railway (5 menit)

### 2.1 Buka Railway

1. **Buka:** https://railway.app
2. **Klik "Login"**
3. **Login with GitHub** (klik tombol GitHub)
4. **Authorize Railway** untuk akses GitHub

### 2.2 Create New Project

1. **Klik "Start a New Project"** (tombol besar di tengah)

2. **Pilih "Deploy from GitHub repo"**

3. **Pilih repository `kilatbox`**
   - Jika tidak muncul, klik "Configure GitHub App" untuk grant akses

4. **Railway akan mulai deploy otomatis!**
   - Wait 1-2 menit untuk build selesai
   - Progress bisa dilihat di tab "Deployments"

---

## 🎯 Langkah 3: Add PostgreSQL Database (2 menit)

### 3.1 Tambah Database

1. **Di Railway Dashboard**, klik **"New"** (tombol + di atas)

2. **Pilih "Database"**

3. **Pilih "Add PostgreSQL"**

4. **Railway akan:**
   - ✅ Create PostgreSQL database otomatis
   - ✅ Generate `DATABASE_URL` otomatis
   - ✅ Connect ke aplikasi Anda

**SELESAI! Database ready!** 🎉

---

## 🎯 Langkah 4: Set Environment Variables (5 menit)

### 4.1 Buka Settings

1. **Klik service KilatBox** Anda (bukan database)
2. **Klik tab "Variables"**

### 4.2 Tambah Variables

**Klik "New Variable"** untuk masing-masing variable ini:

#### Variable 1: CLOUDKILAT_S3_ENDPOINT
```
Name: CLOUDKILAT_S3_ENDPOINT
Value: https://s3-id-jkt-1.kilatstorage.id
```

#### Variable 2: CLOUDKILAT_ACCESS_KEY
```
Name: CLOUDKILAT_ACCESS_KEY
Value: 00f40347ce0451733558
```
(Ganti dengan access key Anda yang actual)

#### Variable 3: CLOUDKILAT_SECRET_KEY
```
Name: CLOUDKILAT_SECRET_KEY
Value: Hml1ntk1WEUwyKr8lZZJkjFm1pQI4AEcx28LAvZL
```
(Ganti dengan secret key Anda yang actual)

#### Variable 4: S3_BUCKET_NAME
```
Name: S3_BUCKET_NAME
Value: kilatbox-storage
```

#### Variable 5: JWT_SECRET
```
Name: JWT_SECRET
Value: [GENERATE STRONG SECRET - LIHAT CARA DI BAWAH]
```

**Cara Generate JWT_SECRET:**

Di PowerShell local, jalankan:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy hasil output dan paste sebagai value JWT_SECRET!

#### Variable 6: NODE_ENV
```
Name: NODE_ENV
Value: production
```

#### Variable 7: PORT
```
Name: PORT
Value: 3000
```

**NOTE:** `DATABASE_URL` sudah otomatis diset oleh Railway, tidak perlu tambah manual!

### 4.3 Deploy Ulang (Otomatis)

Setelah save variables, Railway akan **auto-redeploy**.
Wait 1-2 menit hingga status jadi "Active" ✅

---

## 🎯 Langkah 5: Setup Database Schema (3 menit)

### 5.1 Buka PostgreSQL di Railway

1. **Klik PostgreSQL database** Anda
2. **Klik tab "Query"**

### 5.2 Run Schema SQL

1. **Buka file `schema.sql`** di VS Code
2. **Copy SEMUA isinya**
3. **Paste di Query Editor Railway**
4. **Klik "Run Query"** atau tekan **Ctrl+Enter**

**Tunggu sampai selesai!** Akan muncul konfirmasi tables created.

### 5.3 Verify Tables

Jalankan query ini untuk verify:

```sql
\dt
```

Seharusnya muncul tables:
- users
- files
- subscriptions
- payments
- shared_links
- team_folders
- team_members

---

## 🎯 Langkah 6: Get Your Live URL! 🌐

### 6.1 Dapatkan URL

1. **Klik service KilatBox** di Railway
2. **Klik tab "Settings"**
3. **Scroll ke "Domains"**
4. **Klik "Generate Domain"**

Railway akan generate URL seperti:
```
https://kilatbox-production.up.railway.app
```

### 6.2 Buka Aplikasi!

**Klik URL tersebut** atau copy ke browser!

🎉 **APLIKASI ANDA SUDAH LIVE DI INTERNET!** 🎉

---

## ✅ Test Aplikasi Live

### Test 1: Buka URL
```
https://your-app.up.railway.app
```

Seharusnya muncul halaman KilatBox!

### Test 2: Register User Baru
1. Klik Register
2. Isi form
3. Submit

### Test 3: Login
Login dengan user yang baru dibuat

### Test 4: Upload File
1. Upload file test
2. Verify muncul di list
3. Try download

### Test 5: Health Check
```
https://your-app.up.railway.app/api/health
```

Seharusnya return JSON success!

---

## 🌐 Custom Domain (Optional)

### Jika Punya Domain Sendiri:

1. **Di Railway Settings → Domains**
2. **Klik "Custom Domain"**
3. **Masukkan domain:** `kilatbox.yourdomain.com`
4. **Update DNS di domain provider:**

```
Type: CNAME
Name: kilatbox
Value: your-app.up.railway.app
TTL: 3600
```

5. **Wait DNS propagation** (5-30 menit)
6. **SSL otomatis aktif!** 🔒

---

## 📊 Monitoring & Logs

### Lihat Logs:
1. Railway Dashboard
2. Klik service KilatBox
3. Tab "Deployments"
4. Klik deployment terakhir
5. Lihat "Logs"

### Metrics:
Tab "Metrics" untuk lihat:
- CPU usage
- Memory usage
- Network traffic

---

## 🆘 Troubleshooting

### ❌ Error: Build Failed
- Check logs di Railway
- Verify `package.json` valid
- Pastikan semua dependencies ada

### ❌ Error: Application Crash
- Check logs untuk error message
- Verify environment variables lengkap
- Pastikan database schema sudah dijalankan

### ❌ Error: Database Connection Failed
- Verify PostgreSQL service running di Railway
- Check `DATABASE_URL` di environment variables
- Restart aplikasi

### ❌ Error: CloudKilat Upload Failed
- Verify credentials benar di environment variables
- Pastikan bucket exists: `kilatbox-storage`
- Check CloudKilat panel

### ❌ Error: 502 Bad Gateway
- Wait beberapa menit (deployment might still be processing)
- Check logs
- Try restart service

---

## 💰 Biaya Railway

### Free Tier:
- **$5 kredit** per bulan (gratis!)
- **500 execution hours** per bulan
- Cukup untuk 1 aplikasi production-ready
- PostgreSQL included!

### Jika Butuh Lebih:
- **Hobby Plan:** $5/bulan
- Unlimited execution hours
- Lebih banyak resources

---

## 🔒 Security Tips Production

1. **JANGAN share** environment variables
2. **Gunakan strong JWT_SECRET** (64+ characters random)
3. **Monitor logs** secara berkala
4. **Setup** uptime monitoring (UptimeRobot gratis)
5. **Backup database** secara regular (Railway auto-backup daily)

---

## 📱 Share Aplikasi Anda!

Setelah deploy sukses, share URL ke:
- ✅ Team members
- ✅ Clients
- ✅ Friends untuk testing
- ✅ Portfolio/CV

**URL Format:**
```
https://kilatbox-production.up.railway.app
```

---

## 🎉 SELAMAT!

**Project KilatBox Anda sekarang LIVE di internet!**

### Apa yang Sudah Dicapai:
✅ Full-stack application deployed
✅ PostgreSQL database running
✅ CloudKilat storage integrated
✅ SSL/HTTPS active
✅ Auto-deploy dari GitHub
✅ Production-ready!

### Next Steps:
1. Test semua fitur di production
2. Setup monitoring
3. Share dengan users
4. Collect feedback
5. Iterate & improve!

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Project Docs:** Cek file `DEPLOYMENT_GUIDE.md`

---

**Happy Deploying! 🚀**

---

*Generated for KilatBox Project - October 2025*
