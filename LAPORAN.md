# KilatBox - Laporan Proyek

## 📌 Informasi Proyek

**Judul:** Rancang Bangun Sistem Manajemen File Berbasis Cloud Menggunakan Kilat Storage

**Deskripsi:** Sistem web untuk upload, download, dan hapus file dengan penyimpanan cloud menggunakan CloudKilat Storage

**Teknologi:**
- Backend: Node.js + Express.js
- Frontend: HTML, CSS, Bootstrap 5, JavaScript
- Database: PostgreSQL
- Cloud Storage: CloudKilat (Kilat Storage - S3 Compatible)
- Authentication: JWT + bcrypt
- File Upload: Multer + AWS S3 SDK v3

---

## ✅ Fitur yang Telah Diimplementasikan

### 1. ✅ Sistem Autentikasi
- [x] Register user baru
- [x] Login user dengan email & password
- [x] JWT token authentication (berlaku 7 hari)
- [x] Password hashing dengan bcrypt (10 salt rounds)
- [x] Middleware untuk protect routes
- [x] Get current user info

### 2. ✅ Manajemen File
- [x] Upload file ke CloudKilat Storage
- [x] List semua file user
- [x] Download file (presigned URL)
- [x] Delete file dari storage dan database
- [x] File metadata tracking (nama, ukuran, tipe, tanggal upload)
- [x] Generate unique filename untuk avoid conflicts
- [x] File type validation
- [x] File size limit (max 100MB)

### 3. ✅ Storage Management
- [x] Track storage usage per user
- [x] Storage limit per user (default 1GB)
- [x] Storage statistics API
- [x] Auto update storage used saat upload/delete
- [x] Storage overflow prevention

### 4. ✅ User Interface
- [x] Landing page dengan login/register form
- [x] Dashboard user dengan:
  - Storage statistics (used, available, percentage)
  - Upload zone (click & drag-drop)
  - File list dengan icons
  - Download & delete actions
  - User profile modal
- [x] Responsive design (mobile-friendly)
- [x] Modern UI dengan gradient & animations
- [x] Bootstrap Icons integration

### 5. ✅ Security Features
- [x] JWT token-based authentication
- [x] Password hashing
- [x] SQL injection protection (parameterized queries)
- [x] File type validation
- [x] User authorization (users can only access their own files)
- [x] CORS enabled
- [x] Environment variables untuk sensitive data

---

## 📂 Struktur Proyek

```
kilatbox/
├── server.js                 # Main server file
├── s3.js                     # CloudKilat S3 client configuration
├── package.json              # Dependencies
├── .env                      # Environment variables (private)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── schema.sql                # Database schema
├── README.md                 # Project documentation
├── SETUP.md                  # Setup instructions
├── API_TESTING.md            # API testing guide
├── LAPORAN.md                # This file
│
├── /models
│   └── db.js                 # PostgreSQL connection
│
├── /middleware
│   └── auth.js               # JWT verification middleware
│
├── /routes
│   ├── auth.js               # Authentication routes
│   └── files.js              # File management routes
│
└── /public
    ├── index.html            # Login/Register page
    └── dashboard.html        # User dashboard
```

---

## 🗄️ Database Schema

### Tabel: users
| Field          | Type      | Description                    |
|----------------|-----------|--------------------------------|
| id             | SERIAL    | Primary key                    |
| name           | VARCHAR   | User's full name               |
| email          | VARCHAR   | User's email (unique)          |
| password       | VARCHAR   | Hashed password                |
| storage_used   | BIGINT    | Storage used in bytes          |
| storage_limit  | BIGINT    | Storage limit in bytes (1GB)   |
| created_at     | TIMESTAMP | Registration date              |
| updated_at     | TIMESTAMP | Last update date               |

### Tabel: files
| Field          | Type      | Description                    |
|----------------|-----------|--------------------------------|
| id             | SERIAL    | Primary key                    |
| user_id        | INTEGER   | Foreign key to users           |
| file_name      | VARCHAR   | Generated filename             |
| original_name  | VARCHAR   | Original filename              |
| object_key     | VARCHAR   | S3 object key (unique)         |
| mime_type      | VARCHAR   | File MIME type                 |
| size           | BIGINT    | File size in bytes             |
| uploaded_at    | TIMESTAMP | Upload timestamp               |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint           | Description        | Auth Required |
|--------|-------------------|--------------------|---------------|
| POST   | /api/auth/register | Register new user  | No            |
| POST   | /api/auth/login    | Login user         | No            |
| GET    | /api/auth/me       | Get current user   | Yes           |

### File Management
| Method | Endpoint                  | Description           | Auth Required |
|--------|---------------------------|-----------------------|---------------|
| GET    | /api/files                | List all user files   | Yes           |
| POST   | /api/files/upload         | Upload new file       | Yes           |
| GET    | /api/files/download/:id   | Get download URL      | Yes           |
| DELETE | /api/files/delete/:id     | Delete file           | Yes           |
| GET    | /api/files/stats          | Get storage stats     | Yes           |

### System
| Method | Endpoint      | Description    | Auth Required |
|--------|---------------|----------------|---------------|
| GET    | /api/health   | Health check   | No            |

---

## 🎯 Cara Kerja Sistem

### 1. User Registration & Authentication Flow
```
1. User mengisi form register (nama, email, password)
2. Backend hash password menggunakan bcrypt
3. Simpan user ke database PostgreSQL
4. Generate JWT token (expires 7 hari)
5. Return token dan user data ke frontend
6. Frontend simpan token ke localStorage
7. Token digunakan untuk semua request berikutnya
```

### 2. File Upload Flow
```
1. User pilih file dari komputer
2. File di-upload via multipart/form-data
3. Multer terima file ke memory buffer
4. Backend cek storage limit user
5. Generate unique filename (userId/timestamp-random.ext)
6. Upload file ke CloudKilat menggunakan AWS S3 SDK
7. Simpan metadata file ke database
8. Update storage_used user
9. Return success response
```

### 3. File Download Flow
```
1. User klik tombol download
2. Frontend request download URL ke backend
3. Backend generate presigned URL (berlaku 15 menit)
4. Return URL ke frontend
5. Frontend open URL di tab baru
6. User download file dari CloudKilat
```

### 4. File Delete Flow
```
1. User klik tombol delete dan konfirmasi
2. Frontend kirim DELETE request
3. Backend hapus file dari CloudKilat Storage
4. Backend hapus metadata dari database
5. Update storage_used user (kurangi ukuran file)
6. Return success response
7. Frontend refresh file list
```

---

## 🔒 Security Measures

1. **Password Security**
   - Bcrypt hashing dengan 10 salt rounds
   - Password minimal 6 karakter
   - Password tidak pernah disimpan dalam bentuk plain text

2. **JWT Authentication**
   - Token expires dalam 7 hari
   - Token harus disertakan di header Authorization
   - Middleware verifikasi token di setiap protected route

3. **Database Security**
   - Parameterized queries (mencegah SQL injection)
   - User isolation (setiap user hanya bisa akses file sendiri)

4. **File Security**
   - File type validation
   - File size limit (100MB)
   - Unique filename generation
   - Storage limit enforcement

5. **Environment Security**
   - Sensitive data di .env (tidak di-commit ke Git)
   - .gitignore configured properly

---

## 📊 Testing Results

### Manual Testing (Web Interface)
- ✅ Register user baru - **PASS**
- ✅ Login dengan kredensial valid - **PASS**
- ✅ Login dengan kredensial invalid - **PASS** (error message shown)
- ✅ Upload file (PDF, gambar, dokumen) - **PASS**
- ✅ List files di dashboard - **PASS**
- ✅ Download file - **PASS**
- ✅ Delete file - **PASS**
- ✅ Storage statistics update - **PASS**
- ✅ Logout - **PASS**
- ✅ Responsive design - **PASS**

### API Testing (Postman)
- ✅ POST /api/auth/register - **PASS**
- ✅ POST /api/auth/login - **PASS**
- ✅ GET /api/auth/me - **PASS**
- ✅ POST /api/files/upload - **PASS**
- ✅ GET /api/files - **PASS**
- ✅ GET /api/files/stats - **PASS**
- ✅ GET /api/files/download/:id - **PASS**
- ✅ DELETE /api/files/delete/:id - **PASS**
- ✅ Unauthorized access (no token) - **PASS** (401 error)
- ✅ Invalid token - **PASS** (403 error)

---

## 🚀 Deployment Options

### Option 1: Local Development
```bash
npm install
# Setup PostgreSQL & .env
npm run dev
```

### Option 2: VPS/Cloud Server
- Deploy to DigitalOcean, AWS EC2, or similar
- Use PM2 for process management
- Setup Nginx as reverse proxy
- Enable HTTPS with Let's Encrypt

### Option 3: Platform as a Service
- Render.com (recommended for beginners)
- Heroku
- Railway.app
- Vercel (backend only)

---

## 📈 Future Enhancements (Optional)

### Planned Features
- [ ] Admin panel untuk monitoring
- [ ] Paket storage berbayar (upgrade storage limit)
- [ ] File sharing (public/private links)
- [ ] Folder organization
- [ ] File preview (images, PDFs)
- [ ] Search & filter files
- [ ] Bulk upload/delete
- [ ] Activity logs
- [ ] Email notifications
- [ ] Two-factor authentication (2FA)
- [ ] File versioning
- [ ] Trash bin (recover deleted files)

### Performance Optimizations
- [ ] Implement caching (Redis)
- [ ] Database indexing optimization
- [ ] CDN for static assets
- [ ] Compression for file transfers
- [ ] Rate limiting
- [ ] Request pagination

---

## 🎓 Pembelajaran dari Proyek

### Technical Skills Gained
1. ✅ Integration dengan S3-compatible storage (CloudKilat)
2. ✅ JWT authentication implementation
3. ✅ File upload handling dengan Multer
4. ✅ PostgreSQL database design & queries
5. ✅ RESTful API design
6. ✅ Frontend-Backend integration
7. ✅ Presigned URL generation
8. ✅ Environment configuration management

### Best Practices Implemented
1. ✅ Separation of concerns (routes, models, middleware)
2. ✅ Error handling
3. ✅ Input validation
4. ✅ Security best practices
5. ✅ Clean code structure
6. ✅ Documentation

---

## 📝 Kesimpulan

Proyek **KilatBox** berhasil diimplementasikan dengan semua fitur utama yang direncanakan:

1. ✅ Sistem autentikasi lengkap dengan JWT
2. ✅ Upload file ke CloudKilat Storage
3. ✅ Download file dari CloudKilat
4. ✅ Delete file
5. ✅ Storage management & tracking
6. ✅ User dashboard yang user-friendly
7. ✅ Responsive web design

Sistem berjalan dengan baik dan siap untuk:
- Development & testing
- Demo presentasi
- Production deployment (dengan konfigurasi tambahan)

**Teknologi yang digunakan sudah modern dan scalable**, sehingga sistem ini dapat dikembangkan lebih lanjut dengan fitur-fitur tambahan sesuai kebutuhan.

---

## 👥 Credits

**Developed by:** [Your Name]
**Project:** Sistem Manajemen File Berbasis Cloud
**Technology:** Node.js, Express, PostgreSQL, CloudKilat Storage
**Date:** October 2025

---

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: [your-email@example.com]
- Documentation: Lihat README.md dan SETUP.md
- API Reference: Lihat API_TESTING.md

---

**KilatBox** - Cloud Storage Made Simple 🚀
