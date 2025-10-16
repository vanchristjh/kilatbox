# ⚠️ IMPORTANT - Database Migration Required!

## 🚨 Error yang Terjadi
Server sudah berjalan, tapi ada error:
```
error: relation "user_subscriptions" does not exist
```

Ini karena tabel-tabel baru untuk sistem subscription belum dibuat di database.

---

## ✅ Solusi - Jalankan Database Migration

### Option 1: Via psql Command Line
```bash
psql -U postgres -d kilatbox_db -f kilatbox/schema.sql
```

### Option 2: Via PowerShell (Windows)
```powershell
# Masuk ke PostgreSQL
psql -U postgres

# Di dalam psql prompt:
\c kilatbox_db
\i kilatbox/schema.sql
\q
```

### Option 3: Copy-Paste Manual
1. Buka file `kilatbox/schema.sql`
2. Copy seluruh isinya
3. Buka pgAdmin atau psql
4. Connect ke database `kilatbox_db`
5. Paste dan execute

---

## 📋 Yang Akan Dibuat oleh Migration

### Tabel Baru:
- ✅ `subscription_plans` - 4 tier subscription plans
- ✅ `user_subscriptions` - User's active subscriptions
- ✅ `shared_files` - File sharing (Pro+)
- ✅ `team_folders` - Team collaboration (Business+)

### Data Default:
- ✅ Free Plan (5 GB)
- ✅ Pro Plan (50 GB)
- ✅ Business Plan (200 GB)
- ✅ Enterprise Plan (Unlimited)

### Update Tabel Existing:
- ✅ `users` - Remove `storage_limit` column
- ✅ `files` - Add `is_shared` and `folder_id` columns

---

## 🔍 Verify Migration Berhasil

Setelah run migration, cek dengan query ini:

```sql
-- Check subscription plans created
SELECT * FROM subscription_plans;

-- Should return 4 plans
```

Expected output:
```
 id | plan_name  | display_name      | storage_limit  | price
----+------------+-------------------+----------------+--------
  1 | free       | Free Plan         |  5368709120    |   0.00
  2 | pro        | Pro Plan          | 53687091200    |  50000
  3 | business   | Business Plan     | 214748364800   | 200000
  4 | enterprise | Enterprise Plan   |  -1            | 500000
```

---

## 🚀 Setelah Migration

1. **Restart server** (Ctrl+C lalu `npm start`)
2. **Test registration**: User baru akan auto dapat Free Plan
3. **Akses plans page**: http://localhost:3000/plans.html
4. **Test upgrade**: Upgrade dari Free ke Pro/Business/Enterprise

---

## 📞 Jika Ada Masalah

### Error: "database kilatbox_db does not exist"
```sql
CREATE DATABASE kilatbox_db;
```

### Error: "permission denied"
```bash
# Login sebagai postgres user
psql -U postgres -d kilatbox_db -f kilatbox/schema.sql
```

### Error: "relation already exists"
Schema sudah pernah dijalankan. Skip atau drop tables dulu:
```sql
-- Drop semua tables (HATI-HATI: Data akan hilang!)
DROP TABLE IF EXISTS shared_files CASCADE;
DROP TABLE IF EXISTS team_folders CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

---

## ✅ Status Saat Ini

✅ Server berjalan di http://localhost:3000
✅ Semua route sudah registered
✅ Middleware sudah benar
❌ Database belum di-migrate (PERLU DILAKUKAN!)

**Next Step: Jalankan database migration di atas!** 🚀
