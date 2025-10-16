# 📝 Cara Order CloudKilat VPS - Panduan Lengkap

## 🎯 LANGKAH 1: Login ke CloudKilat Panel

### 1. Buka Browser
```
https://panel.cloudkilat.com
```

### 2. Login
- **Email:** (email yang Anda pakai untuk CloudKilat Storage)
- **Password:** (password akun CloudKilat Anda)

---

## 🎯 LANGKAH 2: Order VPS

### 1. Di Dashboard CloudKilat

Setelah login, Anda akan lihat dashboard. Cari menu:
- **"Cloud VPS"** atau
- **"Compute"** atau
- **"Virtual Server"**

Klik menu tersebut.

### 2. Klik "Create New VPS" atau "Deploy VPS"

### 3. Pilih Spesifikasi VPS

**Untuk Exora ID, pilih:**

| Setting | Value |
|---------|-------|
| **Package** | VPS Small / Standard |
| **CPU** | 1-2 vCPU |
| **RAM** | **2 GB** (minimum) |
| **Storage** | 40 GB SSD |
| **Operating System** | **Ubuntu 22.04 LTS** ⬅️ PENTING! |
| **Region** | **Jakarta (id-jkt-1)** |
| **Billing** | Monthly / Hourly (pilih sesuai kebutuhan) |

### 4. Konfigurasi Access

Ada 2 pilihan akses SSH:

#### Option A: Password (Lebih Mudah)
- Set password untuk user `root`
- Password minimal 8 karakter
- CATAT password ini!

#### Option B: SSH Key (Lebih Aman)
- Upload SSH public key Anda
- Atau generate baru di panel

**Rekomendasi untuk pemula: Pilih PASSWORD dulu**

### 5. Hostname (Optional)

Beri nama VPS Anda:
```
Exora ID-server
```

### 6. Review & Confirm

Check harga dan spesifikasi:
```
Estimasi: Rp 75.000 - 150.000/bulan
```

### 7. Klik "Create" atau "Deploy"

---

## ⏳ LANGKAH 3: Tunggu VPS Provisioning

### Proses Deployment
- **Waktu:** 2-10 menit
- **Status:** Akan berubah dari "Deploying" → "Running"

### Refresh halaman VPS list sampai status = **"Running"**

---

## 📝 LANGKAH 4: Dapatkan Info VPS

Setelah VPS status **"Running"**, klik VPS tersebut untuk lihat detail.

### CATAT INFO INI (PENTING!):

```
═══════════════════════════════════════
   VPS CREDENTIALS - SAVE THIS!
═══════════════════════════════════════

IP Address: ___________________________
(Contoh: 103.123.45.67)

Username: root
(atau: ubuntu - tergantung konfigurasi)

Password: ___________________________
(password yang Anda set tadi)

SSH Command:
ssh root@YOUR_IP_ADDRESS

═══════════════════════════════════════
```

**SIMPAN INFO DI ATAS!** Anda akan butuh untuk SSH nanti.

---

## ✅ LANGKAH 5: Test SSH Connection

### Di PowerShell Lokal Anda:

```powershell
# Ganti dengan IP VPS yang sebenarnya
ssh root@103.123.45.67
```

**Contoh:**
- Jika IP VPS = `103.123.45.67`
- Command: `ssh root@103.123.45.67`

### Jika Muncul Warning (First Time):

```
The authenticity of host '103.123.45.67' can't be established.
Are you sure you want to continue connecting (yes/no)?
```

**Ketik:** `yes` dan Enter

### Masukkan Password

Ketik password VPS (yang Anda set tadi) dan Enter.

**Note:** Password tidak akan terlihat saat diketik (normal)

### Berhasil SSH!

Jika berhasil, Anda akan lihat prompt seperti:
```
root@Exora ID-server:~#
```

🎉 **SUKSES!** Anda sudah masuk ke VPS!

---

## 🚨 Troubleshooting

### Error: "Connection refused"
- **Penyebab:** VPS belum selesai provisioning
- **Solusi:** Tunggu 5 menit lagi, refresh status VPS di panel

### Error: "Permission denied"
- **Penyebab:** Password salah
- **Solusi:** Cek kembali password, atau reset di CloudKilat panel

### Error: "No route to host"
- **Penyebab:** IP address salah atau firewall
- **Solusi:** Double check IP di CloudKilat panel

### Error: "Host key verification failed"
- **Solusi:** 
  ```powershell
  # Hapus old key
  ssh-keygen -R YOUR_VPS_IP
  
  # Try SSH lagi
  ssh root@YOUR_VPS_IP
  ```

---

## 📞 Jika Masih Bermasalah

### Hubungi Support CloudKilat:
- **Email:** support@cloudkilat.com
- **Live Chat:** Di panel.cloudkilat.com (kanan bawah)
- **Ticket:** Buat ticket di panel

---

## ✅ Checklist Sebelum Lanjut

- [ ] Login ke panel.cloudkilat.com berhasil
- [ ] VPS deployed dengan Ubuntu 22.04
- [ ] Status VPS = "Running"
- [ ] IP Address sudah dicatat
- [ ] Password sudah dicatat
- [ ] SSH test berhasil (bisa login ke VPS)

---

## 🎯 SETELAH SSH BERHASIL

**Beritahu saya:**
```
✅ VPS sudah ready!
IP: 103.xxx.xxx.xxx (IP VPS Anda)
SSH: Berhasil login
```

**Lalu saya akan:**
1. ✅ Upload semua automation scripts ke VPS
2. ✅ Guide Anda step-by-step jalankan scripts
3. ✅ Deploy Exora ID dalam 30 menit!

---

## 📊 Info Harga CloudKilat VPS (Oktober 2025)

| Package | vCPU | RAM | Storage | Harga/Bulan* |
|---------|------|-----|---------|--------------|
| Micro | 1 | 1 GB | 20 GB | ~Rp 50.000 |
| **Small** | 1 | **2 GB** | 40 GB | **~Rp 75-150k** ⬅️ Recommended |
| Medium | 2 | 4 GB | 80 GB | ~Rp 200-300k |

*Harga bisa berbeda, cek di panel CloudKilat

---

**Silakan order VPS sekarang!** 🚀

**Kabari saya setelah VPS ready dan Anda sudah SSH masuk!**
