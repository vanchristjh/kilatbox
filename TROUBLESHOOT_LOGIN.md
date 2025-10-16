# Railway App Testing - Troubleshooting Login Failed

## 🔍 Diagnostic Information Needed:

### 1. Railway App URL
**Your Railway URL:**
- Get from: Railway → service "web" → Settings → Domains
- Format: `https://web-production-xxx.up.railway.app`
- **Please provide:** ___________________________

### 2. Error Details
**What happened when you tried to login?**

- [ ] Register berhasil, login gagal
- [ ] Register gagal
- [ ] Halaman tidak load
- [ ] Error message muncul (apa pesannya?)
- [ ] Loading terus/timeout
- [ ] Redirect ke halaman kosong
- [ ] Lainnya: ___________________________

### 3. Error Message (If Any)
**Copy exact error message:**
```
(paste error message here)
```

### 4. Browser Console Error
**Open browser Dev Tools (F12) → Console tab**
**Copy any red error messages:**
```
(paste console errors here)
```

### 5. Network Tab
**In Dev Tools → Network tab**
**What's the status of POST /api/auth/login request?**
- [ ] 200 OK
- [ ] 400 Bad Request
- [ ] 401 Unauthorized
- [ ] 404 Not Found
- [ ] 500 Internal Server Error
- [ ] Request timeout
- [ ] Other: ___________________________

### 6. Railway Logs
**Railway Dashboard → service "web" → tab "Logs"**
**Copy latest error logs (last 20 lines):**
```
(paste logs here)
```

---

## 🔧 Common Issues & Quick Fixes:

### Issue 1: "Invalid credentials" or "User not found"
**Cause:** User belum register atau password salah
**Fix:** 
1. Register user baru dulu
2. Pastikan email & password benar
3. Check case-sensitive

### Issue 2: "Database connection error"
**Cause:** DATABASE_URL tidak tersambung
**Fix:** Check Railway Logs untuk error `ECONNREFUSED`

### Issue 3: "Network Error" atau CORS error
**Cause:** API endpoint tidak respond
**Fix:** 
1. Check health endpoint: `/api/health`
2. Verify app is running di Railway Logs

### Issue 4: Token/Session error
**Cause:** JWT_SECRET issue
**Fix:** Verify JWT_SECRET di Variables

### Issue 5: Frontend tidak connect ke backend
**Cause:** Wrong API URL in frontend
**Fix:** Check browser console untuk failed requests

---

## 🚀 Quick Test Commands:

### Test 1: Health Check
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/api/health
```

Expected:
```json
{"success":true,"message":"Exora ID API is running"}
```

### Test 2: Register User (via curl)
```bash
curl -X POST https://YOUR-RAILWAY-URL.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@railway.com\",\"password\":\"testpass123\"}"
```

Expected:
```json
{"success":true,"message":"User registered successfully","token":"..."}
```

### Test 3: Login (via curl)
```bash
curl -X POST https://YOUR-RAILWAY-URL.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@railway.com\",\"password\":\"testpass123\"}"
```

Expected:
```json
{"success":true,"message":"Login successful","token":"...","user":{...}}
```

---

## 📋 Checklist Before Continuing:

- [ ] Railway app URL accessible
- [ ] `/api/health` returns success
- [ ] Database tables exist (verified)
- [ ] DATABASE_URL variable set in Railway
- [ ] JWT_SECRET variable set in Railway
- [ ] CloudKilat variables set in Railway
- [ ] No errors in Railway Logs
- [ ] Browser console shows no CORS errors

---

## 🆘 Next Steps:

**Please provide:**
1. **Railway App URL**
2. **Error message** (exact text)
3. **Screenshot** of error (if possible)
4. **Railway Logs** (last 20 lines from "Logs" tab)

I'll help diagnose and fix the issue! 🔧
