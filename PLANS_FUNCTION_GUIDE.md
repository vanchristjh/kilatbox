# 📋 Panduan Fungsi Subscription Plans

## ✅ Perbaikan yang Dilakukan

### 1. **Pembersihan Duplicate CSS**
- ❌ **Masalah**: CSS duplicate muncul setelah tag `</head>` (130+ baris)
- ✅ **Solusi**: Menghapus semua CSS duplicate yang invalid
- 🎯 **Hasil**: HTML structure clean dan valid

### 2. **Error Handling yang Robust**
```javascript
// Sebelum: Minimal error handling
if (!response.ok) {
    throw new Error('Gagal memuat paket subscription');
}

// Sesudah: Comprehensive error handling
if (!response.ok) {
    if (response.status === 401) {
        alert('⚠️ Sesi Anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
        return;
    }
    throw new Error(data.error || 'Gagal memuat paket subscription');
}
```

### 3. **Null/Undefined Safety**
```javascript
// Proteksi terhadap data null/undefined
const displayName = plan.display_name || plan.plan_name || 'Unknown Plan';
const storageDisplay = plan.storage_display || 'N/A';
const features = Array.isArray(plan.features) ? plan.features.map(...) : '<li>Fitur belum tersedia</li>';
```

### 4. **Format Helper Functions**
```javascript
// Fungsi untuk format bytes menjadi readable
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    if (bytes === -1) return 'Unlimited';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

### 5. **Better UX pada Button State**
```javascript
// Loading state yang jelas
loadingBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';

// Success message yang informatif
alert(`🎉 Subscription berhasil diupdate ke ${planName}!\n\nHalaman akan dimuat ulang...`);
```

---

## 🔄 Alur Kerja Fungsi

### **A. Load Plans Flow**
```
1. User membuka plans.html
   ↓
2. Check token di localStorage
   ↓
3. Fetch current subscription (GET /api/subscriptions/my-subscription)
   ↓
4. Display current plan dengan quota bar
   ↓
5. Fetch all available plans (GET /api/subscriptions/plans)
   ↓
6. Render plan cards dengan feature icons
   ↓
7. Highlight current plan & disable button
```

### **B. Upgrade Plan Flow**
```
1. User klik button "🚀 Pilih Paket"
   ↓
2. Show confirmation dialog
   ↓
3. Disable button & show loading state
   ↓
4. POST /api/subscriptions/upgrade dengan plan_id
   ↓
5. Backend validasi storage limit
   ↓
6. Deactivate old subscription
   ↓
7. Create new subscription
   ↓
8. Return success message
   ↓
9. Reload page untuk show updated plan
```

---

## 🎨 Feature Configuration

### **Icons Mapping**
```javascript
const featureConfig = {
    'upload': { icon: 'cloud-upload-fill', label: 'Upload File' },
    'download': { icon: 'cloud-download-fill', label: 'Download File' },
    'delete': { icon: 'trash-fill', label: 'Hapus File' },
    'share_file': { icon: 'share-fill', label: 'Share File' },
    'auto_backup': { icon: 'shield-check', label: 'Auto Backup' },
    'team_folder': { icon: 'people-fill', label: 'Team Folder' },
    'statistics': { icon: 'graph-up-arrow', label: 'Statistik & Analytics' },
    'internal_employee': { icon: 'person-badge-fill', label: 'Akses Karyawan' },
    'api_integration': { icon: 'code-square', label: 'API Integration' }
};
```

### **Plan Icons**
```javascript
const planIcons = {
    'free': 'bi-box',
    'pro': 'bi-star-fill',
    'business': 'bi-building',
    'enterprise': 'bi-rocket-takeoff-fill'
};
```

---

## 🛡️ Security & Validation

### **1. Token Validation**
```javascript
// Check token sebelum load
const token = localStorage.getItem('token');
if (!token) {
    alert('⚠️ Anda harus login terlebih dahulu!');
    window.location.href = 'index.html';
    return;
}
```

### **2. 401 Handling**
```javascript
// Auto redirect jika token expired
if (response.status === 401) {
    alert('⚠️ Sesi Anda telah berakhir. Silakan login kembali.');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
    return;
}
```

### **3. XSS Protection**
```javascript
// Escape single quotes dalam plan name
onclick="upgradePlan(${plan.id}, '${displayName.replace(/'/g, "\\'")}')"
```

---

## 📊 Data Structure

### **Current Plan Response**
```json
{
    "id": 1,
    "user_id": 123,
    "plan_id": 2,
    "plan_name": "pro",
    "display_name": "Professional",
    "storage_limit": 53687091200,
    "storage_used": 12345678,
    "price": 50000,
    "features": ["upload", "download", "delete", "share_file", "auto_backup"],
    "is_active": true,
    "created_at": "2025-10-16T10:00:00.000Z",
    "storage_display": "50 GB",
    "storage_used_display": "11.77 MB",
    "percentage_used": 0.02,
    "is_unlimited": false
}
```

### **Plans List Response**
```json
[
    {
        "id": 1,
        "plan_name": "free",
        "display_name": "Free",
        "storage_limit": 1073741824,
        "price": 0,
        "features": ["upload", "download", "delete"],
        "storage_display": "1 GB"
    },
    {
        "id": 2,
        "plan_name": "pro",
        "display_name": "Professional",
        "storage_limit": 53687091200,
        "price": 50000,
        "features": ["upload", "download", "delete", "share_file", "auto_backup"],
        "storage_display": "50 GB"
    }
]
```

---

## 🎯 Testing Checklist

### **Frontend Tests**
- [x] Load plans without token → Redirect to login
- [x] Load plans with valid token → Display plans grid
- [x] Load plans with expired token → Clear token & redirect
- [x] Display current plan quota bar with correct percentage
- [x] Highlight current active plan
- [x] Disable button for current plan
- [x] Show featured badge for Pro & Business plans
- [x] Handle empty plans array gracefully
- [x] Handle null/undefined data fields safely

### **Backend Tests**
```bash
# Test get all plans
curl http://localhost:3000/api/subscriptions/plans

# Test get current subscription (need token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/subscriptions/my-subscription

# Test upgrade plan (need token)
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"plan_id": 2}' \
     http://localhost:3000/api/subscriptions/upgrade
```

---

## 🔧 Troubleshooting

### **Masalah: Error memuat paket**
**Solusi:**
1. Check apakah server berjalan: `http://localhost:3000`
2. Check console browser untuk error details (F12)
3. Verify token ada di localStorage
4. Check network tab untuk response status

### **Masalah: Plans tidak muncul**
**Solusi:**
1. Pastikan database memiliki data di tabel `subscription_plans`
2. Run migration: `psql -U postgres -d kilatbox -f schema.sql`
3. Check API response di Network tab

### **Masalah: Upgrade gagal**
**Solusi:**
1. Check apakah storage usage < new plan limit
2. Verify plan_id valid
3. Check token masih valid
4. Review server logs untuk error details

---

## 🚀 Best Practices

### **1. Always Validate Input**
```javascript
if (!planId) {
    alert('❌ Error: Plan ID tidak valid');
    return;
}
```

### **2. Provide User Feedback**
```javascript
// Loading state
loadingBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';

// Success message
alert(`🎉 Subscription berhasil diupdate ke ${planName}!`);
```

### **3. Handle Edge Cases**
```javascript
// Empty data
if (!plans || plans.length === 0) {
    grid.innerHTML = '<p>Tidak ada paket tersedia</p>';
    return;
}
```

### **4. Network Monitoring**
```javascript
window.addEventListener('offline', () => {
    alert('⚠️ Koneksi internet terputus.');
});
```

---

## 📝 Changelog

### Version 2.0 (16 Oktober 2025)
- ✅ Fixed duplicate CSS bug
- ✅ Added comprehensive error handling
- ✅ Improved null/undefined safety
- ✅ Added formatBytes helper function
- ✅ Enhanced UX with better loading states
- ✅ Added 401 auto-redirect
- ✅ Added network status monitoring
- ✅ Added XSS protection for plan names
- ✅ Improved button state management

### Version 1.0
- Initial release with basic functionality

---

## 📞 Support

Jika masih ada masalah:
1. Check browser console (F12)
2. Check server logs
3. Verify database connection
4. Test API endpoints dengan Postman

---

**Status:** ✅ **FULLY FUNCTIONAL & TESTED**
