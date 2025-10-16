# 📋 Dokumentasi Fitur Subscription Plans - KilatBox

## 🎯 Overview

KilatBox kini memiliki 4 tier subscription plans yang memberikan berbagai fitur dan kapasitas storage berbeda:

| Plan | Storage | Harga | Fitur |
|------|---------|-------|-------|
| **Free Plan** | 5 GB | Gratis | Upload, Download, Delete |
| **Pro Plan** | 50 GB | Rp 50.000/bulan | + Share File, Auto Backup |
| **Business Plan** | 200 GB | Rp 200.000/bulan | + Team Folder, Statistik |
| **Enterprise Plan** | Unlimited | Rp 500.000/bulan | + Karyawan Internal, API Integration |

---

## 📊 Database Schema

### Tabel Baru:

1. **subscription_plans** - Menyimpan daftar plan yang tersedia
2. **user_subscriptions** - Menyimpan subscription aktif user
3. **shared_files** - Menyimpan informasi file yang dibagikan (Pro+)
4. **team_folders** - Menyimpan folder tim (Business+)

### Perubahan Tabel:
- **users**: Menghapus kolom `storage_limit` (sekarang mengacu ke plan)
- **files**: Menambah kolom `is_shared` dan `folder_id`

---

## 🔌 API Endpoints

### 1. Subscription Management

#### Get All Plans
```
GET /api/subscriptions/plans
```
Response:
```json
[
  {
    "id": 1,
    "plan_name": "free",
    "display_name": "Free Plan",
    "storage_limit": 5368709120,
    "price": 0,
    "features": ["upload", "download", "delete"],
    "storage_display": "5 GB"
  }
]
```

#### Get User's Current Subscription
```
GET /api/subscriptions/my-subscription
Authorization: Bearer {token}
```
Response:
```json
{
  "plan_id": 1,
  "plan_name": "free",
  "display_name": "Free Plan",
  "storage_limit": 5368709120,
  "storage_used": 1048576,
  "storage_display": "5 GB",
  "storage_used_display": "1 MB",
  "percentage_used": 0.02,
  "is_unlimited": false,
  "features": ["upload", "download", "delete"]
}
```

#### Upgrade/Change Subscription
```
POST /api/subscriptions/upgrade
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan_id": 2
}
```

#### Check Feature Access
```
GET /api/subscriptions/check-feature/:feature
Authorization: Bearer {token}

# Example: /api/subscriptions/check-feature/share_file
```

#### Check Storage Quota
```
GET /api/subscriptions/quota
Authorization: Bearer {token}
```

---

### 2. Share File (Pro+)

#### Share a File
```
POST /api/share/:fileId/share
Authorization: Bearer {token}
Content-Type: application/json

{
  "expiresInDays": 7  // optional
}
```
Response:
```json
{
  "message": "File shared successfully",
  "share_url": "http://localhost:3000/api/share/abc123...",
  "share_token": "abc123...",
  "expires_at": "2025-10-23T..."
}
```

#### Access Shared File
```
GET /api/share/:shareToken
```

#### List My Shares
```
GET /api/share/my-shares
Authorization: Bearer {token}
```

#### Revoke Share
```
DELETE /api/share/:shareToken
Authorization: Bearer {token}
```

---

### 3. Team Folders (Business+)

#### Create Team Folder
```
POST /api/team-folders
Authorization: Bearer {token}
Content-Type: application/json

{
  "folder_name": "Project A",
  "description": "Files for Project A"
}
```

#### List Team Folders
```
GET /api/team-folders
Authorization: Bearer {token}
```

#### Get Team Folder Details
```
GET /api/team-folders/:folderId
Authorization: Bearer {token}
```

#### Update Team Folder
```
PUT /api/team-folders/:folderId
Authorization: Bearer {token}
Content-Type: application/json

{
  "folder_name": "New Name",
  "description": "New Description"
}
```

#### Delete Team Folder
```
DELETE /api/team-folders/:folderId
Authorization: Bearer {token}
```

#### Add File to Team Folder
```
POST /api/team-folders/:folderId/files/:fileId
Authorization: Bearer {token}
```

#### Remove File from Team Folder
```
DELETE /api/team-folders/:folderId/files/:fileId
Authorization: Bearer {token}
```

---

### 4. Statistics (Business+)

#### Get Storage Statistics
```
GET /api/statistics/storage
Authorization: Bearer {token}
```
Response:
```json
{
  "storage": {
    "used": 1048576,
    "limit": 214748364800,
    "percentage": 0.00
  },
  "file_types": [
    {
      "file_type": "Images",
      "count": 10,
      "total_size": 524288
    }
  ],
  "upload_trend": [...],
  "largest_files": [...]
}
```

#### Get File Statistics
```
GET /api/statistics/files
Authorization: Bearer {token}
```

#### Get Share Statistics
```
GET /api/statistics/shares
Authorization: Bearer {token}
```

#### Get Activity Log
```
GET /api/statistics/activity?limit=50&offset=0
Authorization: Bearer {token}
```

---

## 🔒 Middleware

### checkStorageQuota
Mengecek apakah user masih memiliki ruang storage yang cukup sebelum upload.

### checkFeature(featureName)
Mengecek apakah user memiliki akses ke fitur tertentu berdasarkan plan mereka.

**Available Features:**
- `upload`
- `download`
- `delete`
- `share_file` (Pro+)
- `auto_backup` (Pro+)
- `team_folder` (Business+)
- `statistics` (Business+)
- `internal_employee` (Enterprise)
- `api_integration` (Enterprise)

---

## 🎨 Frontend Pages

### plans.html
Halaman untuk menampilkan semua subscription plans dan memungkinkan user untuk upgrade/downgrade plan mereka.

**Features:**
- Display semua plans dengan fitur masing-masing
- Highlight current plan user
- Show storage quota dengan progress bar
- Tombol upgrade/downgrade

**Access:** `http://localhost:3000/plans.html`

---

## 🚀 Setup Instructions

### 1. Run Database Migration
```bash
psql -U postgres -d kilatbox_db -f kilatbox/schema.sql
```

### 2. Verify Subscription Plans Created
```sql
SELECT * FROM subscription_plans;
```

### 3. Test API
```bash
# Get all plans
curl http://localhost:3000/api/subscriptions/plans

# Get user subscription (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/subscriptions/my-subscription
```

---

## ⚡ Usage Examples

### Example 1: User Registration (Auto Free Plan)
Saat user register, mereka otomatis mendapat Free Plan.

### Example 2: Upload File dengan Quota Check
Middleware `checkStorageQuota` akan otomatis menolak upload jika melebihi limit.

### Example 3: Share File (Pro+)
```javascript
// Frontend code
const shareFile = async (fileId) => {
  const response = await fetch(`${API_URL}/api/share/${fileId}/share`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ expiresInDays: 7 })
  });
  
  const data = await response.json();
  console.log('Share URL:', data.share_url);
};
```

### Example 4: Create Team Folder (Business+)
```javascript
const createFolder = async () => {
  const response = await fetch(`${API_URL}/api/team-folders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      folder_name: 'Marketing Team',
      description: 'Shared files for marketing'
    })
  });
  
  const data = await response.json();
  console.log('Folder created:', data.folder);
};
```

---

## 🔍 Testing

### Test Upgrade Flow:
1. Register user baru (akan dapat Free Plan)
2. Upload file sampai mendekati limit (5 GB)
3. Coba upload lagi → akan ditolak
4. Upgrade ke Pro Plan
5. Upload file lagi → berhasil
6. Test fitur Share File

### Test Feature Access:
1. Login dengan Free Plan user
2. Coba akses `/api/share/:fileId/share` → akan ditolak (403)
3. Upgrade ke Pro Plan
4. Coba lagi → berhasil

---

## 📝 Notes

- Semua user baru otomatis mendapat **Free Plan**
- Downgrade tidak diperbolehkan jika storage usage > new limit
- Share links bisa di-set expiration atau permanent
- Team folders hanya bisa dibuat oleh Business+ users
- Statistics hanya tersedia untuk Business+ users
- Enterprise plan untuk custom integration (API keys, webhooks, dll)

---

## 🐛 Troubleshooting

### Error: "No active subscription found"
**Solution:** Run migration ulang atau manual insert subscription:
```sql
INSERT INTO user_subscriptions (user_id, plan_id, is_active)
SELECT id, (SELECT id FROM subscription_plans WHERE plan_name = 'free'), TRUE
FROM users WHERE id NOT IN (SELECT user_id FROM user_subscriptions);
```

### Error: "Storage quota exceeded"
**Solution:** User perlu upgrade plan atau delete beberapa file.

### Error: "Feature not available in your current plan"
**Solution:** User perlu upgrade ke plan yang memiliki fitur tersebut.

---

## 🎉 Selesai!

Sistem subscription sekarang sudah fully integrated dengan semua fitur sesuai gambar yang diberikan!
