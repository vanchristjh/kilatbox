# Panduan Setup KilatBox

## 📋 Prerequisites

Pastikan Anda sudah menginstall:
- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- Akun CloudKilat dengan akses ke Kilat Storage

## 🔧 Langkah-langkah Setup

### 1. Setup Database PostgreSQL

#### Windows (menggunakan pgAdmin atau psql):

```sql
-- Buka PostgreSQL shell atau pgAdmin
-- Buat database baru
CREATE DATABASE kilatbox;

-- Koneksi ke database kilatbox
\c kilatbox

-- Jalankan schema.sql
-- Copy-paste isi dari file schema.sql atau jalankan:
\i 'path/to/schema.sql'
```

#### Alternative: Menggunakan Command Line

```powershell
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE kilatbox;

# Keluar
\q

# Import schema
psql -U postgres -d kilatbox -f schema.sql
```

### 2. Setup CloudKilat Storage

1. Login ke [CloudKilat](https://panel.cloudkilat.com)
2. Buka menu **Kilat Storage**
3. Klik **Create Bucket**
4. Beri nama bucket, misalnya: `kilatbox-storage`
5. Catat informasi berikut:
   - **Endpoint**: `https://s3-id-jkt-1.kilatstorage.id`
   - **Access Key ID**: `00f40347ce0451733558`
   - **Secret Access Key**: (dari menu API Keys)

### 3. Konfigurasi Environment Variables

```powershell
# Copy file .env.example menjadi .env
copy .env.example .env

# Edit file .env dan isi dengan konfigurasi Anda
notepad .env
```

Isi file `.env`:

```env
# CloudKilat Storage Configuration
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=isi_secret_key_anda
S3_BUCKET_NAME=kilatbox-storage

# JWT Secret (ganti dengan string random yang aman)
JWT_SECRET=ganti_dengan_string_random_yang_panjang_dan_aman

# Database Configuration
DATABASE_URL=postgres://postgres:password_anda@localhost:5432/kilatbox

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Install Dependencies

```powershell
npm install
```

### 5. Setup Database Schema

```powershell
# Menggunakan psql
psql -U postgres -d kilatbox -f schema.sql

# Atau jalankan manual SQL di pgAdmin
```

### 6. Jalankan Server

```powershell
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

### 7. Buka Aplikasi

Buka browser dan akses: `http://localhost:3000`

## ✅ Testing

### Test Manual dengan Browser

1. Buka `http://localhost:3000`
2. Daftar akun baru
3. Login dengan akun yang sudah dibuat
4. Coba upload file
5. Coba download file
6. Coba delete file

### Test dengan Postman

#### 1. Register User

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### 2. Login User

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

Response akan berisi token JWT - copy token ini
```

#### 3. Get User Info

```
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 4. Upload File

```
POST http://localhost:3000/api/files/upload
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Body: 
- file: [pilih file dari komputer]
```

#### 5. List Files

```
GET http://localhost:3000/api/files
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 6. Get Storage Stats

```
GET http://localhost:3000/api/files/stats
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 7. Download File

```
GET http://localhost:3000/api/files/download/:file_id
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 8. Delete File

```
DELETE http://localhost:3000/api/files/delete/:file_id
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🐛 Troubleshooting

### Error: Database connection failed

- Pastikan PostgreSQL sudah berjalan
- Cek `DATABASE_URL` di file `.env` sudah benar
- Cek username dan password PostgreSQL

### Error: S3 connection failed

- Pastikan kredensial CloudKilat sudah benar
- Cek `CLOUDKILAT_ACCESS_KEY` dan `CLOUDKILAT_SECRET_KEY`
- Pastikan bucket sudah dibuat di CloudKilat
- Cek nama bucket di `S3_BUCKET_NAME`

### Error: Port already in use

```powershell
# Ganti PORT di .env ke port lain, misalnya:
PORT=3001
```

### Error: JWT token invalid

- Token mungkin sudah expired (7 hari)
- Login ulang untuk mendapatkan token baru
- Pastikan `JWT_SECRET` di .env sama dengan saat generate token

## 📦 Deployment ke Production

### 1. Update Environment Variables

```env
NODE_ENV=production
DATABASE_URL=postgres://user:pass@production-host:5432/kilatbox
```

### 2. Deploy ke VPS/Cloud

```powershell
# Install PM2 untuk process management
npm install -g pm2

# Jalankan server dengan PM2
pm2 start server.js --name kilatbox

# Auto-restart saat server reboot
pm2 startup
pm2 save
```

### 3. Deploy ke Render/Heroku

- Push ke GitHub
- Connect repository di Render/Heroku
- Set environment variables
- Deploy

## 🔒 Security Checklist

- ✅ Ganti `JWT_SECRET` dengan string random yang kuat
- ✅ Jangan commit file `.env` ke Git
- ✅ Gunakan HTTPS di production
- ✅ Set NODE_ENV=production di production
- ✅ Limit file upload size sesuai kebutuhan
- ✅ Implement rate limiting (opsional)
- ✅ Enable CORS hanya untuk domain yang dipercaya

## 📚 Resource

- [CloudKilat Documentation](https://docs.cloudkilat.com)
- [AWS S3 SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
