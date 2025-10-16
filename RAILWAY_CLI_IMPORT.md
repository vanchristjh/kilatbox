# Railway - Import Schema via CLI

## Quick Method: Railway CLI

### 1. Install Railway CLI (if not installed)

```powershell
npm install -g @railway/cli
```

### 2. Login to Railway

```powershell
railway login
```

Browser akan terbuka untuk authorize.

### 3. Link to Your Project

```powershell
cd D:\PROJECT\ITB\Exora ID
railway link
```

Pilih project: **splendid-creativity** → environment: **production**

### 4. Import Schema

```powershell
# Import schema.sql ke PostgreSQL
railway run psql -f schema.sql
```

Atau:

```powershell
# Alternative method
Get-Content schema.sql | railway run psql
```

### 5. Verify

```powershell
# List tables
railway run psql -c "\dt"
```

Expected output:
```
List of relations
Schema |        Name          | Type  |  Owner
-------+----------------------+-------+----------
public | users                | table | postgres
public | files                | table | postgres
public | subscription_plans   | table | postgres
public | user_subscriptions   | table | postgres
public | shared_files         | table | postgres
public | team_folders         | table | postgres
public | payments             | table | postgres
```

---

## Success!

Tables created! Now test your app:
1. Get Railway URL from Settings → Domains
2. Test: https://your-app.railway.app/api/health
3. Register & Login
4. Upload file

Done! 🎉
