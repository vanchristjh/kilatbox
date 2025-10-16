# 🎯 QUICK START - KilatBox

## ✅ Password Database Sudah Diupdate!
Database password sudah diubah ke `123qwe123` di file `.env`

---

## 🚀 Cara Start Server & Test

### TERMINAL 1: Start Server

```powershell
cd D:\PROJECT\ITB\kilatbox
npm start
```

**Jangan tutup terminal ini!** Server harus tetap running.

---

### TERMINAL 2: Test Registration

Buka **PowerShell BARU**, lalu jalankan:

```powershell
cd D:\PROJECT\ITB\kilatbox
node test-register.js
```

**Expected Output:**
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

---

## 🌐 Test di Browser

1. **Buka browser:** http://localhost:3000

2. **Klik "Daftar Sekarang"**

3. **Isi form:**
   - Nama: `Test User`
   - Email: `test@example.com`
   - Password: `password123`

4. **Klik "Daftar"**

5. **Jika berhasil**, akan redirect ke dashboard!

---

## ⚠️ CATATAN PENTING

### 1. Bucket CloudKilat Belum Dibuat!
Sebelum bisa upload file, buat bucket dulu:

1. Login: https://panel.cloudkilat.com
2. Pilih menu **Kilat Storage**
3. Klik **Create Bucket**
4. Nama bucket: `kilatbox-storage`
5. Region: **Jakarta (id-jkt-1)**
6. Access: **Private**

### 2. Email Harus Unik
Jika test register 2x dengan email yang sama, akan error: "Email already registered"

### 3. Server Harus Running
Server di Terminal 1 harus tetap jalan saat test!

---

## 🔧 Jika Ada Error

### Error: "Server error during registration"
✅ **SOLVED!** Password database sudah benar di .env

### Error: "Email already registered"
- Gunakan email berbeda
- Atau hapus user dari database:
```powershell
psql -U postgres -d kilatbox -c "DELETE FROM users WHERE email='test@example.com';"
```

### Error: "Cannot connect to database"
- Pastikan PostgreSQL running
- Check password di .env (sekarang: `123qwe123`)

---

## 📋 File-File Penting

- ✅ `.env` - Password sudah diupdate ke `123qwe123`
- ✅ `server.js` - Server utama
- ✅ `test-register.js` - Test registration via command line
- ✅ `start-server.ps1` - Script untuk start server
- ✅ `test-full.ps1` - Script untuk full test

---

## 🎯 Next Step

**Sekarang coba:**

1. Buka **2 terminal PowerShell**
   
2. **Terminal 1:**
   ```powershell
   cd D:\PROJECT\ITB\kilatbox
   npm start
   ```

3. **Terminal 2:**
   ```powershell
   cd D:\PROJECT\ITB\kilatbox
   node test-register.js
   ```

Atau langsung test di browser: http://localhost:3000

---

**Good luck! 🚀**
