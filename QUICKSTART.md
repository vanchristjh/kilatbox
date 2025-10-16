# 🚀 Quick Start Guide - Exora ID

Panduan cepat untuk menjalankan Exora ID dalam 5 menit!

## ⚡ Prerequisites Check

Pastikan sudah terinstall:
- ✅ Node.js (jalankan: `node --version`)
- ✅ PostgreSQL (jalankan: `psql --version`)
- ✅ Akun CloudKilat aktif

## 📝 Step-by-Step Setup

### Step 1: Setup Database (2 menit)

```powershell
# Buka PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE Exora ID;

# Keluar
\q

# Import schema
cd d:\PROJECT\ITB\Exora ID
psql -U postgres -d Exora ID -f schema.sql
```

### Step 2: Konfigurasi CloudKilat (2 menit)

1. Login ke https://panel.cloudkilat.com
2. Buka **Kilat Storage** → Klik **Create Bucket**
3. Nama bucket: `Exora ID-storage`
4. Catat: **Secret Access Key** dari menu API Keys
   - Access Key sudah tersedia: `00f40347ce0451733558`
   - Endpoint: `https://s3-id-jkt-1.kilatstorage.id`

### Step 3: Setup Environment (1 menit)

```powershell
# Copy .env.example ke .env
copy .env.example .env

# Edit .env
notepad .env
```

**Isi minimal yang HARUS diubah:**
```env
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=isi_secret_key_dari_cloudkilat
S3_BUCKET_NAME=Exora ID-storage
DATABASE_URL=postgres://postgres:PASSWORD_POSTGRES_ANDA@localhost:5432/Exora ID
```

### Step 4: Install & Run (1 menit)

```powershell
# Install dependencies (sudah dilakukan)
npm install

# Jalankan server
npm start
```

### Step 5: Test di Browser

1. Buka: http://localhost:3000
2. Klik **"Daftar Sekarang"**
3. Isi form registrasi
4. Upload file pertama!

---

## ✅ Checklist Setup

- [ ] PostgreSQL running
- [ ] Database `Exora ID` created
- [ ] Schema imported (tables: users, files)
- [ ] CloudKilat bucket created
- [ ] File `.env` configured
- [ ] Dependencies installed
- [ ] Server running (http://localhost:3000)
- [ ] Bisa register user baru
- [ ] Bisa upload file

---

## 🐛 Quick Troubleshooting

### Server tidak bisa start?

```powershell
# Check apakah port 3000 sudah digunakan
netstat -ano | findstr :3000

# Jika ada, ubah PORT di .env
notepad .env
# Ganti: PORT=3001
```

### Database error?

```powershell
# Test koneksi PostgreSQL
psql -U postgres -d Exora ID

# Jika gagal, pastikan PostgreSQL service running
# Cek di Services (services.msc) → PostgreSQL
```

### CloudKilat error?

- Pastikan Access Key & Secret Key benar
- Pastikan bucket name sama dengan di .env
- Test kredensial di CloudKilat panel

---

## 🎯 Default Credentials untuk Testing

Setelah register, Anda bisa langsung:
- Upload file (max 100MB)
- Download file
- Delete file
- Storage limit: 1GB

---

## 📚 Next Steps

Setelah berhasil running:

1. **Baca dokumentasi lengkap:**
   - `README.md` - Overview proyek
   - `SETUP.md` - Setup detail
   - `API_TESTING.md` - Test API dengan Postman
   - `LAPORAN.md` - Laporan proyek lengkap

2. **Test semua fitur:**
   - Register & Login
   - Upload berbagai jenis file
   - Download file
   - Delete file
   - Check storage statistics

3. **API Testing:**
   - Install Postman
   - Import endpoints dari `API_TESTING.md`
   - Test semua endpoints

4. **Deploy (opsional):**
   - Deploy ke VPS/Cloud
   - Setup production environment
   - Enable HTTPS

---

## 🎉 Congratulations!

Anda berhasil menjalankan **Exora ID**! 

**Happy Coding! 🚀**

---

## 💡 Tips

- Gunakan `npm run dev` untuk development (auto-reload)
- Check console untuk error messages
- Token JWT berlaku 7 hari
- Download URL berlaku 15 menit

---

## 📞 Need Help?

Lihat file-file dokumentasi:
- `README.md` - Informasi umum
- `SETUP.md` - Panduan setup lengkap
- `API_TESTING.md` - Testing guide
- `LAPORAN.md` - Laporan lengkap proyek
