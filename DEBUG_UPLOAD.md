# 🔍 Debug Upload - Panduan Langkah per Langkah

## Status Saat Ini
- ✅ Server berjalan di port 3000
- ✅ Database terhubung
- ✅ User `volodyaa@gmail.com` ada di database
- ❓ Upload file tidak bekerja dari browser

## Langkah Debug:

### 1. Buka Dashboard
1. Buka browser (Chrome/Edge)
2. Tekan `F12` untuk buka Developer Tools
3. Buka tab **Console**
4. Buka tab **Network**
5. Akses: `http://localhost:3000/dashboard.html`

### 2. Login Manual (jika belum login)
Jalankan ini di Console browser:
```javascript
// Login
fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'volodyaa@gmail.com',
        password: 'PASSWORD_ANDA' // Ganti dengan password yang benar
    })
})
.then(r => r.json())
.then(data => {
    if(data.token) {
        localStorage.setItem('token', data.token);
        console.log('✅ Login berhasil!');
        window.location.reload();
    } else {
        console.error('❌ Login gagal:', data);
    }
});
```

### 3. Test Upload dari Console
```javascript
// Test upload dengan file dummy
const testUpload = async () => {
    const token = localStorage.getItem('token');
    
    // Buat file dummy
    const content = 'Test file content';
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('http://localhost:3000/api/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        console.log('Response:', data);
        
        if(response.ok) {
            console.log('✅ Upload berhasil!');
        } else {
            console.error('❌ Upload gagal:', data);
        }
    } catch(error) {
        console.error('❌ Error:', error);
    }
};

testUpload();
```

### 4. Cek Error yang Muncul

Perhatikan di Console:
- **401 Unauthorized**: Token tidak valid atau tidak ada
- **403 Forbidden**: Storage quota habis atau subscription tidak aktif
- **413 Payload Too Large**: File terlalu besar (>100MB)
- **500 Internal Server Error**: Error di server (cek S3 connection)

Perhatikan di Network tab:
- Cek request **upload** 
- Lihat **Headers**: apakah Authorization ada?
- Lihat **Payload**: apakah file terkirim?
- Lihat **Response**: apa error message-nya?

### 5. Test Upload dari UI

1. Klik tombol **Upload File**
2. Pilih file kecil (< 1MB)
3. Perhatikan Console untuk error
4. Perhatikan Network tab untuk request

### 6. Kemungkinan Masalah & Solusi

#### A. Token Tidak Ada / Invalid
**Gejala**: Error 401 Unauthorized
**Solusi**: 
```javascript
// Cek token
console.log('Token:', localStorage.getItem('token'));

// Jika null, login ulang dari index.html
```

#### B. Subscription Tidak Aktif
**Gejala**: Error 403 Forbidden dengan message "No active subscription"
**Solusi**: Cek di database apakah user punya subscription aktif

#### C. Storage Quota Habis
**Gejala**: Error 403 Forbidden dengan message "Storage quota exceeded"
**Solusi**: 
```sql
-- Cek storage usage
SELECT 
    u.email,
    us.storage_used,
    sp.storage_limit,
    (sp.storage_limit - us.storage_used) as remaining
FROM users u
JOIN user_subscriptions us ON u.id = us.user_id
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE u.email = 'volodyaa@gmail.com';
```

#### D. File Input Tidak Bekerja
**Gejala**: Tidak ada yang terjadi saat pilih file
**Solusi**: Cek event listener di dashboard.html
```javascript
// Test file input
const fileInput = document.getElementById('fileInput');
console.log('File input:', fileInput);
fileInput.addEventListener('change', (e) => {
    console.log('File selected:', e.target.files[0]);
});
```

#### E. S3 Connection Error
**Gejala**: Error 500 dengan message terkait S3
**Solusi**: 
- Cek .env credentials
- Test koneksi S3:
```bash
node test-cloudkilat.js
```

## Quick Test Commands

### Test Server
```powershell
# Cek server running
Test-NetConnection localhost -Port 3000
```

### Test Database
```javascript
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: 'postgres://postgres:123qwe123@localhost:5432/kilatbox' }); pool.query('SELECT * FROM user_subscriptions WHERE user_id = 1').then(res => { console.log(JSON.stringify(res.rows, null, 2)); pool.end(); });"
```

### Test S3
```bash
node test-cloudkilat.js
```

## Hasil yang Diharapkan

Setelah upload berhasil:
- ✅ Toast notification muncul: "File uploaded successfully!"
- ✅ File muncul di list
- ✅ Storage stats terupdate
- ✅ Progress bar menunjukkan 100%

## Informasi Tambahan

### File Upload Endpoint
```
POST http://localhost:3000/api/files/upload
Headers:
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data
Body:
  - file: (binary)
```

### Response Berhasil
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 123,
    "file_name": "test.txt",
    "file_size": 1024,
    "file_url": "https://...",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Langkah Selanjutnya

1. **Lakukan langkah 1-5** di atas
2. **Catat error yang muncul** di Console/Network
3. **Screenshot error** jika perlu
4. **Laporkan hasil** untuk analisis lebih lanjut

---

**Catatan**: Pastikan server tetap berjalan dengan `node server.js` di terminal terpisah!
