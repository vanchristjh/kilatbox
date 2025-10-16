# 🚀 Panduan Setup Cepat dengan Kredensial CloudKilat

## ✅ Kredensial CloudKilat Anda

```
✓ Endpoint    : https://s3-id-jkt-1.kilatstorage.id
✓ Access Key  : 00f40347ce0451733558
⚠ Secret Key  : [Anda perlu menambahkan]
```

---

## 📋 Langkah Setup (5 Menit)

### Step 1: Dapatkan Secret Key 🔑

1. **Login ke CloudKilat Panel**
   ```
   URL: https://panel.cloudkilat.com
   ```

2. **Buka Menu API Keys / Access Keys**
   - Cari Access Key: `00f40347ce0451733558`
   - Copy **Secret Access Key** yang sesuai

3. **Simpan Secret Key**
   - **PENTING**: Secret Key hanya ditampilkan sekali
   - Jika hilang, harus generate key baru

---

### Step 2: Buat Bucket 🪣

1. **Di CloudKilat Panel, buka "Kilat Storage"**

2. **Klik "Create Bucket" atau "Buat Bucket"**

3. **Isi Form:**
   ```
   Bucket Name : kilatbox-storage
   Region      : Jakarta (id-jkt-1)
   Access      : Private
   ```

4. **Klik "Create"**

---

### Step 3: Setup Database PostgreSQL 🗄️

```powershell
# 1. Buka PostgreSQL
psql -U postgres

# 2. Buat database
CREATE DATABASE kilatbox;

# 3. Keluar
\q

# 4. Import schema
cd d:\PROJECT\ITB\kilatbox
psql -U postgres -d kilatbox -f schema.sql
```

**Verifikasi:**
```powershell
psql -U postgres -d kilatbox -c "\dt"
# Harus muncul tabel: users, files
```

---

### Step 4: Konfigurasi Environment Variables ⚙️

**Edit file `.env`:**
```powershell
notepad .env
```

**Isi dengan konfigurasi ini:**
```env
# CloudKilat Storage Configuration
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=PASTE_SECRET_KEY_ANDA_DISINI
S3_BUCKET_NAME=kilatbox-storage

# JWT Secret (ganti dengan random string)
JWT_SECRET=kilatbox_production_secret_key_2024

# Database Configuration (sesuaikan password PostgreSQL)
DATABASE_URL=postgres://postgres:your_postgres_password@localhost:5432/kilatbox

# Server Configuration
PORT=3000
NODE_ENV=development
```

**⚠️ PENTING:**
- Ganti `PASTE_SECRET_KEY_ANDA_DISINI` dengan Secret Key dari CloudKilat
- Ganti `your_postgres_password` dengan password PostgreSQL Anda
- Untuk production, ganti `JWT_SECRET` dengan random string yang lebih kuat

---

### Step 5: Test Koneksi CloudKilat 🧪

```powershell
# Test koneksi ke CloudKilat
npm run test:cloudkilat
```

**Output yang diharapkan:**
```
═══════════════════════════════════════════════
   CloudKilat S3 Connection Test
═══════════════════════════════════════════════

📋 Configuration:
   Endpoint   : https://s3-id-jkt-1.kilatstorage.id
   Access Key : 00f40347ce0451733558
   Secret Key : ***xxxx
   Bucket     : kilatbox-storage

🧪 Test 1: Listing buckets...
✅ Success! Found 1 bucket(s):
   - kilatbox-storage

🧪 Test 2: Listing objects in bucket: kilatbox-storage
✅ Success! Found 0 object(s) in bucket
   (Bucket is empty - this is normal for a new setup)

🧪 Test 3: Uploading test file...
✅ Success! Test file uploaded to: test/connection-test.txt

═══════════════════════════════════════════════
✅ All tests passed!

Your CloudKilat configuration is working correctly.
You can now start the KilatBox server with: npm start
═══════════════════════════════════════════════
```

**Jika ada error:**
- Lihat bagian Troubleshooting di bawah
- Baca file `CLOUDKILAT_CONFIG.md`

---

### Step 6: Jalankan Server 🚀

```powershell
# Development mode (dengan auto-reload)
npm run dev

# atau Production mode
npm start
```

**Output yang diharapkan:**
```
╔════════════════════════════════════════════╗
║                                            ║
║         🚀 KilatBox Server Started        ║
║                                            ║
╚════════════════════════════════════════════╝

✅ Server running on: http://localhost:3000
✅ Environment: development
✅ Connected to PostgreSQL database

📋 Available endpoints:
   🌐 Web Interface: http://localhost:3000
   ...
```

---

### Step 7: Test di Browser 🌐

1. **Buka Browser:**
   ```
   http://localhost:3000
   ```

2. **Register User Baru:**
   - Klik "Daftar Sekarang"
   - Isi: Nama, Email, Password
   - Klik "Daftar"

3. **Upload File Test:**
   - Setelah login, akan redirect ke dashboard
   - Klik "Pilih File" atau drag & drop file
   - File akan diupload ke CloudKilat

4. **Verifikasi di CloudKilat:**
   - Login ke https://panel.cloudkilat.com
   - Buka Kilat Storage → kilatbox-storage
   - File Anda akan muncul di folder `/<user_id>/`

---

## 🐛 Troubleshooting

### ❌ Error: "Secret Key not set"
```
💡 Solusi:
1. Buka .env
2. Pastikan CLOUDKILAT_SECRET_KEY sudah diisi
3. Restart server
```

### ❌ Error: "SignatureDoesNotMatch"
```
💡 Solusi:
1. Secret Key salah
2. Login ke CloudKilat Panel
3. Verifikasi Secret Key
4. Update di .env
```

### ❌ Error: "NoSuchBucket"
```
💡 Solusi:
1. Bucket belum dibuat atau nama salah
2. Login ke CloudKilat Panel
3. Cek bucket name di Kilat Storage
4. Update S3_BUCKET_NAME di .env
```

### ❌ Error: "Database connection failed"
```
💡 Solusi:
1. PostgreSQL service belum running
2. Buka Services (services.msc)
3. Start service PostgreSQL
4. Atau: net start postgresql-x64-xx
```

### ❌ Error: "Port 3000 already in use"
```
💡 Solusi:
1. Edit .env
2. Ganti PORT=3001
3. Restart server
4. Akses di http://localhost:3001
```

---

## ✅ Checklist Setup

Pastikan semua ini sudah dilakukan:

- [ ] ✅ Secret Key sudah didapat dari CloudKilat Panel
- [ ] ✅ Bucket `kilatbox-storage` sudah dibuat
- [ ] ✅ PostgreSQL sudah running
- [ ] ✅ Database `kilatbox` sudah dibuat
- [ ] ✅ Schema SQL sudah diimport (tabel users & files ada)
- [ ] ✅ File `.env` sudah dikonfigurasi lengkap
- [ ] ✅ Test CloudKilat berhasil (npm run test:cloudkilat)
- [ ] ✅ Server bisa running (npm start)
- [ ] ✅ Bisa register user di browser
- [ ] ✅ Bisa upload file
- [ ] ✅ File muncul di CloudKilat Panel

---

## 🎯 Quick Commands

```powershell
# Test koneksi CloudKilat
npm run test:cloudkilat

# Jalankan server (development)
npm run dev

# Jalankan server (production)
npm start

# Cek database
psql -U postgres -d kilatbox

# Lihat tabel
psql -U postgres -d kilatbox -c "\dt"

# Lihat data users
psql -U postgres -d kilatbox -c "SELECT * FROM users;"

# Lihat data files
psql -U postgres -d kilatbox -c "SELECT * FROM files;"
```

---

## 📚 Dokumentasi Lengkap

- `README.md` - Overview proyek
- `QUICKSTART.md` - Quick start guide
- `SETUP.md` - Setup detail lengkap
- `CLOUDKILAT_CONFIG.md` - Konfigurasi CloudKilat detail
- `API_TESTING.md` - Testing API
- `LAPORAN.md` - Laporan proyek

---

## 💡 Tips

1. **Keamanan Secret Key:**
   - Jangan share Secret Key ke siapapun
   - Jangan commit file `.env` ke Git
   - Simpan backup Secret Key di tempat aman

2. **Testing:**
   - Gunakan bucket terpisah untuk testing dan production
   - Test upload/download/delete sebelum deploy

3. **Monitoring:**
   - Monitor storage usage di CloudKilat Panel
   - Set alert jika storage hampir penuh

4. **Performance:**
   - Endpoint Jakarta memberikan latency rendah untuk Indonesia
   - Gunakan CDN jika perlu serve file ke user global

---

## 📞 Bantuan

**Jika masih ada masalah:**
1. Baca file `CLOUDKILAT_CONFIG.md`
2. Jalankan `npm run test:cloudkilat` untuk diagnostik
3. Cek log error di terminal
4. Hubungi CloudKilat support: support@cloudkilat.com

---

## 🎉 Selamat!

Setelah semua step di atas selesai, sistem KilatBox Anda sudah siap digunakan! 🚀

**Next Steps:**
- Upload berbagai jenis file untuk testing
- Test download dan delete
- Coba fitur drag & drop
- Monitor storage usage
- Deploy ke production (opsional)

---

**Happy Coding! 💻**
