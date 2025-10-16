# Exora ID API Testing Collection

## Postman Collection

Anda bisa import file ini ke Postman untuk testing API Exora ID.

### Setup Environment di Postman

1. Buat Environment baru dengan nama "Exora ID Local"
2. Tambahkan variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (akan diisi otomatis setelah login)

---

## API Endpoints

### 🔐 Authentication

#### 1. Register User
```
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "storageUsed": 0,
      "storageLimit": 1073741824,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

#### 2. Login User
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "storageUsed": 0,
      "storageLimit": 1073741824,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Save token untuk request berikutnya!**

---

#### 3. Get Current User Info
```
GET {{base_url}}/api/auth/me
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "storageUsed": 0,
      "storageLimit": 1073741824,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 📁 File Management

#### 4. Upload File
```
POST {{base_url}}/api/files/upload
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Body:
- file: [Select File]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "id": 1,
      "user_id": 1,
      "file_name": "1/1704067200000-abc123.pdf",
      "original_name": "document.pdf",
      "object_key": "1/1704067200000-abc123.pdf",
      "mime_type": "application/pdf",
      "size": 1024000,
      "uploaded_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

#### 5. List All Files
```
GET {{base_url}}/api/files
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": 1,
        "file_name": "1/1704067200000-abc123.pdf",
        "original_name": "document.pdf",
        "object_key": "1/1704067200000-abc123.pdf",
        "mime_type": "application/pdf",
        "size": 1024000,
        "uploaded_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalFiles": 1
  }
}
```

---

#### 6. Get Storage Statistics
```
GET {{base_url}}/api/files/stats
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "storageUsed": 1024000,
    "storageLimit": 1073741824,
    "storageAvailable": 1072717824,
    "storageUsedPercentage": "0.10",
    "totalFiles": 1
  }
}
```

---

#### 7. Download File (Get Presigned URL)
```
GET {{base_url}}/api/files/download/:file_id
Authorization: Bearer {{token}}
```

**Example:**
```
GET {{base_url}}/api/files/download/1
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://s3.cloudkilat.com/Exora ID-storage/1/1704067200000-abc123.pdf?X-Amz-...",
    "fileName": "document.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "expiresIn": "15 minutes"
  }
}
```

**Note:** Copy `downloadUrl` dan paste di browser untuk download file.

---

#### 8. Delete File
```
DELETE {{base_url}}/api/files/delete/:file_id
Authorization: Bearer {{token}}
```

**Example:**
```
DELETE {{base_url}}/api/files/delete/1
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "deletedFile": {
      "id": 1,
      "fileName": "document.pdf"
    }
  }
}
```

---

### 🏥 Health Check

#### 9. Check Server Health
```
GET {{base_url}}/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Exora ID API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "File not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### 413 Payload Too Large
```json
{
  "success": false,
  "message": "Storage limit exceeded"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error during upload"
}
```

---

## Testing Flow

### Complete Testing Scenario

1. **Register new user**
   - POST `/api/auth/register`
   - Save the token from response

2. **Login** (optional, if testing login separately)
   - POST `/api/auth/login`
   - Save the token from response

3. **Get user info**
   - GET `/api/auth/me`
   - Verify user data

4. **Check initial stats**
   - GET `/api/files/stats`
   - Should show 0 files, 0 storage used

5. **Upload a file**
   - POST `/api/files/upload`
   - Use a small test file (< 100MB)

6. **List files**
   - GET `/api/files`
   - Should show 1 file

7. **Check updated stats**
   - GET `/api/files/stats`
   - Should show 1 file and storage used

8. **Download file**
   - GET `/api/files/download/:id`
   - Copy URL and test in browser

9. **Delete file**
   - DELETE `/api/files/delete/:id`

10. **Verify deletion**
    - GET `/api/files`
    - Should show 0 files
    - GET `/api/files/stats`
    - Should show 0 storage used

---

## Notes

- Token expires in 7 days
- Max file size: 100MB
- Allowed file types: jpeg, jpg, png, gif, pdf, doc, docx, xls, xlsx, txt, zip, rar, mp4, mp3
- Download URL expires in 15 minutes
- Default storage limit: 1GB (1073741824 bytes)
