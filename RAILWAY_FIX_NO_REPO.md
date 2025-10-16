# Railway Deployment - Alternative Method

## Jika Repository Tidak Muncul di Railway

### Method 1: Manual GitHub App Configuration

1. **Buka GitHub Settings:**
   ```
   https://github.com/settings/installations
   ```

2. **Cari "Railway"** di list Installed GitHub Apps

3. **Klik "Configure"** di samping Railway

4. **Repository Access:**
   - Select: "Only select repositories"
   - Dropdown: Pilih `vanchristjh/Exora ID`
   - Klik **"Save"**

5. **Kembali ke Railway** dan refresh

---

### Method 2: Deploy Empty Service (Manual)

Jika Method 1 tidak berhasil:

1. **Di Railway New Project:**
   - Klik **"Deploy from GitHub repo"**
   - Jika tidak ada repo, klik **"Empty Service"**

2. **Di Empty Service:**
   - Tab **"Settings"**
   - Section **"Source"** atau **"Connect to GitHub"**
   - Klik **"Connect Repo"**
   - Pilih `vanchristjh/Exora ID`

3. Railway akan auto-deploy!

---

### Method 3: Railway CLI (Terminal)

Install Railway CLI dan deploy dari local:

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
cd D:\PROJECT\ITB\Exora ID
railway init

# Deploy
railway up
```

---

## Quick Fix Now:

**Pilih salah satu:**

**1️⃣** Configure GitHub App (paling mudah)
   - Go to: https://github.com/settings/installations
   - Configure Railway → Add Exora ID repo

**2️⃣** Use Railway CLI (paling cepat)
   - Install: `npm install -g @railway/cli`
   - Deploy: `railway login` → `railway init` → `railway up`

**3️⃣** Try Empty Service (alternative)
   - Di Railway: Empty Service → Connect to GitHub
