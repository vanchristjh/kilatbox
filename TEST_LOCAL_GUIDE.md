# 🧪 Test Local - Panduan Lengkap

## Status Check ✅

### ✅ Yang Sudah OK:
- ✅ Dependencies installed (npm install)
- ✅ Database PostgreSQL connected
- ✅ CloudKilat credentials valid

### ⚠️ Yang Perlu Diperhatikan:
- ⚠️ CloudKilat bucket belum dibuat

---

## 🚀 Quick Start Testing

### Step 1: Buat CloudKilat Bucket

**Opsi A: Otomatis (Recommended)**
```powershell
node create-bucket.js
```

**Opsi B: Manual di CloudKilat Panel**
1. Buka: https://panel.cloudkilat.com
2. Login dengan akun Anda
3. Pergi ke Storage → Buckets
4. Klik "Create Bucket"
5. Nama: `Exora ID-storage`
6. Region: `id-jkt-1` (Jakarta)
7. Klik "Create"

### Step 2: Verifikasi Database Schema

```powershell
# Check apakah tables sudah dibuat
psql -U postgres -d Exora ID -c "\dt"
```

Jika belum ada tables, jalankan:
```powershell
psql -U postgres -d Exora ID -f schema.sql
```

### Step 3: Start Server

```powershell
npm start
```

Atau dengan nodemon untuk auto-reload:
```powershell
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

### Step 4: Test di Browser

1. **Buka browser:** http://localhost:3000

2. **Test Health Check:**
   ```
   http://localhost:3000/api/health
   ```
   
   Harus return:
   ```json
   {
     "success": true,
     "message": "Exora ID API is running",
     "timestamp": "2025-10-17T..."
   }
   ```

3. **Test Register:**
   - Klik "Register" atau buka http://localhost:3000
   - Isi form registration
   - Submit

4. **Test Login:**
   - Login dengan user yang baru dibuat
   - Harus redirect ke dashboard

5. **Test Upload:**
   - Di dashboard, upload file
   - Verify file muncul di list

6. **Test Download:**
   - Klik file untuk download
   - Verify file downloaded dengan benar

---

## 🧪 Test dengan Postman/Curl

### 1. Health Check
```powershell
curl http://localhost:3000/api/health
```

### 2. Register User
```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"test123\",\"username\":\"testuser\"}'
```

### 3. Login
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"test123\"}'
```

Simpan token dari response!

### 4. Upload File
```powershell
# Gunakan Postman atau script test-upload-debug.js
node test-upload-debug.js
```

### 5. Get Files
```powershell
# Ganti YOUR_TOKEN dengan token dari login
curl http://localhost:3000/api/files `
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 Troubleshooting

### ❌ Error: Cannot connect to database

**Solusi:**
```powershell
# Check PostgreSQL running
Get-Service postgresql*

# Start jika belum running
Start-Service postgresql-x64-15  # atau versi lain

# Test koneksi manual
psql -U postgres -c "SELECT 1;"
```

### ❌ Error: Bucket does not exist

**Solusi:**
```powershell
# Buat bucket
node create-bucket.js

# Atau cek manual di panel
Start-Process "https://panel.cloudkilat.com"
```

### ❌ Error: Port 3000 already in use

**Solusi:**
```powershell
# Cari process yang pakai port 3000
netstat -ano | findstr :3000

# Kill process (ganti PID)
Stop-Process -Id PID -Force

# Atau ganti PORT di .env
# PORT=3001
```

### ❌ Error: JWT malformed

**Solusi:**
```powershell
# Generate JWT secret baru
node generate-secret.js

# Copy hasil ke .env
# JWT_SECRET=hasil_generate
```

### ❌ Error: Module not found

**Solusi:**
```powershell
# Reinstall dependencies
rm -r node_modules
rm package-lock.json
npm install
```

---

## 📊 Testing Checklist

### Backend Testing
- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] CloudKilat bucket accessible
- [ ] Health check endpoint works
- [ ] CORS configured properly

### Authentication Testing
- [ ] Register new user works
- [ ] Login returns JWT token
- [ ] Token validation works
- [ ] Logout works (if implemented)
- [ ] Protected routes require authentication

### File Management Testing
- [ ] Upload file works
- [ ] File appears in database
- [ ] File stored in CloudKilat
- [ ] List files works
- [ ] Download file works
- [ ] Delete file works
- [ ] File size limits respected

### Subscription Testing (if enabled)
- [ ] Free plan assigned on registration
- [ ] Storage quota calculated correctly
- [ ] Can upgrade plan
- [ ] Payment integration works

### Dashboard Testing
- [ ] Statistics display correctly
- [ ] File list renders
- [ ] Upload progress shows
- [ ] Responsive design works
- [ ] Error messages display properly

---

## 🎯 Performance Testing

### Load Test (Optional)
```powershell
# Install Apache Bench (ab) atau use Artillery
npm install -g artillery

# Create artillery config
artillery quick --count 10 --num 100 http://localhost:3000/api/health
```

### Memory Check
```powershell
# Monitor while testing
node --inspect server.js

# Open chrome://inspect
```

---

## 📝 Test Data

### Sample Users
```json
{
  "email": "test@example.com",
  "password": "test123",
  "username": "testuser"
}

{
  "email": "admin@Exora ID.com",
  "password": "admin123",
  "username": "admin"
}
```

### Sample Files to Test
- Small text file (< 1MB)
- Medium image (1-10MB)
- Large video (> 10MB, test if quota allows)
- Various formats: .jpg, .png, .pdf, .doc, .zip

---

## 🔐 Security Testing (Local)

### Check Environment Variables
```powershell
# Pastikan .env tidak di-commit
git status

# Verify .gitignore
cat .gitignore | Select-String ".env"
```

### Test SQL Injection Prevention
```powershell
# Try login dengan SQL injection
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@test.com'\'' OR 1=1--\",\"password\":\"anything\"}'

# Harus return error, bukan success
```

### Test XSS Prevention
- Upload file dengan nama: `<script>alert('xss')</script>.jpg`
- Verify di UI tidak execute script

---

## 📈 Monitoring (Local Development)

### Console Logs
```javascript
// Server sudah punya logging, watch console output
✅ Connected to PostgreSQL database
🚀 Server running on port 3000
📁 File uploaded: ...
```

### Database Monitoring
```powershell
# Check active connections
psql -U postgres -d Exora ID -c "SELECT * FROM pg_stat_activity WHERE datname='Exora ID';"

# Check table sizes
psql -U postgres -d Exora ID -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::text)) FROM pg_tables WHERE schemaname='public';"
```

### CloudKilat Monitoring
```powershell
# List all files in bucket
node -e "require('./test-cloudkilat.js')"
```

---

## ✅ Ready for Deployment?

Jika semua test di atas ✅ PASS, project siap untuk deploy!

### Pre-Deployment Checklist:
- [ ] All local tests passing
- [ ] No errors in console
- [ ] Database schema applied
- [ ] CloudKilat bucket created
- [ ] .env not committed to git
- [ ] Dependencies up to date
- [ ] Security checklist reviewed
- [ ] Documentation updated

### Next Steps:
1. **Push ke GitHub:**
   ```powershell
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Deploy ke Railway:**
   - Follow `DEPLOY_RAILWAY_QUICKSTART.md`

3. **Production Testing:**
   - Test semua endpoint di production URL
   - Monitor logs di Railway dashboard
   - Setup uptime monitoring

---

## 🆘 Still Having Issues?

### Check Logs:
```powershell
# Server logs (jika pakai PM2)
pm2 logs Exora ID

# PostgreSQL logs
# Windows: C:\Program Files\PostgreSQL\15\data\log
# Check latest .log file
```

### Debug Mode:
```powershell
# Set debug mode
$env:DEBUG="*"
npm start
```

### Get Help:
1. Check dokumentasi:
   - `README.md`
   - `TROUBLESHOOT_AUTH.md`
   - `DEBUG_UPLOAD.md`

2. Review error messages carefully
3. Check all environment variables
4. Verify database connection
5. Test CloudKilat credentials

---

## 🎉 Success!

Jika semua test berhasil, Anda akan melihat:

```
✅ Server running on port 3000
✅ Database connected
✅ CloudKilat storage ready
✅ All endpoints working
✅ Files uploading/downloading
✅ Dashboard accessible
```

**Selamat! Project siap untuk production deployment! 🚀**

Lanjut ke: `DEPLOY_RAILWAY_QUICKSTART.md`
