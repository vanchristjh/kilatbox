# 🚀 Deploy Exora ID ke Railway - Panduan Lengkap

## ✅ Keunggulan Railway vs VPS Manual

| Feature | Railway | VPS Manual |
|---------|---------|------------|
| **Setup Time** | 10 menit | 1-2 jam |
| **Coding Required** | ❌ Tidak | ✅ Ya (SSH, bash scripts) |
| **Database Setup** | ✅ Otomatis | ❌ Manual (PostgreSQL install) |
| **SSL Certificate** | ✅ Otomatis | ❌ Manual (Let's Encrypt) |
| **Auto Deploy** | ✅ Ya (dari GitHub) | ❌ Manual (git pull) |
| **Monitoring** | ✅ Built-in | ❌ Manual (PM2) |
| **Cost** | $5/bulan (gratis trial) | Rp180k/bulan |
| **Domain** | ✅ Auto (.railway.app) | ❌ Hanya IP |

---

## 📋 STEP 1: Buka Railway (2 menit)

### 1.1 Buka Railway Website

```
https://railway.app
```

### 1.2 Sign Up / Login

**Pilih:** Login with GitHub

- Klik **"Login with GitHub"**
- Authorize Railway untuk akses GitHub
- **GUNAKAN AKUN GITHUB YANG SAMA:** `vanchristjh`

✅ **Railway akan langsung detect repository Anda!**

---

## 📋 STEP 2: Create New Project (3 menit)

### 2.1 Di Railway Dashboard

Klik **"New Project"** atau **"Deploy from GitHub repo"**

### 2.2 Pilih Repository

- Cari repository: **`Exora ID`**
- Klik repository **`vanchristjh/Exora ID`**

### 2.3 Railway Auto-Detect

Railway akan otomatis detect:
- ✅ Node.js project (dari `package.json`)
- ✅ Start command: `npm start` (dari `package.json`)
- ✅ Port: 3000 (dari `server.js`)

### 2.4 Klik "Deploy Now"

Railway akan mulai build dan deploy!

---

## 📋 STEP 3: Add PostgreSQL Database (2 menit)

### 3.1 Di Railway Project Dashboard

- Klik **"+ New"** atau **"Add Service"**
- Pilih **"Database"**
- Pilih **"PostgreSQL"**

### 3.2 Railway Auto-Setup

Railway akan otomatis:
- ✅ Create PostgreSQL instance
- ✅ Generate `DATABASE_URL`
- ✅ Inject ke environment variables

### 3.3 Import Database Schema

**Di Railway PostgreSQL service:**

1. Klik PostgreSQL service card
2. Klik tab **"Data"** atau **"Query"**
3. Copy isi file `schema.sql` dari repository
4. Paste dan **Execute**

**Atau via Railway CLI** (nanti kita setup):

```bash
railway run psql < schema.sql
```

---

## 📋 STEP 4: Configure Environment Variables (5 menit)

### 4.1 Di Railway Project

- Klik service **`Exora ID`** (bukan PostgreSQL)
- Klik tab **"Variables"** atau **"Environment"**

### 4.2 Add Variables

**Klik "Add Variable" dan masukkan satu per satu:**

```env
# CloudKilat Storage
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=00f40347ce0451733558
CLOUDKILAT_SECRET_KEY=Hml1ntk1WEUwyKr8lZZJkjFm1pQI4AEcx28LAvZL
S3_BUCKET_NAME=Exora ID-storage

# JWT Secret (generate new)
JWT_SECRET=<klik "Generate" atau paste dari generate-secret.js>

# Node Environment
NODE_ENV=production
PORT=3000
```

### 4.3 Generate JWT Secret

**Option A: Use Railway's Generator**
- Railway punya built-in generator
- Klik "Generate" di samping input field

**Option B: Generate Locally**

Di PowerShell local Anda:

```powershell
cd D:\PROJECT\ITB\Exora ID
node generate-secret.js
```

Copy output dan paste ke Railway.

### 4.4 Verify DATABASE_URL

Railway sudah auto-inject `DATABASE_URL` dari PostgreSQL service.

**Verify:**
- Scroll di Variables list
- Cari `DATABASE_URL`
- Harus sudah ada (auto-generated)

Format:
```
postgresql://postgres:xxx@xxx.railway.app:5432/railway
```

### 4.5 Save & Redeploy

- Klik **"Save"** atau **"Apply Changes"**
- Railway akan otomatis **re-deploy** aplikasi

---

## 📋 STEP 5: Wait for Deployment (2-5 menit)

### 5.1 Monitor Build Logs

- Klik tab **"Deployments"** atau **"Logs"**
- Lihat real-time build progress

**Yang Terjadi:**
1. ✅ Railway clone repository
2. ✅ Install dependencies (`npm install`)
3. ✅ Build aplikasi
4. ✅ Start server (`npm start`)
5. ✅ Health check

### 5.2 Wait for "Success" Status

Status akan berubah:
- 🟡 Building...
- 🟡 Deploying...
- 🟢 **Success!** ✅

---

## 📋 STEP 6: Get Your App URL (1 menit)

### 6.1 Di Railway Project Dashboard

- Klik service **`Exora ID`**
- Klik tab **"Settings"**
- Scroll ke **"Domains"**

### 6.2 Generate Domain

Railway akan auto-generate domain:

```
https://Exora ID-production-xxx.up.railway.app
```

**Atau klik "Generate Domain"** jika belum ada.

### 6.3 Copy Domain URL

**COPY URL ini!** Ini adalah alamat aplikasi Anda yang sudah LIVE!

---

## 🎉 STEP 7: TEST APLIKASI! (5 menit)

### 7.1 Open in Browser

Buka URL Railway Anda di browser:

```
https://Exora ID-production-xxx.up.railway.app
```

**Anda akan lihat halaman Exora ID!** 🎉

### 7.2 Test API Health

```
https://Exora ID-production-xxx.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Exora ID API is running",
  "timestamp": "2025-10-17T..."
}
```

### 7.3 Test Register & Login

1. Klik **"Register"**
2. Isi form:
   - Name: Test User
   - Email: test@railway.com
   - Password: testpassword123
3. Klik **"Submit"**
4. **Login** dengan credentials yang sama

### 7.4 Test File Upload

1. Setelah login
2. Click **"Upload File"**
3. Select file (image/document)
4. Upload
5. **Verify file muncul di list!** ✅

### 7.5 Verify Storage di CloudKilat

File akan ter-upload ke **CloudKilat Storage** Anda!

1. Buka: https://panel.cloudkilat.com
2. Go to Kilat Storage
3. Bucket: `Exora ID-storage`
4. **File ada di sini!** 🎉

---

## 📊 Monitoring & Management

### View Logs

Di Railway Dashboard:
- Klik service `Exora ID`
- Tab **"Logs"**
- Real-time application logs

### View Metrics

- Tab **"Metrics"**
- CPU, Memory, Network usage
- Request analytics

### Database Management

- Klik PostgreSQL service
- Tab **"Data"** - Browse tables
- Tab **"Query"** - Run SQL queries

---

## 🔄 Auto-Deploy dari GitHub

### Setup Complete! 🎉

Setiap kali Anda:
1. Push commit ke GitHub (`vanchristjh/Exora ID`)
2. Railway **otomatis detect**
3. **Auto-deploy** versi terbaru!

**Contoh workflow:**

```bash
# Di local
git add .
git commit -m "Add new feature"
git push origin main

# Railway otomatis:
# ✅ Detect push
# ✅ Build
# ✅ Deploy
# ✅ Live in 2-3 menit!
```

---

## 🌐 Custom Domain (Optional)

### Jika Punya Domain Sendiri:

1. **Di Railway:**
   - Settings → Domains
   - Add Custom Domain
   - Masukkan: `yourdomain.com`

2. **Di Domain Provider:**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: @
     Value: [Railway domain]
     ```

3. **SSL Otomatis!**
   - Railway auto-generate SSL certificate
   - HTTPS ready!

---

## 💰 Railway Pricing

### Free Trial:
- **$5 credit gratis** (cukup untuk 1 bulan testing)
- No credit card required untuk trial

### After Trial:
- **$5/month** - Hobby Plan
- Unlimited projects
- 512MB RAM per service
- 1GB storage

### Upgrade ke Team Plan ($20/month):
- 8GB RAM
- Priority support
- Custom domains

---

## 🆘 Troubleshooting

### Deploy Failed

**Check Build Logs:**
- Tab "Deployments" → Klik failed deployment
- Lihat error message

**Common Issues:**
- Missing environment variables → Add di tab Variables
- Database connection error → Verify DATABASE_URL exists
- Port conflict → Railway auto-set PORT, app harus listen to `process.env.PORT`

### App Not Loading

**Check:**
1. Deployment status = Success
2. Logs tidak ada error
3. Health check endpoint working: `/api/health`

### Database Connection Error

**Verify:**
1. PostgreSQL service running
2. DATABASE_URL exists di Variables
3. Schema imported (run `schema.sql`)

### File Upload Not Working

**Check CloudKilat Credentials:**
1. Variables tab
2. Verify: `CLOUDKILAT_ACCESS_KEY`, `CLOUDKILAT_SECRET_KEY`, `S3_BUCKET_NAME`
3. Test CloudKilat Storage di panel

---

## ✅ Deployment Checklist

- [ ] Railway account created (login with GitHub)
- [ ] New project created dari `vanchristjh/Exora ID`
- [ ] PostgreSQL service added
- [ ] Database schema imported (`schema.sql`)
- [ ] Environment variables configured (CloudKilat, JWT, etc)
- [ ] Deployment successful (status = Success)
- [ ] Domain generated (`.railway.app`)
- [ ] Health check working (`/api/health`)
- [ ] Register & Login tested
- [ ] File upload tested
- [ ] Files visible di CloudKilat Storage
- [ ] Auto-deploy configured (dari GitHub)

---

## 🎉 SUCCESS!

**Exora ID sekarang LIVE di Railway!**

### Your Application:
```
🌐 https://Exora ID-production-xxx.up.railway.app
```

### Features Active:
- ✅ Public access (bukan localhost!)
- ✅ HTTPS SSL otomatis
- ✅ PostgreSQL database
- ✅ CloudKilat storage integration
- ✅ Auto-deploy dari GitHub
- ✅ 24/7 uptime
- ✅ Built-in monitoring

---

## 📞 Need Help?

### Railway Support:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Twitter: @Railway

### CloudKilat Support:
- Panel: https://panel.cloudkilat.com
- Support: support@cloudkilat.com

---

**Selamat! Aplikasi Anda sudah bisa diakses dari mana saja! 🚀**

**Railway = Hosting tercepat dan termudah untuk Exora ID!**
