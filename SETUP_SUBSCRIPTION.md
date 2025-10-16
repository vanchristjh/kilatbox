# 🚀 Setup dan Testing Sistem Subscription Exora ID

## 📋 Prerequisites
- PostgreSQL sudah terinstall dan running
- Node.js sudah terinstall
- CloudKilat S3 credentials sudah dikonfigurasi
- Database `Exora ID_db` sudah dibuat

## 🔧 Setup Steps

### 1. Install Dependencies (jika belum)
```bash
cd Exora ID
npm install
```

### 2. Reset dan Recreate Database Schema
```bash
# Masuk ke PostgreSQL
psql -U postgres -d Exora ID_db

# Atau langsung run file schema
psql -U postgres -d Exora ID_db -f schema.sql
```

Schema baru akan membuat:
- ✅ Tabel `subscription_plans` dengan 4 tier (Free, Pro, Business, Enterprise)
- ✅ Tabel `user_subscriptions` untuk tracking subscription user
- ✅ Tabel `shared_files` untuk fitur share file
- ✅ Tabel `team_folders` untuk fitur team collaboration
- ✅ Update tabel `users` dan `files`

### 3. Verify Database Setup
```sql
-- Check plans created
SELECT * FROM subscription_plans;

-- Should show 4 plans:
-- 1. Free Plan - 5 GB
-- 2. Pro Plan - 50 GB  
-- 3. Business Plan - 200 GB
-- 4. Enterprise Plan - Unlimited
```

### 4. Start Server
```bash
npm start
# atau
node server.js
```

Server akan berjalan di: `http://localhost:3000`

---

## 🧪 Testing Guide

### Test 1: User Registration (Auto Free Plan)

1. **Buka browser**: `http://localhost:3000`
2. **Register user baru**:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. **Verify**: User otomatis mendapat Free Plan (5 GB)

**Test via API:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 2: View Subscription Plans

1. **Login** dengan user yang baru dibuat
2. **Klik "Subscription Plans"** di navbar
3. **Verify**: Melihat 4 tier plans dengan:
   - Free Plan (Current Plan)
   - Pro Plan
   - Business Plan
   - Enterprise Plan

**Test via API:**
```bash
curl http://localhost:3000/api/subscriptions/plans
```

### Test 3: Check Current Subscription

**Test via API:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/subscriptions/my-subscription
```

Expected response:
```json
{
  "plan_name": "free",
  "display_name": "Free Plan",
  "storage_limit": 5368709120,
  "storage_used": 0,
  "percentage_used": 0,
  "features": ["upload", "download", "delete"]
}
```

### Test 4: Upload File (Free Plan - Quota Check)

1. **Upload small file** (< 5 GB) → Should succeed
2. **Try upload file** that exceeds quota → Should fail with:
   ```json
   {
     "error": "Storage quota exceeded",
     "message": "Please upgrade your plan to upload more files"
   }
   ```

### Test 5: Upgrade to Pro Plan

1. **Go to Subscription Plans page**
2. **Click "Pilih Paket"** on Pro Plan
3. **Confirm upgrade**
4. **Verify**: Plan changed to Pro (50 GB)

**Test via API:**
```bash
curl -X POST http://localhost:3000/api/subscriptions/upgrade \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan_id": 2}'
```

### Test 6: Share File Feature (Pro+)

**Pre-requisite**: User must have Pro Plan or higher

1. **Upload a file**
2. **Test share via API:**

```bash
# Share file (requires Pro+ plan)
curl -X POST http://localhost:3000/api/share/1/share \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"expiresInDays": 7}'
```

Expected response:
```json
{
  "message": "File shared successfully",
  "share_url": "http://localhost:3000/api/share/abc123...",
  "share_token": "abc123...",
  "expires_at": "2025-10-23T..."
}
```

3. **Access shared file** (no auth required):
```bash
curl http://localhost:3000/api/share/abc123...
```

4. **Test with Free Plan** → Should get 403 error:
```json
{
  "error": "Feature 'share_file' not available in your current plan",
  "message": "Please upgrade your plan to access this feature"
}
```

### Test 7: Team Folders (Business+)

**Pre-requisite**: User must have Business Plan or higher

1. **Upgrade to Business Plan** (plan_id: 3)

2. **Create team folder:**
```bash
curl -X POST http://localhost:3000/api/team-folders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "folder_name": "Marketing Team",
    "description": "Shared files for marketing team"
  }'
```

3. **List team folders:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/team-folders
```

4. **Add file to folder:**
```bash
curl -X POST http://localhost:3000/api/team-folders/1/files/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

5. **Test with Pro Plan** → Should get 403 error

### Test 8: Statistics (Business+)

**Pre-requisite**: User must have Business Plan or higher

1. **Get storage statistics:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/statistics/storage
```

Expected response:
```json
{
  "storage": {
    "used": 1048576,
    "limit": 214748364800,
    "percentage": "0.00"
  },
  "file_types": [
    {
      "file_type": "Images",
      "count": 5,
      "total_size": 524288
    }
  ],
  "upload_trend": [...],
  "largest_files": [...]
}
```

2. **Get file statistics:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/statistics/files
```

3. **Get share statistics:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/statistics/shares
```

### Test 9: Downgrade Protection

1. **Upload files** totaling 60 GB with Business Plan
2. **Try downgrade to Pro Plan** (50 GB limit)

```bash
curl -X POST http://localhost:3000/api/subscriptions/upgrade \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan_id": 2}'
```

Expected response:
```json
{
  "error": "Cannot downgrade: current storage usage exceeds new plan limit",
  "storage_used": 64424509440,
  "new_limit": 53687091200
}
```

### Test 10: Enterprise Plan (Unlimited Storage)

1. **Upgrade to Enterprise Plan** (plan_id: 4)

```bash
curl -X POST http://localhost:3000/api/subscriptions/upgrade \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan_id": 4}'
```

2. **Upload any size files** → Should never hit quota
3. **Check quota:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/subscriptions/quota
```

Expected response:
```json
{
  "storage_used": 1048576,
  "storage_limit": -1,
  "is_unlimited": true,
  "percentage_used": 0,
  "storage_used_display": "1 MB",
  "storage_limit_display": "Unlimited"
}
```

---

## 🐛 Troubleshooting

### Problem: User doesn't have subscription after registration

**Solution:**
```sql
-- Manually assign Free Plan to existing users
INSERT INTO user_subscriptions (user_id, plan_id, is_active)
SELECT u.id, sp.id, TRUE
FROM users u
CROSS JOIN subscription_plans sp
WHERE sp.plan_name = 'free'
  AND NOT EXISTS (
    SELECT 1 FROM user_subscriptions us WHERE us.user_id = u.id
  );
```

### Problem: "Feature not available" error even after upgrade

**Solution:** Check subscription is active:
```sql
SELECT u.email, sp.plan_name, us.is_active
FROM users u
JOIN user_subscriptions us ON u.id = us.user_id
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE u.email = 'test@example.com';
```

Activate if needed:
```sql
UPDATE user_subscriptions 
SET is_active = TRUE 
WHERE user_id = (SELECT id FROM users WHERE email = 'test@example.com');
```

### Problem: Storage quota not updating after upload

**Solution:** Check storage_used in users table:
```sql
SELECT email, storage_used, 
       (SELECT storage_limit FROM subscription_plans sp 
        JOIN user_subscriptions us ON sp.id = us.plan_id 
        WHERE us.user_id = users.id AND us.is_active = TRUE) as storage_limit
FROM users
WHERE email = 'test@example.com';
```

---

## 📊 Database Queries untuk Monitoring

### View all users with their plans:
```sql
SELECT u.email, u.name, sp.display_name as plan, 
       u.storage_used, sp.storage_limit,
       CASE WHEN sp.storage_limit = -1 THEN 0
            ELSE (u.storage_used::float / sp.storage_limit * 100)
       END as percentage_used
FROM users u
JOIN user_subscriptions us ON u.id = us.user_id
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE us.is_active = TRUE;
```

### View subscription distribution:
```sql
SELECT sp.display_name, COUNT(us.user_id) as user_count
FROM subscription_plans sp
LEFT JOIN user_subscriptions us ON sp.id = us.plan_id AND us.is_active = TRUE
GROUP BY sp.id, sp.display_name
ORDER BY sp.price;
```

### View shared files statistics:
```sql
SELECT u.email, COUNT(sf.id) as shared_files, SUM(sf.download_count) as total_downloads
FROM users u
LEFT JOIN shared_files sf ON u.id = sf.shared_by
GROUP BY u.id, u.email
ORDER BY shared_files DESC;
```

### View team folders statistics:
```sql
SELECT u.email, COUNT(tf.id) as team_folders, 
       COUNT(f.id) as files_in_folders
FROM users u
LEFT JOIN team_folders tf ON u.id = tf.owner_id
LEFT JOIN files f ON tf.id = f.folder_id
GROUP BY u.id, u.email
ORDER BY team_folders DESC;
```

---

## ✅ Checklist Testing

- [ ] User registration auto-assigns Free Plan
- [ ] Can view all 4 subscription plans
- [ ] Can check current subscription and quota
- [ ] Upload blocked when quota exceeded (Free Plan)
- [ ] Can upgrade from Free to Pro
- [ ] Can share files with Pro Plan
- [ ] Cannot share files with Free Plan (403 error)
- [ ] Can create team folders with Business Plan
- [ ] Cannot create team folders with Pro Plan (403 error)
- [ ] Can view statistics with Business Plan
- [ ] Cannot view statistics with Pro Plan (403 error)
- [ ] Enterprise Plan has unlimited storage
- [ ] Cannot downgrade if storage exceeds new limit
- [ ] Share links work without authentication
- [ ] Expired share links return 410 error

---

## 🎉 Success!

Jika semua test berhasil, sistem subscription Anda sudah berjalan dengan sempurna! 🚀

Fitur-fitur yang sudah terimplementasi:
- ✅ 4 Tier Subscription Plans (Free, Pro, Business, Enterprise)
- ✅ Auto-assign Free Plan saat register
- ✅ Storage quota check per plan
- ✅ Feature-based access control
- ✅ Share File (Pro+)
- ✅ Team Folders (Business+)
- ✅ Statistics & Analytics (Business+)
- ✅ Upgrade/Downgrade dengan validation
- ✅ UI untuk subscription management

Selamat! Project Exora ID Anda sudah memiliki sistem subscription yang lengkap! 🎊
