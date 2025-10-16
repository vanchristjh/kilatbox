# ⚙️ Konfigurasi CloudKilat - KilatBox

## 📋 Informasi Akun CloudKilat

### Endpoint & Kredensial
```
Endpoint    : https://s3-id-jkt-1.kilatstorage.id
Access Key  : 00f40347ce0451733558
Secret Key  : [Anda perlu menambahkan Secret Key]
Bucket Name : kilatbox-storage (atau sesuai yang Anda buat)
Region      : id-jkt-1 (Jakarta, Indonesia)
```

---

## 🚀 Langkah Setup CloudKilat Storage

### 1. Login ke CloudKilat Panel
- URL: https://panel.cloudkilat.com
- Login dengan akun Anda

### 2. Buat Bucket Baru
1. Klik menu **"Kilat Storage"** di sidebar
2. Klik tombol **"Create Bucket"** atau **"Buat Bucket"**
3. Isi form:
   - **Bucket Name**: `kilatbox-storage` (atau nama lain yang unik)
   - **Region**: Jakarta (id-jkt-1)
4. Klik **"Create"**

### 3. Dapatkan Secret Key
1. Di CloudKilat Panel, buka menu **"API Keys"** atau **"Access Keys"**
2. Temukan Access Key: `00f40347ce0451733558`
3. Copy **Secret Access Key** yang sesuai
4. **PENTING**: Simpan Secret Key dengan aman!

### 4. Set Permissions (Opsional)
Untuk keamanan, atur bucket permissions:
- **Private**: File hanya bisa diakses dengan credentials
- **Public**: File bisa diakses publik (tidak direkomendasikan)

Untuk proyek ini, gunakan **Private** karena kita menggunakan presigned URL.

---

## 📝 Update File .env

Edit file `.env` dan isi dengan kredensial Anda:

```env
# CloudKilat Storage Configuration
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=PASTE_SECRET_KEY_ANDA_DISINI
S3_BUCKET_NAME=kilatbox-storage

# JWT Secret (ganti dengan random string yang kuat)
JWT_SECRET=kilatbox_jwt_secret_2024_change_this_in_production

# Database Configuration
DATABASE_URL=postgres://postgres:your_password@localhost:5432/kilatbox

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## ✅ Verifikasi Konfigurasi

### Test Koneksi CloudKilat

Setelah mengisi `.env`, jalankan server dan coba upload file:

```powershell
# 1. Jalankan server
npm start

# 2. Buka browser
http://localhost:3000

# 3. Register user baru
# 4. Upload file test
# 5. Cek di CloudKilat Panel apakah file muncul di bucket
```

### Cek di CloudKilat Panel
1. Login ke https://panel.cloudkilat.com
2. Buka **Kilat Storage**
3. Klik bucket `kilatbox-storage`
4. File yang diupload akan muncul dengan struktur:
   ```
   /<user_id>/<timestamp>-<random>.ext
   ```

---

## 🔧 Troubleshooting

### Error: "SignatureDoesNotMatch"
- **Penyebab**: Secret Key salah
- **Solusi**: Cek kembali Secret Key di CloudKilat Panel

### Error: "NoSuchBucket"
- **Penyebab**: Bucket name salah atau belum dibuat
- **Solusi**: 
  1. Cek bucket sudah dibuat di CloudKilat Panel
  2. Pastikan `S3_BUCKET_NAME` di `.env` sama dengan nama bucket

### Error: "InvalidAccessKeyId"
- **Penyebab**: Access Key salah
- **Solusi**: Verifikasi Access Key = `00f40347ce0451733558`

### Error: "Connection Timeout"
- **Penyebab**: Endpoint salah atau network issue
- **Solusi**: 
  1. Pastikan endpoint = `https://s3-id-jkt-1.kilatstorage.id`
  2. Cek koneksi internet

### Error: "Access Denied"
- **Penyebab**: Permissions bucket salah
- **Solusi**: 
  1. Buka bucket settings di CloudKilat Panel
  2. Pastikan Access Key memiliki permission untuk bucket ini

---

## 📊 Struktur File di Bucket

Setelah upload, file akan tersimpan dengan struktur:

```
kilatbox-storage/
├── 1/                          # User ID 1
│   ├── 1729123456000-abc123.pdf
│   ├── 1729123789000-def456.jpg
│   └── 1729124000000-ghi789.docx
├── 2/                          # User ID 2
│   ├── 1729125000000-xyz123.png
│   └── 1729126000000-uvw456.zip
└── 3/                          # User ID 3
    └── 1729127000000-rst789.mp4
```

Setiap user memiliki folder sendiri (berdasarkan ID) untuk isolasi data.

---

## 🔐 Keamanan

### Best Practices:
1. ✅ **Jangan commit** file `.env` ke Git
2. ✅ **Gunakan Secret Key yang kuat**
3. ✅ **Set bucket ke Private**
4. ✅ **Gunakan presigned URL** untuk download (expires 15 menit)
5. ✅ **Rotate keys** secara berkala
6. ✅ **Monitor usage** di CloudKilat Panel

### Production Checklist:
- [ ] Ganti `JWT_SECRET` dengan random string yang panjang
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Backup Secret Key di tempat aman
- [ ] Setup monitoring & alerts
- [ ] Review bucket permissions

---

## 📈 Monitoring

### Cek Usage di CloudKilat Panel
1. Login ke https://panel.cloudkilat.com
2. Buka **Kilat Storage**
3. Lihat dashboard untuk:
   - Total storage used
   - Number of objects
   - Bandwidth usage
   - Request statistics

### Database Monitoring
Query untuk cek total storage per user:
```sql
SELECT 
  u.id,
  u.name,
  u.email,
  u.storage_used,
  u.storage_limit,
  COUNT(f.id) as total_files
FROM users u
LEFT JOIN files f ON u.id = f.user_id
GROUP BY u.id;
```

---

## 💡 Tips

1. **Naming Convention**: Gunakan nama bucket yang deskriptif dan unik
2. **Backup**: Aktifkan versioning di bucket untuk backup otomatis
3. **Cost Optimization**: Monitor storage usage untuk mengontrol biaya
4. **Performance**: Endpoint Jakarta (id-jkt-1) memberikan latency rendah untuk user di Indonesia
5. **Testing**: Gunakan bucket terpisah untuk development dan production

---

## 📞 Support

Jika mengalami masalah dengan CloudKilat:
- **Email**: support@cloudkilat.com
- **Documentation**: https://docs.cloudkilat.com
- **Panel**: https://panel.cloudkilat.com

---

**✅ Konfigurasi Siap!**

Setelah mengisi Secret Key di file `.env`, sistem KilatBox Anda siap digunakan dengan CloudKilat Storage! 🚀
