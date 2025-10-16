# Exora ID - Platf## 📋 Deskripsi Proyek

**Exora ID** adalah platform manajemen file berbasis cloud yang memungkinkan user untuk:
- 📤 Upload file ke cloud storage (CloudKilat)
- 📥 Download file dengan presigned URL
- 🗑️ Hapus file dari storage
- 📊 Monitor penggunaan storage real-timeajemen File Berbasis Cloud 🚀

<div align="center">

![Exora ID](https://img.shields.io/badge/Exora%20ID-Cloud%20Storage-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

**Platform web modern untuk upload, download, dan manage file menggunakan CloudKilat Storage**

[Quick Start](#-quick-start) • [Dokumentasi](#-dokumentasi) • [API Testing](#-api-testing) • [Demo](#-demo)

</div>

---

## � Deskripsi Proyek

**Exora ID** adalah sistem manajemen file berbasis cloud yang memungkinkan user untuk:
- 📤 Upload file ke cloud storage (CloudKilat)
- 📥 Download file dengan presigned URL
- 🗑️ Hapus file dari storage
- 📊 Monitor penggunaan storage real-time
- 👤 Manajemen akun user dengan autentikasi JWT

## ✨ Fitur Utama

### Sudah Diimplementasikan ✅
- ✅ **Authentication System**
  - Register user baru
  - Login dengan JWT token (expires 7 hari)
  - Password hashing dengan bcrypt
  - Protected routes dengan middleware
  
- ✅ **File Management**
  - Upload file ke CloudKilat Storage (max 100MB)
  - List semua file dengan metadata lengkap
  - Download file via presigned URL (expires 15 menit)
  - Delete file dari storage dan database
  - File type validation & size limit
  
- ✅ **Storage Management**
  - Real-time storage usage tracking
  - Storage limit per user (default 1GB)
  - Storage statistics & visualization
  - Automatic storage quota enforcement
  
- ✅ **User Interface**
  - Modern responsive dashboard
  - Drag & drop file upload
  - File icons berdasarkan tipe
  - Storage progress bar
  - User profile management
  
### Fitur Tambahan (Opsional) 🔄
- 🔄 Paket Storage Berbayar (upgrade storage)
- 🔄 Admin Panel untuk monitoring
- 🔄 File sharing dengan public/private links
- 🔄 Folder organization
- 🔄 File preview untuk images & PDFs

## � Quick Start

**Ingin langsung mencoba? Ikuti langkah sederhana ini:**

```powershell
# 1. Clone atau buka folder proyek
cd d:\PROJECT\ITB\Exora ID

# 2. Install dependencies (sudah dilakukan)
npm install

# 3. Setup database
psql -U postgres -c "CREATE DATABASE Exora ID"
psql -U postgres -d Exora ID -f schema.sql

# 4. Copy dan edit environment variables
copy .env.example .env
notepad .env   # Isi CloudKilat credentials dan DB config

# 5. Jalankan server
npm start

# 6. Buka browser
# http://localhost:3000
```

**� Butuh panduan lengkap?** Lihat [QUICKSTART.md](QUICKSTART.md) atau [SETUP.md](SETUP.md)

---


## �️ Teknologi

| Kategori           | Teknologi                          |
|--------------------|------------------------------------|
| **Frontend**       | HTML5, CSS3, Bootstrap 5, JavaScript ES6+ |
| **Backend**        | Node.js v14+, Express.js v4        |
| **Database**       | PostgreSQL v12+                    |
| **Cloud Storage**  | CloudKilat (Kilat Storage - S3)    |
| **Authentication** | JWT (jsonwebtoken), bcrypt         |
| **File Upload**    | Multer v1.4+                       |
| **S3 SDK**         | @aws-sdk/client-s3 v3              |
| **HTTP Client**    | Fetch API                          |

---

## 📁 Struktur Proyek

```
Exora ID/
├─ server.js              # Server utama
├─ s3.js                  # Konfigurasi S3 client
├─ .env                   # Environment variables
├─ package.json           # Dependencies
├─ schema.sql             # Database schema
├─ /public                # Frontend files
│  ├─ index.html          # Login/Register page
│  ├─ dashboard.html      # User dashboard
│  └─ styles.css          # Custom styles
├─ /routes                # API routes
│  ├─ auth.js             # Authentication routes
│  └─ files.js            # File management routes
├─ /models                # Database models
│  └─ db.js               # Database connection
└─ /middleware            # Express middleware
   └─ auth.js             # JWT verification middleware
```

```
Exora ID/
├── 📄 server.js                    # Main server & Express config
├── 📄 s3.js                        # CloudKilat S3 client setup
├── 📄 package.json                 # Dependencies & scripts
├── � schema.sql                   # Database schema
├── 📄 .env.example                 # Environment template
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 models/
│   └── db.js                       # PostgreSQL connection pool
│
├── 📂 middleware/
│   └── auth.js                     # JWT verification middleware
│
├── 📂 routes/
│   ├── auth.js                     # Auth routes (register/login)
│   └── files.js                    # File management routes
│
├── 📂 public/
│   ├── index.html                  # Login/Register page
│   └── dashboard.html              # User dashboard
│
└── 📂 docs/
    ├── README.md                   # This file
    ├── SETUP.md                    # Detailed setup guide
    ├── QUICKSTART.md               # Quick start guide
    ├── API_TESTING.md              # API testing documentation
    ├── LAPORAN.md                  # Complete project report
    └── Exora ID.postman_collection.json  # Postman collection
```

---

## �📚 Dokumentasi

| Dokumen | Deskripsi |
|---------|-----------|
| [README.md](README.md) | Overview proyek (you are here) |
| [QUICKSTART.md](QUICKSTART.md) | Panduan cepat 5 menit |
| [SETUP.md](SETUP.md) | Setup lengkap step-by-step |
| [API_TESTING.md](API_TESTING.md) | Testing API dengan Postman |
| [LAPORAN.md](LAPORAN.md) | Laporan proyek lengkap |

---

## 🔌 API Endpoints

### Authentication
```http
POST   /api/auth/register    # Register user baru
POST   /api/auth/login       # Login user
GET    /api/auth/me          # Get current user (protected)
```

### File Management
```http
GET    /api/files            # List semua file user (protected)
POST   /api/files/upload     # Upload file baru (protected)
GET    /api/files/download/:id   # Get download URL (protected)
DELETE /api/files/delete/:id     # Delete file (protected)
GET    /api/files/stats      # Get storage statistics (protected)
```

### System
```http
GET    /api/health           # Health check
```

**📖 Detail lengkap:** Lihat [API_TESTING.md](API_TESTING.md)

---

## 🧪 API Testing

### Option 1: Postman (Recommended)

```powershell
# Import Postman Collection
# File: Exora ID.postman_collection.json
```

1. Buka Postman
2. Import `Exora ID.postman_collection.json`
3. Setup environment variable `base_url` = `http://localhost:3000`
4. Test endpoints satu per satu

### Option 2: Manual Testing

```powershell
# Register user
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}'

# Login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'
```

**📖 Testing lengkap:** Lihat [API_TESTING.md](API_TESTING.md)

---

## 🎯 Demo

### Halaman Login/Register
![Login Page](https://via.placeholder.com/800x400?text=Login+%26+Register+Page)

### Dashboard User
![Dashboard](https://via.placeholder.com/800x400?text=User+Dashboard)

**Note:** Ganti dengan screenshot asli setelah deploy

---

## 🔒 Security Features

- ✅ **Password Hashing** - bcrypt dengan 10 salt rounds
- ✅ **JWT Authentication** - Token expires dalam 7 hari
- ✅ **SQL Injection Protection** - Parameterized queries
- ✅ **File Type Validation** - Whitelist file types
- ✅ **File Size Limit** - Max 100MB per file
- ✅ **Storage Quota** - Enforce per-user limits
- ✅ **User Authorization** - Users can only access their own files
- ✅ **Environment Variables** - Sensitive data not in code
- ✅ **CORS Enabled** - Cross-origin resource sharing

---

## 🚀 Deployment

### Development
```powershell
npm run dev  # Auto-reload dengan nodemon
```

### Production

#### Option 1: VPS/Cloud Server
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name Exora ID

# Auto-restart on server reboot
pm2 startup
pm2 save
```

#### Option 2: Render.com
1. Push code ke GitHub
2. Connect repository di Render
3. Set environment variables
4. Deploy

#### Option 3: Heroku
```bash
heroku create Exora ID
heroku config:set DATABASE_URL=...
heroku config:set CLOUDKILAT_ACCESS_KEY=...
git push heroku main
```

**📖 Deployment lengkap:** Lihat [SETUP.md](SETUP.md)

---

## 🐛 Troubleshooting

### Database Connection Error
```powershell
# Check PostgreSQL service
Get-Service postgresql*

# Test connection
psql -U postgres -d Exora ID
```

### S3 Connection Error
- Verify CloudKilat credentials in `.env`
- Check bucket name matches
- Ensure bucket exists in CloudKilat panel

### Port Already in Use
```powershell
# Change PORT in .env
PORT=3001
```

**📖 Troubleshooting lengkap:** Lihat [SETUP.md](SETUP.md)

---

## 📊 Database Schema

### Table: users
| Column        | Type      | Description          |
|---------------|-----------|----------------------|
| id            | SERIAL    | Primary key          |
| name          | VARCHAR   | User's full name     |
| email         | VARCHAR   | Unique email         |
| password      | VARCHAR   | Hashed password      |
| storage_used  | BIGINT    | Bytes used           |
| storage_limit | BIGINT    | Bytes limit (1GB)    |
| created_at    | TIMESTAMP | Registration date    |

### Table: files
| Column        | Type      | Description          |
|---------------|-----------|----------------------|
| id            | SERIAL    | Primary key          |
| user_id       | INTEGER   | FK to users          |
| file_name     | VARCHAR   | Generated filename   |
| original_name | VARCHAR   | Original filename    |
| object_key    | VARCHAR   | S3 object key        |
| mime_type     | VARCHAR   | File MIME type       |
| size          | BIGINT    | File size (bytes)    |
| uploaded_at   | TIMESTAMP | Upload timestamp     |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## � Author

**Your Name**
- Email: your-email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- [CloudKilat](https://cloudkilat.com) untuk S3-compatible storage
- [Express.js](https://expressjs.com/) untuk backend framework
- [Bootstrap](https://getbootstrap.com/) untuk UI components
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) untuk S3 integration

---

## 📞 Support

Butuh bantuan? Buka issue di GitHub atau hubungi via email.

---

<div align="center">

**Made with ❤️ using Node.js & CloudKilat**

[⬆ Back to Top](#Exora ID---sistem-manajemen-file-berbasis-cloud-)

</div>

