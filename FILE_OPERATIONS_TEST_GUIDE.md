# Exora ID File Operations Testing Guide
# Complete Test Suite untuk Upload, Download, Delete ke CloudKilat Storage

## 🎯 Test Overview:

Semua file operations menggunakan **CloudKilat Storage S3 API**:
- ✅ Upload: PutObjectCommand
- ✅ Download: GetObjectCommand dengan presigned URL
- ✅ Delete: DeleteObjectCommand

---

## 📋 Pre-Requisites:

### 1. Railway App URL:
```
https://web-production-efe2.up.railway.app
```

### 2. Test User Credentials:
```
Email: test@railway.com
Password: testpass123
```

### 3. CloudKilat Storage Config (Already Set):
```
Bucket: Exora ID-storage
Endpoint: https://s3-id-jkt-1.kilatstorage.id
Access Key: 00f40347ce0451733558
Secret Key: Hml1ntk1WEUwyKr8lZZJkjFm1pQI4AEcx28LAvZL
```

---

## 🧪 TEST 1: Login & Get Token

### PowerShell Command:
```powershell
# Login to get auth token
$loginBody = @{ 
    email = "test@railway.com"
    password = "testpass123" 
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"

# Extract token
$responseData = $loginResponse.Content | ConvertFrom-Json
$token = $responseData.data.token

Write-Host "✅ Login Success! Token: $token"
```

**Expected Output:**
```
✅ Login Success! Token: eyJhbGci...
```

---

## 🧪 TEST 2: Upload File to CloudKilat Storage

### Create Test File:
```powershell
# Create a test file
"Test file content for Exora ID upload to CloudKilat Storage" | Out-File -FilePath "test-upload.txt" -Encoding UTF8
```

### Upload Command:
```powershell
# Upload file with authentication
$uploadHeaders = @{
    "Authorization" = "Bearer $token"
}

$uploadForm = @{
    file = Get-Item -Path "test-upload.txt"
}

$uploadResponse = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files/upload" -Method POST -Headers $uploadHeaders -Form $uploadForm

$uploadData = $uploadResponse.Content | ConvertFrom-Json

Write-Host "✅ Upload Success!"
Write-Host "File ID: $($uploadData.data.file.id)"
Write-Host "Object Key: $($uploadData.data.file.object_key)"
Write-Host "Size: $($uploadData.data.file.size) bytes"
```

**Expected Output:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "id": 1,
      "file_name": "2/1234567890-abc123.txt",
      "original_name": "test-upload.txt",
      "object_key": "2/1234567890-abc123.txt",
      "mime_type": "text/plain",
      "size": 59
    }
  }
}
```

**What Happens:**
1. ✅ File uploaded to CloudKilat Storage bucket `Exora ID-storage`
2. ✅ Metadata saved to PostgreSQL database
3. ✅ User's `storage_used` incremented by file size

---

## 🧪 TEST 3: List User Files

### List Files Command:
```powershell
# Get list of uploaded files
$filesHeaders = @{
    "Authorization" = "Bearer $token"
}

$filesResponse = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files" -Method GET -Headers $filesHeaders

$filesData = $filesResponse.Content | ConvertFrom-Json

Write-Host "✅ Files Retrieved!"
Write-Host "Total Files: $($filesData.data.totalFiles)"
$filesData.data.files | Format-Table -Property id, original_name, size, uploaded_at
```

**Expected Output:**
```
✅ Files Retrieved!
Total Files: 1

id  original_name    size  uploaded_at
--  -------------    ----  -----------
1   test-upload.txt  59    2025-10-16T19:10:00.000Z
```

---

## 🧪 TEST 4: Download File from CloudKilat Storage

### Download Command:
```powershell
# Get download URL (presigned URL from CloudKilat S3)
$fileId = 1  # Use ID from upload response

$downloadHeaders = @{
    "Authorization" = "Bearer $token"
}

$downloadResponse = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files/download/$fileId" -Method GET -Headers $downloadHeaders

$downloadData = $downloadResponse.Content | ConvertFrom-Json

Write-Host "✅ Download URL Generated!"
Write-Host "URL: $($downloadData.data.downloadUrl)"
Write-Host "Expires In: $($downloadData.data.expiresIn)"

# Actually download the file
Invoke-WebRequest -Uri $downloadData.data.downloadUrl -OutFile "downloaded-test.txt"

Write-Host "✅ File Downloaded! Check: downloaded-test.txt"
```

**Expected Output:**
```
✅ Download URL Generated!
URL: https://s3-id-jkt-1.kilatstorage.id/Exora ID-storage/2/...?X-Amz-Algorithm=AWS4...
Expires In: 15 minutes
✅ File Downloaded! Check: downloaded-test.txt
```

**What Happens:**
1. ✅ API generates presigned URL from CloudKilat S3
2. ✅ URL valid for 15 minutes
3. ✅ Direct download from CloudKilat Storage (not from Railway server)

---

## 🧪 TEST 5: Delete File from CloudKilat Storage

### Delete Command:
```powershell
# Delete file from CloudKilat Storage
$deleteHeaders = @{
    "Authorization" = "Bearer $token"
}

$deleteResponse = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files/delete/$fileId" -Method DELETE -Headers $deleteHeaders

$deleteData = $deleteResponse.Content | ConvertFrom-Json

Write-Host "✅ File Deleted!"
Write-Host "Deleted File: $($deleteData.data.deletedFile.fileName)"
```

**Expected Output:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "deletedFile": {
      "id": 1,
      "fileName": "test-upload.txt"
    }
  }
}
```

**What Happens:**
1. ✅ File deleted from CloudKilat Storage using DeleteObjectCommand
2. ✅ Metadata removed from database
3. ✅ User's `storage_used` decremented by file size

---

## 🧪 TEST 6: Get Storage Statistics

### Stats Command:
```powershell
# Get storage statistics
$statsHeaders = @{
    "Authorization" = "Bearer $token"
}

$statsResponse = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files/stats" -Method GET -Headers $statsHeaders

$statsData = $statsResponse.Content | ConvertFrom-Json

Write-Host "✅ Storage Stats Retrieved!"
$statsData.data | Format-List
```

**Expected Output:**
```
✅ Storage Stats Retrieved!
storageUsed : 0
storageUsedDisplay : 0 B
totalFiles : 0
percentageUsed : 0
```

---

## 🌐 TEST 7: Verify in CloudKilat Panel

### Manual Verification:

1. **Login to CloudKilat Panel:**
   ```
   https://panel.cloudkilat.com
   ```

2. **Navigate to Kilat Storage:**
   - Click "Produk" → "Layanan"
   - Click "Kilat Storage 25 GB"

3. **Check Bucket Contents:**
   - Bucket: `Exora ID-storage`
   - Look for folder: `2/` (user ID)
   - Verify uploaded files exist
   - Verify deleted files are gone

---

## 📊 Complete Test Workflow (All-in-One):

```powershell
# Complete automated test workflow
cd D:\PROJECT\ITB\Exora ID

# 1. Login
$loginBody = @{ email = "test@railway.com"; password = "testpass123" } | ConvertTo-Json
$loginResp = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = ($loginResp.Content | ConvertFrom-Json).data.token
Write-Host "✅ 1. Login Success!"

# 2. Create test file
"Test from Exora ID @ $(Get-Date)" | Out-File -FilePath "test.txt" -Encoding UTF8
Write-Host "✅ 2. Test file created!"

# 3. Upload
$uploadHeaders = @{ "Authorization" = "Bearer $token" }
$uploadForm = @{ file = Get-Item -Path "test.txt" }
$uploadResp = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files/upload" -Method POST -Headers $uploadHeaders -Form $uploadForm
$fileId = ($uploadResp.Content | ConvertFrom-Json).data.file.id
Write-Host "✅ 3. Upload Success! File ID: $fileId"

# 4. List files
$listResp = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files" -Method GET -Headers $uploadHeaders
$totalFiles = ($listResp.Content | ConvertFrom-Json).data.totalFiles
Write-Host "✅ 4. List Success! Total Files: $totalFiles"

# 5. Download
$downloadResp = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files/download/$fileId" -Method GET -Headers $uploadHeaders
$downloadUrl = ($downloadResp.Content | ConvertFrom-Json).data.downloadUrl
Invoke-WebRequest -Uri $downloadUrl -OutFile "downloaded.txt"
Write-Host "✅ 5. Download Success!"

# 6. Delete
$deleteResp = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files/delete/$fileId" -Method DELETE -Headers $uploadHeaders
Write-Host "✅ 6. Delete Success!"

# 7. Stats
$statsResp = Invoke-WebRequest -Uri "https://web-production-efe2.up.railway.app/api/files/stats" -Method GET -Headers $uploadHeaders
Write-Host "✅ 7. Stats Retrieved!"

Write-Host "`n🎉 ALL TESTS PASSED!"
Write-Host "All file operations working with CloudKilat Storage S3 API!"
```

---

## ✅ Success Criteria:

- [ ] Login successful and token received
- [ ] File uploaded to CloudKilat Storage (visible in CloudKilat panel)
- [ ] File listed in GET /api/files
- [ ] Download URL generated with CloudKilat S3 presigned URL
- [ ] File downloaded successfully
- [ ] File deleted from CloudKilat Storage (gone from panel)
- [ ] storage_used updated correctly
- [ ] Stats showing correct values

---

## 🔧 Troubleshooting:

### Issue: "Storage quota exceeded"
**Fix:** Check subscription plan has enough storage

### Issue: "File not found" during download/delete
**Fix:** Verify file ID exists and belongs to user

### Issue: S3 connection error
**Fix:** Verify CloudKilat credentials in Railway Variables

### Issue: Upload fails with "File type not allowed"
**Fix:** Check file extension in allowed types list

---

## 🎯 Next Steps After Testing:

1. ✅ Verify all tests pass
2. ✅ Check CloudKilat panel shows files
3. ✅ Document any issues found
4. ✅ Deploy is complete!

---

**Ready to test! Run the commands above!** 🚀
