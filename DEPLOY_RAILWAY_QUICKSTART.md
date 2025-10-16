# 🚀 Quick Start - Deploy ke Railway (Tercepat!)

## Mengapa Railway?
- ✅ **Gratis** untuk pemula (500 jam/bulan)
- ✅ **PostgreSQL included** - tidak perlu setup terpisah
- ✅ **Auto-deploy** dari GitHub
- ✅ **Setup 5-10 menit** saja!
- ✅ **SSL/HTTPS** otomatis
- ✅ **Custom domain** gratis

---

## 📋 Langkah-Langkah (10 Menit)

### Step 1: Push ke GitHub (3 menit)

1. **Buat repository baru di GitHub:**
   - Buka https://github.com/new
   - Nama: `kilatbox` (atau nama lain)
   - Set ke **Private** (recommended untuk production)
   - Jangan centang "Initialize with README" (sudah ada)
   - Klik "Create repository"

2. **Push code ke GitHub:**
   ```powershell
   # Di folder project KilatBox
   git init
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/username/kilatbox.git
   git push -u origin main
   ```

   Ganti `username/kilatbox.git` dengan URL repository Anda!

### Step 2: Deploy ke Railway (5 menit)

1. **Buka Railway:**
   - Pergi ke https://railway.app
   - Klik **"Login"** → Login dengan GitHub
   - Authorize Railway untuk akses GitHub Anda

2. **Buat Project Baru:**
   - Klik **"Start a New Project"**
   - Pilih **"Deploy from GitHub repo"**
   - Pilih repository **kilatbox** yang tadi dibuat
   - Railway akan mulai deploy otomatis

3. **Tunggu Deploy Pertama:**
   - Railway akan detect Node.js app
   - Build akan berjalan (1-2 menit)
   - Status akan berubah jadi "Active" jika sukses

### Step 3: Tambah Database (1 menit)

1. **Tambah PostgreSQL:**
   - Di dashboard Railway, klik **"New"**
   - Pilih **"Database"**
   - Pilih **"Add PostgreSQL"**
   - Railway akan create database otomatis

2. **Database Auto-Connect:**
   - Railway otomatis set variable `DATABASE_URL`
   - Tidak perlu konfigurasi manual!

### Step 4: Set Environment Variables (2 menit)

1. **Klik service KilatBox Anda**

2. **Klik tab "Variables"**

3. **Tambah variable satu per satu:**

   Klik **"New Variable"** untuk masing-masing:

   ```
   Variable Name: CLOUDKILAT_S3_ENDPOINT
   Value: https://s3-id-jkt-1.kilatstorage.id
   ```

   ```
   Variable Name: CLOUDKILAT_ACCESS_KEY
   Value: [ISI DENGAN ACCESS KEY CLOUDKILAT ANDA]
   ```

   ```
   Variable Name: CLOUDKILAT_SECRET_KEY
   Value: [ISI DENGAN SECRET KEY CLOUDKILAT ANDA]
   ```

   ```
   Variable Name: S3_BUCKET_NAME
   Value: kilatbox-storage
   ```

   ```
   Variable Name: JWT_SECRET
   Value: [Generate random string - lihat cara di bawah]
   ```

   ```
   Variable Name: NODE_ENV
   Value: production
   ```

   ```
   Variable Name: PORT
   Value: 3000
   ```

   **Cara Generate JWT_SECRET:**
   ```powershell
   # Di terminal, jalankan:
   node generate-secret.js
   ```
   Copy hasil output dan paste sebagai JWT_SECRET

4. **Klik "Deploy"** (jika perlu)

### Step 5: Setup Database Schema (2 menit)

1. **Di Railway Dashboard:**
   - Klik PostgreSQL database
   - Klik tab **"Query"**

2. **Copy-paste isi file `schema.sql`:**
   - Buka file `schema.sql` di project Anda
   - Copy semua isinya
   - Paste di Query editor Railway
   - Klik **"Run Query"** atau tekan Ctrl+Enter

3. **Verify:**
   - Seharusnya muncul tables: users, files, subscriptions, payments, dll

### Step 6: Akses Aplikasi! 🎉

1. **Dapatkan URL:**
   - Klik service KilatBox di Railway
   - Di bagian atas, klik ikon **"Settings"**
   - Scroll ke **"Domains"**
   - Railway akan generate URL seperti:
     ```
     https://kilatbox-production.up.railway.app
     ```

2. **Buka di Browser:**
   - Klik URL tersebut atau copy ke browser
   - Anda akan melihat halaman KilatBox!

3. **Test Aplikasi:**
   - Register akun baru
   - Login
   - Upload file
   - ✅ Selesai!

---

## 🎨 Custom Domain (Opsional)

1. **Di Railway Settings → Domains:**
   - Klik **"Custom Domain"**
   - Masukkan domain Anda: `kilatbox.yourdomain.com`

2. **Update DNS:**
   - Tambah CNAME record di domain provider Anda:
     ```
     Type: CNAME
     Name: kilatbox (atau subdomain lain)
     Value: [URL Railway Anda].up.railway.app
     ```

3. **Tunggu propagasi DNS** (5-30 menit)

4. **SSL otomatis aktif!**

---

## 🔍 Monitoring & Logs

### Lihat Logs:
1. Klik service KilatBox
2. Klik tab **"Deployments"**
3. Klik deployment terakhir
4. Lihat **"Logs"** untuk melihat output aplikasi

### Check Metrics:
- Tab **"Metrics"** menampilkan CPU, Memory, Network usage

### Health Check:
```
https://your-app.railway.app/api/health
```

---

## 🐛 Troubleshooting

### ❌ Error: Cannot connect to database
**Solusi:**
- Pastikan PostgreSQL sudah dibuat
- Railway otomatis set `DATABASE_URL`, jangan override manual
- Check logs untuk error detail

### ❌ Error: CloudKilat upload failed
**Solusi:**
- Verify `CLOUDKILAT_ACCESS_KEY` dan `CLOUDKILAT_SECRET_KEY` benar
- Test dengan script: `node test-cloudkilat.js` di local dulu
- Pastikan bucket sudah dibuat di CloudKilat dashboard

### ❌ Build failed
**Solusi:**
- Check logs di Railway
- Pastikan `package.json` valid
- Pastikan semua dependencies ada

### ❌ Application crash setelah deploy
**Solusi:**
- Lihat logs untuk error message
- Pastikan semua environment variables sudah diset
- Pastikan database schema sudah dijalankan
- Check PORT variable (harus 3000 atau yang Railway tentukan)

---

## 💰 Biaya

### Railway Free Tier:
- **$5 kredit gratis** per bulan
- **500 execution hours** per bulan
- Cukup untuk 1 aplikasi kecil-menengah
- PostgreSQL included dalam free tier

### Jika Over Limit:
- Bisa upgrade ke **$5/bulan** (Hobby plan)
- Unlimited execution hours
- Lebih banyak resources

---

## 📊 Next Steps

Setelah deploy berhasil:

1. **Setup monitoring:**
   - UptimeRobot (gratis) untuk uptime monitoring
   - Railway built-in metrics

2. **Configure backups:**
   - Railway PostgreSQL auto-backup daily
   - Bisa manual backup dengan `pg_dump`

3. **Security:**
   - Baca `SECURITY_CHECKLIST.md`
   - Enable rate limiting
   - Review CORS settings

4. **Custom domain:**
   - Setup domain sendiri
   - SSL otomatis aktif

5. **Performance:**
   - Monitor response times
   - Optimize queries jika perlu
   - Consider Redis untuk caching (Railway add-on)

---

## 🆘 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Project Docs:** Baca `DEPLOYMENT_GUIDE.md` untuk opsi lain

---

## ✅ Checklist

- [ ] Code pushed ke GitHub
- [ ] Railway project created
- [ ] PostgreSQL added
- [ ] Environment variables set (7 variables)
- [ ] JWT_SECRET generated dan diset
- [ ] Database schema executed
- [ ] Application deployed successfully
- [ ] Tested registration & login
- [ ] Tested file upload
- [ ] URL shared/bookmarked

---

🎉 **Selamat! KilatBox Anda sudah live di internet!**

Share URL Anda dan mulai pakai! 🚀
