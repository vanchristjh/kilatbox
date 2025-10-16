# 🔑 Cara Mengambil CloudKilat API Credentials

## 📸 Berdasarkan Screenshot Anda

Anda sudah membuka halaman yang tepat! Berikut cara mengambil credentials:

---

## 1️⃣ Kunci Akses (Access Key)

**Di Panel CloudKilat:**
- Buka: **Layanan** → **Kilat Storage**
- Lihat bagian **"Daftar Kunci"**
- Copy **"Kunci Akses"**: `00f40347ce0451733558`

**Ini adalah CLOUDKILAT_ACCESS_KEY Anda!**

---

## 2️⃣ Kunci Rahasia (Secret Key)

**Di Panel yang Sama:**
- Copy **"Kunci Rahasia"**: `Hml1ntk1WEUwyKr8lZZJkjFm1pQI4AEcx28LAvZL`
- Klik icon 🔄 untuk show/hide
- **PENTING:** Simpan dengan aman, jangan share!

**Ini adalah CLOUDKILAT_SECRET_KEY Anda!**

---

## 3️⃣ Endpoint S3

**Dari Screenshot:**
- Endpoint: `https://s3-id-jkt-1.kilatstorage.id`
- Region: `id-jkt-1` (Jakarta)

**Ini adalah CLOUDKILAT_S3_ENDPOINT Anda!**

---

## 4️⃣ Bucket Name

**Yang Harus Anda Lakukan:**

### Opsi A: Pakai Bucket yang Sudah Ada
Jika Anda sudah buat bucket bernama `Exora ID-storage`, gunakan nama itu.

### Opsi B: Buat Bucket Baru

1. **Di Panel CloudKilat** (screenshot Anda)
2. Klik **"Buat Kunci Baru"** atau masuk ke S3 Management
3. Buat bucket dengan nama: `Exora ID-storage`
4. Region: `id-jkt-1`

**Atau pakai script yang sudah saya buat:**
```powershell
node create-bucket.js
```

---

## ✅ Lengkapi Environment Variables

### Untuk Testing Local (.env):

```bash
# CloudKilat Storage Configuration
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=Hml1ntk1WEUwyKr8lZZJkjFm1pQI4AEcx28LAvZL
S3_BUCKET_NAME=Exora ID-storage

# JWT Secret
JWT_SECRET=Exora ID_jwt_secret_2024_production_key_very_secure

# Database Configuration (PostgreSQL)
DATABASE_URL=postgres://postgres:123qwe123@localhost:5432/Exora ID

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Untuk Production (Railway/CloudKilat VPS):

**Sama**, tapi:
- `NODE_ENV=production`
- `JWT_SECRET=[GENERATE RANDOM]` (gunakan: `node generate-secret.js`)
- `DATABASE_URL=[PRODUCTION DATABASE]`

---

## 🔐 Keamanan Credentials

### ⚠️ JANGAN LAKUKAN:
- ❌ Commit `.env` ke Git
- ❌ Share credentials di public
- ❌ Hardcode di code
- ❌ Upload ke repository public

### ✅ LAKUKAN:
- ✅ Simpan di `.env` (sudah di `.gitignore`)
- ✅ Backup credentials di tempat aman
- ✅ Gunakan environment variables di production
- ✅ Rotate keys secara berkala

---

## 🧪 Test Koneksi CloudKilat

Setelah credentials lengkap, test dengan:

```powershell
# Test koneksi CloudKilat Storage
node test-cloudkilat.js
```

**Expected Output:**
```
✅ Success! Found 1 bucket(s):
   - Exora ID-storage

✅ Success! Test file uploaded
✅ All tests passed!
```

---

## 🎯 Next Steps

### Pilih Platform Hosting:

#### **Opsi 1: Railway (Tercepat - 15 menit)**
- Baca: `DEPLOY_RAILWAY_QUICKSTART.md`
- Free tier $5/bulan
- Auto-deploy dari GitHub
- PostgreSQL included

**Credentials yang dibutuhkan:**
```
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=Hml1ntk1WEUwyKr8lZZJkjFm1pQI4AEcx28LAvZL
S3_BUCKET_NAME=Exora ID-storage
JWT_SECRET=[GENERATE]
NODE_ENV=production
PORT=3000
```

#### **Opsi 2: CloudKilat VPS (Full Control)**
- Baca: `DEPLOY_CLOUDKILAT.md`
- Rp 75.000-150.000/bulan
- Server di Indonesia
- Full root access

**Setup sama, tapi di VPS:**
```bash
# Di VPS CloudKilat
nano /var/www/Exora ID/.env
# Paste credentials yang sama
```

---

## 📊 Summary - What You Have

| Item | Value | Status |
|------|-------|--------|
| **Access Key** | `00f40347ce0451733558` | ✅ Ada |
| **Secret Key** | `Hml1ntk1...AvZL` | ✅ Ada |
| **Endpoint** | `https://s3-id-jkt-1.kilatstorage.id` | ✅ Ada |
| **Storage** | 25 GB | ✅ Aktif |
| **Bucket** | Need to create/verify | ⚠️ Check |

---

## 🚀 Quick Deploy Commands

### 1. Verify Bucket Exists:
```powershell
node create-bucket.js
```

### 2. Test Connection:
```powershell
node test-cloudkilat.js
```

### 3. Deploy to Railway:
```powershell
# Follow: DEPLOY_RAILWAY_QUICKSTART.md
# Set environment variables di Railway dashboard
```

### 4. Or Deploy to CloudKilat VPS:
```powershell
# Follow: DEPLOY_CLOUDKILAT.md
# SSH ke VPS dan setup
```

---

## 💡 Tips

1. **Storage Anda sudah aktif** - tinggal pakai!
2. **Credentials sudah lengkap** - copy dari panel
3. **Bucket bisa dibuat otomatis** - pakai `create-bucket.js`
4. **Test dulu sebelum deploy** - gunakan `test-cloudkilat.js`

---

## 📞 Need Help?

**CloudKilat Support:**
- Panel: https://panel.cloudkilat.com
- Dokumentasi: https://docs.cloudkilat.com
- Support: support@cloudkilat.com

**Project Files:**
- `test-cloudkilat.js` - Test koneksi
- `create-bucket.js` - Buat bucket
- `.env.example` - Template environment variables

---

**Credentials Anda sudah lengkap! Siap deploy! 🚀**
