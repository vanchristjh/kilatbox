# ⚠️ PENTING - Setup .env File

## 🔴 Yang Harus Anda Ubah di File .env:

### 1. CLOUDKILAT_SECRET_KEY ❗❗❗
```env
CLOUDKILAT_SECRET_KEY=your_secret_key_here
```

**Cara mendapatkan:**
1. Login ke https://panel.cloudkilat.com
2. Buka menu "API Keys" atau "Access Keys"  
3. Cari Access Key: `00f40347ce0451733558`
4. Copy **Secret Access Key** yang sesuai
5. Paste di .env

---

### 2. DATABASE_URL ❗
```env
DATABASE_URL=postgres://user:password@localhost:5432/kilatbox
```

**Ubah menjadi:**
```env
DATABASE_URL=postgres://postgres:PASSWORD_POSTGRES_ANDA@localhost:5432/kilatbox
```

Ganti `PASSWORD_POSTGRES_ANDA` dengan password PostgreSQL Anda.

**Contoh jika password PostgreSQL adalah "admin123":**
```env
DATABASE_URL=postgres://postgres:admin123@localhost:5432/kilatbox
```

---

### 3. JWT_SECRET (Opsional tapi disarankan)
```env
JWT_SECRET=mysecretkey_change_this_in_production
```

Ganti dengan random string yang lebih kuat:
```env
JWT_SECRET=kilatbox_jwt_secret_2024_very_long_and_secure_key
```

---

## 📝 Cara Edit File .env:

```powershell
# Buka dengan notepad
notepad .env

# Atau buka dengan VS Code (jika sudah install)
code .env
```

---

## ✅ Checklist Sebelum Lanjut:

- [ ] CLOUDKILAT_SECRET_KEY sudah diisi dengan Secret Key dari CloudKilat
- [ ] DATABASE_URL sudah disesuaikan dengan password PostgreSQL Anda
- [ ] Bucket `kilatbox-storage` sudah dibuat di CloudKilat Panel
- [ ] PostgreSQL sudah running
- [ ] Database `kilatbox` sudah dibuat ✅
- [ ] Tabel `users` dan `files` sudah ada ✅

---

## 🚀 Setelah Edit .env:

### Test Koneksi CloudKilat:
```powershell
npm run test:cloudkilat
```

### Jika Test Berhasil, Jalankan Server:
```powershell
npm start
```

### Buka Browser:
```
http://localhost:3000
```

---

## 🐛 Troubleshooting

### Jika lupa password PostgreSQL:
```powershell
# Reset password PostgreSQL (jalankan di Command Prompt as Administrator)
# 1. Edit pg_hba.conf
# 2. Ganti method dari "md5" ke "trust"
# 3. Restart PostgreSQL service
# 4. Login tanpa password dan ubah password
# 5. Kembalikan method ke "md5"
```

### Jika tidak tahu password PostgreSQL saat install:
Biasanya password default adalah:
- `postgres`
- `admin`
- `root`
- Atau kosong (tanpa password)

Coba satu per satu di DATABASE_URL.

---

## 💡 Tips

**Cara cepat cek apakah DATABASE_URL sudah benar:**
```powershell
psql -U postgres -d kilatbox
# Jika berhasil connect, berarti credentials benar
# Ketik \q untuk keluar
```

**Contoh DATABASE_URL yang benar:**
```env
# Jika password postgres adalah "postgres"
DATABASE_URL=postgres://postgres:postgres@localhost:5432/kilatbox

# Jika password postgres adalah "admin"
DATABASE_URL=postgres://postgres:admin@localhost:5432/kilatbox

# Jika tidak ada password (kosong)
DATABASE_URL=postgres://postgres@localhost:5432/kilatbox
```

---

**Edit .env sekarang, lalu lanjut ke step berikutnya! 🚀**
