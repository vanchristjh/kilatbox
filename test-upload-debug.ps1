# Test Upload File ke Exora ID
# Digunakan untuk debugging token error

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  EXORA ID - Upload File Test  " -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "https://web-production-efe2.up.railway.app"

# Step 1: Login
Write-Host "📝 Step 1: Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@railway.com"
    password = "testpass123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.success) {
        $token = $loginResponse.data.token
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "   User: $($loginResponse.data.user.name) ($($loginResponse.data.user.email))" -ForegroundColor Gray
        Write-Host "   Token: $($token.Substring(0,30))..." -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "❌ Login failed: $($loginResponse.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Login error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Create test file
Write-Host "📄 Step 2: Creating test file..." -ForegroundColor Yellow
$testFileName = "test-upload-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
$testFileContent = @"
Exora ID Upload Test
====================
Date: $(Get-Date)
User: test@railway.com
Platform: Exora ID Cloud Storage
Bucket: exora-storage (CloudKilat)

This is a test file to verify upload functionality works correctly.
"@

$testFileContent | Out-File -FilePath $testFileName -Encoding UTF8
Write-Host "✅ Test file created: $testFileName" -ForegroundColor Green
Write-Host ""

# Step 3: Upload file
Write-Host "📤 Step 3: Uploading file..." -ForegroundColor Yellow

# Prepare multipart form data
$filePath = Resolve-Path $testFileName
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$boundary = [System.Guid]::NewGuid().ToString()

# Build multipart body
$LF = "`r`n"
$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$testFileName`"",
    "Content-Type: text/plain$LF",
    [System.Text.Encoding]::UTF8.GetString($fileBytes),
    "--$boundary--$LF"
) -join $LF

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "multipart/form-data; boundary=$boundary"
}

try {
    $uploadResponse = Invoke-RestMethod -Uri "$API_URL/api/files/upload" -Method POST -Headers $headers -Body $bodyLines
    
    if ($uploadResponse.success) {
        Write-Host "✅ Upload successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 File Details:" -ForegroundColor Cyan
        Write-Host "   File ID: $($uploadResponse.data.file.id)" -ForegroundColor Gray
        Write-Host "   Filename: $($uploadResponse.data.file.filename)" -ForegroundColor Gray
        Write-Host "   Size: $($uploadResponse.data.file.filesize) bytes" -ForegroundColor Gray
        Write-Host "   Object Key: $($uploadResponse.data.file.object_key)" -ForegroundColor Gray
        Write-Host ""
        
        # Save file ID for testing download
        $global:fileId = $uploadResponse.data.file.id
        Write-Host "💾 File ID saved to `$global:fileId for testing" -ForegroundColor Gray
    } else {
        Write-Host "❌ Upload failed: $($uploadResponse.message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔍 Debug Info:" -ForegroundColor Yellow
        Write-Host "   Token: $($token.Substring(0,50))..." -ForegroundColor Gray
        Write-Host "   File: $testFileName" -ForegroundColor Gray
        Write-Host "   Size: $($fileBytes.Length) bytes" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Upload error!" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Gray
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🔍 Debug Info:" -ForegroundColor Yellow
    Write-Host "   Token valid: $(if($token) {'Yes'} else {'No'})" -ForegroundColor Gray
    Write-Host "   Token length: $($token.Length)" -ForegroundColor Gray
    Write-Host "   File exists: $(Test-Path $testFileName)" -ForegroundColor Gray
    Write-Host "   File size: $($fileBytes.Length) bytes" -ForegroundColor Gray
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan

# Cleanup
# Remove-Item $testFileName -Force -ErrorAction SilentlyContinue
Write-Host "ℹ️  Test file kept for reference: $testFileName" -ForegroundColor Gray
