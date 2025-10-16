# Exora ID Testing Script (PowerShell)
# Test API endpoints via terminal

$API_URL = "http://localhost:3000/api"

Write-Host "`n═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Exora ID API Testing" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "🧪 TEST 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
    Write-Host "✅ PASS: Server is running" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL: Server not responding" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 2: Register User
Write-Host "`n🧪 TEST 2: Register User" -ForegroundColor Yellow

$registerData = @{
    username = "testuser"
    email = "test@Exora ID.com"
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerData
    
    Write-Host "✅ PASS: Registration successful" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)" -ForegroundColor Gray
    Write-Host "Username: $($response.user.username)" -ForegroundColor Gray
    Write-Host "Email: $($response.user.email)" -ForegroundColor Gray
} catch {
    $errorDetail = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorDetail.message -like "*already exists*") {
        Write-Host "⚠️  User already exists (this is OK for re-testing)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ FAIL: Registration failed" -ForegroundColor Red
        Write-Host "Error: $($errorDetail.message)" -ForegroundColor Red
    }
}

Start-Sleep -Seconds 1

# Test 3: Login User
Write-Host "`n🧪 TEST 3: Login User" -ForegroundColor Yellow

$loginData = @{
    email = "test@Exora ID.com"
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginData
    
    Write-Host "✅ PASS: Login successful" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "User: $($response.user.username)" -ForegroundColor Gray
    
    # Save token for next tests
    $global:token = $response.token
    
} catch {
    Write-Host "❌ FAIL: Login failed" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 4: Get User Profile
Write-Host "`n🧪 TEST 4: Get User Profile" -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/auth/me" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ PASS: Profile retrieved" -ForegroundColor Green
    Write-Host "Username: $($response.user.username)" -ForegroundColor Gray
    Write-Host "Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "Storage Used: $($response.user.storage_used) bytes" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ FAIL: Could not get profile" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 5: Get Files List
Write-Host "`n🧪 TEST 5: Get Files List" -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL/files" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ PASS: Files retrieved" -ForegroundColor Green
    Write-Host "Total files: $($response.files.Count)" -ForegroundColor Gray
    
    if ($response.files.Count -gt 0) {
        Write-Host "`nFiles:" -ForegroundColor Cyan
        foreach ($file in $response.files) {
            Write-Host "  - $($file.filename) ($($file.filesize) bytes)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  (No files uploaded yet)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ FAIL: Could not get files" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`n═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Testing Complete! ✅" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test file upload via browser UI" -ForegroundColor White
Write-Host "2. Test file download" -ForegroundColor White
Write-Host "3. Test file delete" -ForegroundColor White
Write-Host "`nOr run: .\test-upload-debug.ps1 for file upload test`n" -ForegroundColor White
