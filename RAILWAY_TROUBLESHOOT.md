# Railway Deployment Troubleshooting Guide

## ❌ "Application failed to respond" - Troubleshooting

### 🔍 STEP 1: Check Deployment Logs

**Di Railway Dashboard:**

1. **Klik service "web"** (card aplikasi)
2. **Klik tab "Deployments"** (di top menu)
3. **Klik deployment terakhir** (yang paling atas)
4. **Lihat Build Logs dan Deploy Logs**

**Cari error messages seperti:**
- ❌ `Cannot find module`
- ❌ `Database connection failed`
- ❌ `Missing environment variable`
- ❌ `Port already in use`
- ❌ `Syntax error`

---

### 🔍 STEP 2: Check Live Logs

**Untuk real-time logs:**

1. **Klik service "web"**
2. **Klik tab "Logs"** (di top menu)
3. **Lihat logs yang muncul**

**Common errors dan solusinya:**

#### Error 1: Missing Environment Variables
```
Error: Missing required environment variable: DATABASE_URL
```

**Solusi:**
- Go to **Settings → Variables**
- Verify `DATABASE_URL` exists (auto-injected dari PostgreSQL)
- Add missing variables

#### Error 2: Database Connection Failed
```
Error: connect ECONNREFUSED
Error: password authentication failed
```

**Solusi:**
- Verify PostgreSQL service is running
- Check `DATABASE_URL` variable exists
- Import database schema

#### Error 3: Port Binding Error
```
Error: Port 3000 already in use
Error: listen EADDRINUSE
```

**Solusi:**
- Check `server.js` menggunakan `process.env.PORT`
- Verify PORT variable = 3000

#### Error 4: Module Not Found
```
Error: Cannot find module 'express'
Error: Cannot find module 'pg'
```

**Solusi:**
- Build failed, redeploy
- Check `package.json` dependencies

---

### ✅ STEP 3: Verify Environment Variables

**Check these variables exist:**

1. **Klik service "web"**
2. **Settings → Variables**

**Required variables:**
```
✅ DATABASE_URL (auto-injected dari PostgreSQL)
✅ CLOUDKILAT_S3_ENDPOINT
✅ CLOUDKILAT_ACCESS_KEY
✅ CLOUDKILAT_SECRET_KEY
✅ S3_BUCKET_NAME
✅ JWT_SECRET
✅ NODE_ENV=production
✅ PORT=3000
```

**Jika ada yang missing:**
- Click "Raw Editor"
- Paste semua variables
- Save & redeploy

---

### ✅ STEP 4: Verify Database Schema

**Import schema.sql ke PostgreSQL:**

**Option A: Via Railway Dashboard**

1. **Klik service "Postgres"**
2. **Tab "Data"**
3. **Copy isi file `schema.sql`**
4. **Paste dan Execute**

**Option B: Via Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Import schema
railway run psql -f schema.sql
```

---

### ✅ STEP 5: Check server.js Port Configuration

**Verify `server.js` listen to PORT:**

File: `server.js`
```javascript
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Railway needs:** `process.env.PORT` (dynamic port)

---

### ✅ STEP 6: Force Redeploy

**Sometimes just redeploy fixes it:**

1. **Klik service "web"**
2. **Settings → scroll to bottom**
3. **Click "Redeploy"** atau
4. **Deployments → Click "Redeploy" on latest**

---

### ✅ STEP 7: Check Health Endpoint

**Test if app is starting:**

1. **Get Railway URL:**
   - Settings → Domains
   - Copy: `https://web-production-xxx.up.railway.app`

2. **Test in browser:**
   ```
   https://web-production-xxx.up.railway.app/api/health
   ```

3. **Expected response:**
   ```json
   {
     "success": true,
     "message": "Exora ID API is running"
   }
   ```

**If 404 or timeout:**
- App not started properly
- Check logs (Step 1)

---

### 🔄 STEP 8: Common Fixes Checklist

Try these in order:

1. ✅ **Add all environment variables**
   - Settings → Variables → Raw Editor
   - Paste all CloudKilat + JWT variables
   - Save

2. ✅ **Import database schema**
   - Postgres service → Data → Execute schema.sql

3. ✅ **Verify PostgreSQL running**
   - Postgres service should show "Active"
   - DATABASE_URL should exist in web service variables

4. ✅ **Check package.json start script**
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

5. ✅ **Redeploy**
   - Force redeploy from Deployments tab

---

## 🆘 Quick Fix Commands

### If you have Railway CLI installed:

```bash
# Check logs
railway logs

# Check variables
railway variables

# Force redeploy
railway up

# Connect to database
railway run psql
```

---

## 📊 Expected Successful Deployment

**When successful, you'll see:**

1. **Deployments tab:**
   - Status: ✅ Success
   - Health check: ✅ Passed

2. **Logs tab:**
   ```
   Server running on port 3000
   Database connected
   ```

3. **Browser test:**
   - Health endpoint returns JSON
   - Homepage loads

---

## 🎯 Next Steps After Fix

1. ✅ Verify health endpoint working
2. ✅ Test register & login
3. ✅ Test file upload
4. ✅ Verify files in CloudKilat Storage
5. ✅ Setup custom domain (optional)

---

## 💡 Prevention Tips

**For future deployments:**

1. ✅ Always set environment variables BEFORE first deploy
2. ✅ Import database schema immediately after adding PostgreSQL
3. ✅ Use `process.env.PORT` for port binding
4. ✅ Test locally before pushing to GitHub
5. ✅ Monitor logs during deployment

---

## 📞 Need More Help?

**Share these with me:**

1. **Screenshot of Logs tab** (most important!)
2. **Screenshot of Variables tab**
3. **Screenshot of Deployments tab** (status)
4. **Railway URL** (your app domain)

**I'll help diagnose the exact issue!** 🔍
