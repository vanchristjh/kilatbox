# 🧪 Manual Testing Guide - KilatBox

## 🎯 Testing Session Started!

Server: ✅ Running di http://localhost:3000

---

## 📝 Test Plan

### Test 1: Home Page & UI ✅
**Goal:** Verifikasi halaman utama load dengan baik

**Steps:**
1. Browser sudah dibuka di http://localhost:3000
2. ✅ Check apakah halaman muncul
3. ✅ Check layout/design tampil dengan baik
4. ✅ Check tombol Register/Login ada

**Expected Result:**
- Halaman landing KilatBox muncul
- UI responsive dan menarik
- Tombol navigasi berfungsi

---

### Test 2: Register New User 🔐
**Goal:** Membuat akun user baru

**Steps:**
1. Klik tombol **"Register"** atau **"Sign Up"**
2. Isi form registration:
   ```
   Username: testuser
   Email: test@kilatbox.com
   Password: Test123!@#
   Confirm Password: Test123!@#
   ```
3. Klik **"Register"** / **"Create Account"**

**Expected Result:**
- ✅ Registration successful
- ✅ Dapat konfirmasi sukses (alert/notification)
- ✅ Redirect ke login atau langsung ke dashboard
- ✅ User tersimpan di database

**Check Database (Optional):**
```powershell
psql -U postgres -d kilatbox -c "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
```

---

### Test 3: Login 🔑
**Goal:** Login dengan user yang baru dibuat

**Steps:**
1. Jika belum di halaman login, pergi ke login page
2. Isi credentials:
   ```
   Email: test@kilatbox.com
   Password: Test123!@#
   ```
3. Klik **"Login"** / **"Sign In"**

**Expected Result:**
- ✅ Login successful
- ✅ Redirect ke Dashboard
- ✅ JWT token tersimpan (check localStorage/sessionStorage)
- ✅ User info ditampilkan (username, email, storage quota, dll)

**Check JWT Token (Browser Console):**
```javascript
// Buka Developer Tools (F12)
// Di Console, ketik:
localStorage.getItem('token')
// atau
sessionStorage.getItem('token')
```

---

### Test 4: Dashboard Overview 📊
**Goal:** Verifikasi dashboard tampil dengan benar

**Expected Elements:**
- ✅ Welcome message dengan username
- ✅ Storage quota indicator (used/total)
- ✅ File list (kosong untuk user baru)
- ✅ Upload button/area
- ✅ Navigation menu
- ✅ Profile/Settings link
- ✅ Logout button

**Check Console for Errors:**
- Press F12 → Console tab
- Seharusnya tidak ada error merah

---

### Test 5: Upload Small File (< 1MB) 📁
**Goal:** Upload file kecil untuk test basic upload

**Steps:**
1. Siapkan file test (contoh: `test.txt` berisi "Hello KilatBox!")
2. Klik **"Upload"** button atau drag & drop area
3. Pilih file `test.txt`
4. (Optional) Tambah description
5. Klik **"Upload"** / **"Submit"**

**Expected Result:**
- ✅ Upload progress ditampilkan
- ✅ Upload berhasil (success message)
- ✅ File muncul di file list
- ✅ File info correct (nama, size, upload date)
- ✅ Storage quota updated
- ✅ File tersimpan di CloudKilat
- ✅ Record tersimpan di database

**Check CloudKilat (Terminal):**
```powershell
node -e "const {S3Client,ListObjectsV2Command}=require('@aws-sdk/client-s3');const s3=new S3Client({endpoint:process.env.CLOUDKILAT_S3_ENDPOINT,region:'id-jkt-1',credentials:{accessKeyId:process.env.CLOUDKILAT_ACCESS_KEY,secretAccessKey:process.env.CLOUDKILAT_SECRET_KEY},forcePathStyle:true});s3.send(new ListObjectsV2Command({Bucket:process.env.S3_BUCKET_NAME})).then(r=>console.log('Files:',r.Contents?.map(f=>f.Key)))"
```

**Check Database:**
```powershell
psql -U postgres -d kilatbox -c "SELECT id, filename, filesize, mimetype, created_at FROM files ORDER BY created_at DESC LIMIT 5;"
```

---

### Test 6: Upload Image File (1-10MB) 🖼️
**Goal:** Upload file dengan size lebih besar

**Steps:**
1. Siapkan image file (contoh: foto, screenshot)
2. Upload via dashboard
3. Wait untuk upload progress

**Expected Result:**
- ✅ Progress bar/indicator muncul
- ✅ Upload berhasil dalam waktu reasonable
- ✅ Image thumbnail ditampilkan (jika supported)
- ✅ File size displayed correctly
- ✅ Storage quota updated

---

### Test 7: View/Download File 📥
**Goal:** Download file yang sudah diupload

**Steps:**
1. Di file list, klik file yang tadi diupload
2. Atau klik button **"Download"** / icon download
3. File akan didownload ke browser

**Expected Result:**
- ✅ Download dimulai
- ✅ File downloaded dengan nama correct
- ✅ File content sama dengan original
- ✅ Bisa dibuka/view dengan benar

**Verify File:**
- Buka file yang didownload
- Check content sama dengan yang diupload

---

### Test 8: Delete File 🗑️
**Goal:** Hapus file dari storage

**Steps:**
1. Di file list, pilih file yang mau dihapus
2. Klik button **"Delete"** / trash icon
3. Confirm deletion (jika ada confirm dialog)

**Expected Result:**
- ✅ Confirmation prompt muncul
- ✅ File dihapus dari list
- ✅ Success message ditampilkan
- ✅ Storage quota updated (decreased)
- ✅ File dihapus dari CloudKilat
- ✅ Record dihapus/marked deleted di database

**Verify Deletion:**
```powershell
# Check database
psql -U postgres -d kilatbox -c "SELECT id, filename, deleted_at FROM files WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC LIMIT 5;"
```

---

### Test 9: File Search/Filter 🔍
**Goal:** Test search/filter functionality (jika ada)

**Steps:**
1. Upload beberapa file dengan nama berbeda
2. Gunakan search box untuk cari file tertentu
3. Test filter by type (jika ada)

**Expected Result:**
- ✅ Search bekerja real-time
- ✅ Filter hasil accurate
- ✅ UI responsive saat search

---

### Test 10: Storage Quota 💾
**Goal:** Verify storage quota calculation

**Steps:**
1. Check storage indicator di dashboard
2. Upload file dan watch quota change
3. Delete file dan watch quota decrease

**Expected Result:**
- ✅ Quota displayed correctly (used/total)
- ✅ Percentage/visual indicator accurate
- ✅ Updates after upload/delete

**Check Database:**
```powershell
psql -U postgres -d kilatbox -c "SELECT u.username, u.email, s.storage_used, s.storage_limit, s.plan_name FROM users u LEFT JOIN subscriptions s ON u.id = s.user_id WHERE u.email = 'test@kilatbox.com';"
```

---

### Test 11: Profile/Settings ⚙️
**Goal:** Test user profile page (jika ada)

**Steps:**
1. Klik Profile atau Settings
2. View user information
3. Try update profile (jika supported)

**Expected Result:**
- ✅ Profile page loads
- ✅ User info displayed correctly
- ✅ Can update info (jika ada fitur)

---

### Test 12: Logout 🚪
**Goal:** Test logout functionality

**Steps:**
1. Klik **"Logout"** button
2. Confirm logout (jika ada)

**Expected Result:**
- ✅ Logged out successfully
- ✅ Redirect ke login/home page
- ✅ JWT token cleared
- ✅ Cannot access dashboard without login

**Verify Token Cleared:**
```javascript
// Browser Console (F12)
localStorage.getItem('token')  // should be null
sessionStorage.getItem('token')  // should be null
```

---

### Test 13: Protected Routes 🔒
**Goal:** Verify authentication required

**Steps:**
1. Logout dari aplikasi
2. Try akses dashboard directly: http://localhost:3000/dashboard.html
3. Should redirect ke login

**Expected Result:**
- ✅ Tidak bisa akses protected pages tanpa login
- ✅ Redirect ke login page
- ✅ Error message (optional)

---

### Test 14: Multiple File Upload 📦
**Goal:** Upload multiple files sekaligus (jika supported)

**Steps:**
1. Select multiple files untuk upload
2. Upload semua

**Expected Result:**
- ✅ All files uploaded successfully
- ✅ Progress indicator untuk each file
- ✅ All files muncul di list

---

### Test 15: Edge Cases & Error Handling ⚠️

#### Test 15.1: Upload File Too Large
**Steps:**
1. Try upload file > 100MB (atau limit yang diset)

**Expected:**
- ✅ Error message displayed
- ✅ Upload rejected
- ✅ Clear error message explaining limit

#### Test 15.2: Upload Quota Exceeded
**Steps:**
1. Upload files sampai quota penuh
2. Try upload lagi

**Expected:**
- ✅ Error: storage quota exceeded
- ✅ Cannot upload
- ✅ Suggestion to upgrade plan

#### Test 15.3: Invalid File Type
**Steps:**
1. Try upload executable (.exe) atau blocked file type

**Expected:**
- ✅ File type validation
- ✅ Error message if blocked

#### Test 15.4: Network Error Simulation
**Steps:**
1. Start upload
2. Pause internet/kill connection mid-upload

**Expected:**
- ✅ Error handling
- ✅ Retry option (optional)
- ✅ Clear error message

#### Test 15.5: Duplicate File Name
**Steps:**
1. Upload file dengan nama yang sama 2x

**Expected:**
- ✅ Handle duplicate (rename atau replace)
- ✅ No crash

---

## 📊 Testing Checklist Summary

### Authentication & Security
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] JWT token management correct
- [ ] Protected routes secured
- [ ] Password hashing (backend check)

### File Management
- [ ] Upload small file (< 1MB)
- [ ] Upload medium file (1-10MB)
- [ ] Upload large file (10-100MB)
- [ ] Multiple file upload
- [ ] Download file
- [ ] Delete file
- [ ] File search/filter

### Storage & Quota
- [ ] Storage quota displayed correctly
- [ ] Quota updates after upload
- [ ] Quota updates after delete
- [ ] Quota limit enforced
- [ ] Storage indicator accurate

### UI/UX
- [ ] Responsive design
- [ ] Loading indicators
- [ ] Error messages clear
- [ ] Success notifications
- [ ] Intuitive navigation
- [ ] No console errors

### Data Persistence
- [ ] Files saved to CloudKilat
- [ ] Metadata saved to database
- [ ] Files persist after logout/login
- [ ] Deleted files removed properly

### Error Handling
- [ ] File size limit handled
- [ ] Quota exceeded handled
- [ ] Network errors handled
- [ ] Invalid input handled
- [ ] Graceful degradation

---

## 🐛 Bug Tracking

### Found Issues:
```
# Track any bugs found during testing

[Issue #1]
Description: 
Steps to reproduce:
Expected:
Actual:
Severity: High/Medium/Low

[Issue #2]
...
```

---

## ✅ Testing Complete!

### Next Steps:

**If All Tests Pass ✅**
1. Document any issues found
2. Fix critical bugs
3. Ready for production deployment!
4. Follow: `DEPLOY_RAILWAY_QUICKSTART.md`

**If Issues Found ⚠️**
1. Document all issues
2. Prioritize by severity
3. Fix and re-test
4. Then proceed to deployment

---

## 📝 Testing Notes

**Date:** October 17, 2025
**Tester:** [Your Name]
**Environment:** Local Development
**Browser:** [Chrome/Firefox/Edge]
**OS:** Windows

**Additional Notes:**
[Add any observations, suggestions, or concerns here]

---

**Happy Testing! 🚀**

Need help with any test? Check:
- `TEST_LOCAL_GUIDE.md` for troubleshooting
- Browser Console (F12) for errors
- Server terminal for backend logs
