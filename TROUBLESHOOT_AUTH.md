# 🔧 Troubleshooting: Server Error During Registration/Login

## ❌ Problem
Mendapat error "Server error during registration" dan "Server error during login"

## 🔍 Kemungkinan Penyebab

### 1. Database Connection Error
**Penyebab paling umum!**

Error ini biasanya terjadi karena:
- Password PostgreSQL di `.env` tidak sesuai
- PostgreSQL service tidak running
- Database `kilatbox` belum dibuat atau terhapus

---

## ✅ SOLUSI STEP-BY-STEP

### STEP 1: Cek Password PostgreSQL di .env

```powershell
# Buka file .env
notepad .env
```

Cari baris ini:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/kilatbox
```

Format:
```
DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/kilatbox
                         ^^^^^^^^ ^^^^^^^^
                         user     password yang benar!
```

**Ubah PASSWORD** sesuai dengan password PostgreSQL Anda!

**Contoh:**
- Jika password PostgreSQL Anda adalah "admin":
  ```env
  DATABASE_URL=postgres://postgres:admin@localhost:5432/kilatbox
  ```

- Jika password PostgreSQL Anda adalah "123456":
  ```env
  DATABASE_URL=postgres://postgres:123456@localhost:5432/kilatbox
  ```

---

### STEP 2: Test Koneksi Database

```powershell
# Test koneksi PostgreSQL
psql -U postgres -d kilatbox -c "SELECT current_database();"
```

✅ Jika berhasil: Lanjut ke Step 3
❌ Jika gagal: Cek password atau pastikan PostgreSQL running

---

### STEP 3: Verifikasi Tabel Ada

```powershell
# Cek apakah tabel users dan files ada
psql -U postgres -d kilatbox -c "\dt"
```

**Expected Output:**
```
         List of relations
 Schema | Name  | Type  |  Owner
--------+-------+-------+----------
 public | files | table | postgres
 public | users | table | postgres
```

❌ Jika tabel tidak ada, jalankan schema lagi:
```powershell
psql -U postgres -d kilatbox -f schema.sql
```

---

### STEP 4: Restart Server

**Setelah edit .env, WAJIB restart server!**

```powershell
# Stop server yang running (Ctrl+C di terminal server)
# Atau kill process:
taskkill /F /IM node.exe

# Start server lagi
cd D:\PROJECT\ITB\kilatbox
npm start
```

---

### STEP 5: Test Register via Command Line

```powershell
# Di terminal BARU (jangan yang running server!)
cd D:\PROJECT\ITB\kilatbox
node test-register.js
```

**Expected Output jika berhasil:**
```
Testing register API...

Status: 201
Response: {
  "success": true,
  "message": "Registration successful",
  ...
}

✅ Registration successful!
Token: eyJhbGciOiJIUzI1NiIs...
```

**Jika gagal, lihat error message!**

---

## 🔍 DEBUG: Cek Server Log

Saat mencoba register, lihat terminal yang menjalankan `npm start`.

**Error yang mungkin muncul:**

### Error 1: "Connection refused" atau "ECONNREFUSED"
```
❌ Penyebab: PostgreSQL tidak running
✅ Solusi  : Start PostgreSQL service
```

```powershell
# Cek status PostgreSQL
Get-Service postgresql*

# Start service jika stopped
Start-Service postgresql-x64-14  # sesuaikan versi
```

---

### Error 2: "password authentication failed"
```
❌ Penyebab: Password di .env salah
✅ Solusi  : Update DATABASE_URL di .env dengan password yang benar
```

---

### Error 3: "database 'kilatbox' does not exist"
```
❌ Penyebab: Database belum dibuat
✅ Solusi  : Buat database
```

```powershell
psql -U postgres -c "CREATE DATABASE kilatbox"
psql -U postgres -d kilatbox -f schema.sql
```

---

### Error 4: "relation 'users' does not exist"
```
❌ Penyebab: Tabel belum dibuat
✅ Solusi  : Import schema
```

```powershell
psql -U postgres -d kilatbox -f schema.sql
```

---

## 🧪 FULL TEST PROCEDURE

### 1. Test Database Connection
```powershell
psql -U postgres -d kilatbox -c "SELECT 1;"
```

### 2. Test Tables Exist
```powershell
psql -U postgres -d kilatbox -c "SELECT COUNT(*) FROM users;"
```

### 3. Test Server Health
```powershell
# Pastikan server running
# Buka browser: http://localhost:3000/api/health
```

### 4. Test Register (Browser)
```
1. Buka: http://localhost:3000
2. Klik "Daftar Sekarang"
3. Isi form:
   - Nama: Test User
   - Email: test@example.com
   - Password: password123
4. Klik "Daftar"
```

### 5. Check Browser Console
```
F12 → Console tab
Lihat error message (jika ada)
```

---

## 📋 CHECKLIST TROUBLESHOOTING

Cek satu per satu:

- [ ] PostgreSQL service running
- [ ] Database `kilatbox` exists
- [ ] Tables `users` & `files` exist
- [ ] PASSWORD di .env sudah benar
- [ ] Server di-restart setelah edit .env
- [ ] Bisa akses http://localhost:3000/api/health
- [ ] Browser console tidak ada error CORS
- [ ] Test register via test-register.js berhasil

---

## 🛠️ QUICK FIX COMMANDS

**Full Reset (jika semua gagal):**

```powershell
# 1. Stop server
taskkill /F /IM node.exe

# 2. Drop & recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS kilatbox;"
psql -U postgres -c "CREATE DATABASE kilatbox;"
psql -U postgres -d kilatbox -f schema.sql

# 3. Verify tables
psql -U postgres -d kilatbox -c "\dt"

# 4. Edit .env dengan password yang benar
notepad .env

# 5. Start server
cd D:\PROJECT\ITB\kilatbox
npm start

# 6. Di terminal baru, test register
node test-register.js
```

---

## 💡 TIPS

1. **Selalu restart server setelah edit .env**
2. **Cek server terminal untuk error messages**
3. **Buka Browser Console (F12) untuk lihat client-side errors**
4. **Jangan gunakan email yang sama untuk register 2x (email harus unique)**

---

## 📞 Jika Masih Error

Kirim informasi berikut:
1. Output dari: `psql -U postgres -d kilatbox -c "\dt"`
2. Output dari: `node test-register.js`
3. Screenshot server log (terminal yang run `npm start`)
4. Screenshot browser console error

---

## ✅ SUCCESS INDICATORS

Jika semua benar, Anda akan melihat:

**Server Log:**
```
✅ Server running on: http://localhost:3000
✅ Connected to PostgreSQL database
```

**Test Register:**
```
✅ Registration successful!
Token: eyJhbGc...
```

**Browser:**
```
Login berhasil! Mengalihkan ke dashboard...
[Redirect ke /dashboard.html]
```

---

**Good luck! 🚀**
