# 🚀 Cara Deploy KilatBox - Mulai Di Sini!

## Pilihan Tercepat (Rekomendasi)

### 🏆 Railway.app - 10 Menit Deploy!
**Paling mudah dan gratis untuk mulai**

👉 **Baca panduan lengkap:** `DEPLOY_RAILWAY_QUICKSTART.md`

**TL;DR:**
1. Push ke GitHub
2. Connect ke Railway
3. Add PostgreSQL
4. Set 7 environment variables
5. Done! ✅

---

## 📚 Panduan Lengkap

- **`DEPLOY_RAILWAY_QUICKSTART.md`** - Panduan step-by-step Railway (MULAI DI SINI!)
- **`DEPLOYMENT_GUIDE.md`** - Panduan lengkap semua opsi hosting
- **`SECURITY_CHECKLIST.md`** - Checklist keamanan production
- **`deploy.ps1`** - Script helper otomatis (Windows PowerShell)

---

## 🛠️ Tools Helper

### Generate JWT Secret
```powershell
node generate-secret.js
```

### Deploy Script Otomatis
```powershell
./deploy.ps1
```

---

## 📦 File-File Deploy yang Sudah Disiapkan

Semua file konfigurasi sudah ready:

- ✅ `Procfile` - Untuk Heroku
- ✅ `vercel.json` - Untuk Vercel
- ✅ `Dockerfile` - Untuk Docker
- ✅ `docker-compose.yml` - Untuk Docker Compose
- ✅ `nginx.conf` - Untuk VPS/Nginx
- ✅ `.gitignore` - Git ignore yang aman
- ✅ `.dockerignore` - Docker ignore

---

## 🎯 Opsi Hosting

| Platform | Waktu Setup | Gratis? | Kesulitan | Rekomendasi |
|----------|-------------|---------|-----------|-------------|
| **Railway** | 10 menit | ✅ Ya | ⭐ Mudah | ⭐⭐⭐⭐⭐ Best! |
| **Render** | 15 menit | ✅ Ya | ⭐ Mudah | ⭐⭐⭐⭐ |
| **Vercel+Supabase** | 20 menit | ✅ Ya | ⭐⭐ Sedang | ⭐⭐⭐ |
| **Heroku** | 15 menit | ❌ $5/bln | ⭐ Mudah | ⭐⭐ |
| **VPS** | 30-60 menit | ❌ $5-10/bln | ⭐⭐⭐ Sulit | ⭐⭐⭐⭐ Pro |

---

## ⚡ Quick Start - Railway (Tercepat!)

```powershell
# 1. Generate JWT Secret
node generate-secret.js

# 2. Push ke GitHub
git init
git add .
git commit -m "Deploy KilatBox"
git remote add origin https://github.com/username/kilatbox.git
git push -u origin main

# 3. Buka Railway
# - https://railway.app
# - Deploy from GitHub repo
# - Add PostgreSQL
# - Set environment variables (lihat DEPLOY_RAILWAY_QUICKSTART.md)
# - Deploy! 🚀
```

---

## 🔐 Environment Variables yang Dibutuhkan

Untuk hosting manapun, Anda perlu set 7 variables ini:

```bash
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=<your-cloudkilat-access-key>
CLOUDKILAT_SECRET_KEY=<your-cloudkilat-secret-key>
S3_BUCKET_NAME=kilatbox-storage
JWT_SECRET=<generate-with-node-generate-secret.js>
NODE_ENV=production
PORT=3000
```

**Note:** `DATABASE_URL` otomatis diset oleh Railway/Render

---

## ✅ Post-Deployment Checklist

Setelah deploy:

1. **Test Health Check:**
   ```
   https://your-app-url.com/api/health
   ```

2. **Test Register:**
   - Buka aplikasi
   - Register user baru
   - Login
   - Upload file

3. **Security Check:**
   - Baca `SECURITY_CHECKLIST.md`
   - Pastikan HTTPS aktif
   - Verify environment variables aman

4. **Monitor:**
   - Setup uptime monitoring (UptimeRobot)
   - Check logs secara berkala
   - Monitor disk usage

---

## 🐛 Troubleshooting Common Issues

### Error: Database connection failed
- Pastikan PostgreSQL sudah running
- Check `DATABASE_URL` di environment variables
- Pastikan schema.sql sudah dijalankan

### Error: CloudKilat upload failed
- Verify credentials benar
- Test dengan: `node test-cloudkilat.js`
- Pastikan bucket exists

### Error: JWT secret invalid
- Generate baru dengan: `node generate-secret.js`
- Harus minimal 32 karakter, disarankan 64

### Application crash on startup
- Check logs di hosting dashboard
- Verify semua environment variables diset
- Pastikan PORT benar (3000)

---

## 📖 Resources

### Dokumentasi Project
- `README.md` - Dokumentasi utama project
- `SETUP.md` - Setup development local
- `API_TESTING.md` - Testing API endpoints

### Dokumentasi Deploy
- `DEPLOY_RAILWAY_QUICKSTART.md` - **MULAI DI SINI!**
- `DEPLOYMENT_GUIDE.md` - Panduan lengkap semua platform
- `SECURITY_CHECKLIST.md` - Security best practices

### Hosting Documentation
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)
- [Docker Docs](https://docs.docker.com)

---

## 💡 Tips

1. **Backup sebelum deploy!**
   ```powershell
   # Backup database
   pg_dump kilatbox > backup.sql
   ```

2. **Test local dulu:**
   ```powershell
   npm start
   # Akses http://localhost:3000
   ```

3. **Monitor setelah deploy:**
   - Setup UptimeRobot (gratis)
   - Check logs tiap hari pertama
   - Monitor error rates

4. **Security:**
   - Never commit .env
   - Use strong passwords
   - Enable 2FA di GitHub
   - Regular updates (npm audit)

---

## 🆘 Need Help?

1. **Baca dokumentasi terlebih dahulu:**
   - `DEPLOY_RAILWAY_QUICKSTART.md` - Paling detail untuk Railway
   - `DEPLOYMENT_GUIDE.md` - Untuk platform lain

2. **Check logs:**
   - Railway: Dashboard → Deployments → View Logs
   - Render: Dashboard → Logs
   - VPS: `pm2 logs kilatbox`

3. **Common fixes:**
   - Restart aplikasi
   - Check environment variables
   - Verify database connection
   - Test CloudKilat credentials

---

## 🎉 Selamat Deploy!

**Rekomendasi workflow:**

1. ✅ Baca `DEPLOY_RAILWAY_QUICKSTART.md`
2. ✅ Jalankan `node generate-secret.js`
3. ✅ Jalankan `./deploy.ps1` (atau manual)
4. ✅ Follow panduan Railway
5. ✅ Test aplikasi
6. ✅ Setup monitoring
7. ✅ Baca `SECURITY_CHECKLIST.md`
8. ✅ Enjoy! 🚀

**Total waktu: 10-15 menit dari nol sampai live!**

---

Made with ❤️ for easy deployment
