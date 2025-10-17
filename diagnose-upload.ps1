# Comprehensive Upload Diagnostic Tool
# Run this to find the exact error

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  EXORA ID - UPLOAD DIAGNOSTIC TOOL    " -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$API_URL = "https://web-production-efe2.up.railway.app"

# Step 1: Health Check
Write-Host "Step 1: Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$API_URL/api/health"
    Write-Host "✅ API Status: $($health.message)" -ForegroundColor Green
    Write-Host "   Timestamp: $($health.timestamp)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ API Down! Error: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Step 2: Login
Write-Host "Step 2: Login Test..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@railway.com"
    password = "testpass123"
} | ConvertTo-Json

try {
    $loginResp = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($loginResp.success) {
        $token = $loginResp.data.token
        $userId = $loginResp.data.user.id
        Write-Host "✅ Login Success!" -ForegroundColor Green
        Write-Host "   User ID: $userId" -ForegroundColor Gray
        Write-Host "   Email: $($loginResp.data.user.email)" -ForegroundColor Gray
        Write-Host "   Token: $($token.Substring(0,30))...`n" -ForegroundColor Gray
    } else {
        Write-Host "❌ Login Failed: $($loginResp.message)`n" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Login Error: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Step 3: Check Token Decode
Write-Host "Step 3: Token Validation..." -ForegroundColor Yellow
try {
    $tokenParts = $token.Split('.')
    $payload = $tokenParts[1]
    $payloadPadded = $payload + ('=' * (4 - ($payload.Length % 4)))
    $payloadBytes = [Convert]::FromBase64String($payloadPadded)
    $payloadJson = [System.Text.Encoding]::UTF8.GetString($payloadBytes)
    $payloadObj = $payloadJson | ConvertFrom-Json
    
    Write-Host "✅ Token Decoded:" -ForegroundColor Green
    Write-Host "   id: $($payloadObj.id)" -ForegroundColor Gray
    Write-Host "   email: $($payloadObj.email)" -ForegroundColor Gray
    Write-Host "   exp: $($payloadObj.exp) ($(([DateTimeOffset]::FromUnixTimeSeconds($payloadObj.exp)).LocalDateTime))`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Token Decode Error: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Step 4: Check Files List
Write-Host "Step 4: Files List Test..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $filesResp = Invoke-RestMethod -Uri "$API_URL/api/files" -Headers $headers
    Write-Host "✅ Files API Working!" -ForegroundColor Green
    Write-Host "   Total files: $($filesResp.data.totalFiles)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Files API Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody`n" -ForegroundColor Gray
    }
}

# Step 5: Check Storage Stats
Write-Host "Step 5: Storage Stats Test..." -ForegroundColor Yellow
try {
    $statsResp = Invoke-RestMethod -Uri "$API_URL/api/files/stats" -Headers $headers
    Write-Host "✅ Storage Stats Working!" -ForegroundColor Green
    Write-Host "   Used: $($statsResp.data.storage.used) bytes" -ForegroundColor Gray
    Write-Host "   Limit: $($statsResp.data.storage.limit) bytes" -ForegroundColor Gray
    Write-Host "   Plan: $($statsResp.data.subscription.plan_name)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Storage Stats Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody`n" -ForegroundColor Gray
    }
}

# Step 6: Attempt Upload via Web Request (Simple Test)
Write-Host "Step 6: Upload Test (via Web Request)..." -ForegroundColor Yellow
Write-Host "   This will likely fail with 'Unexpected end of form'" -ForegroundColor Gray
Write-Host "   The REAL test must be done in browser with proper FormData`n" -ForegroundColor Gray

# Create test file
$testContent = "Exora ID Upload Test - $(Get-Date)"
$testContent | Out-File "test-diagnostic.txt" -Encoding UTF8

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DIAGNOSIS COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📋 RESULTS SUMMARY:`n" -ForegroundColor Yellow

Write-Host "✅ What's Working:" -ForegroundColor Green
Write-Host "   - API is online and responding" -ForegroundColor Gray
Write-Host "   - Login endpoint works" -ForegroundColor Gray
Write-Host "   - Token generation works" -ForegroundColor Gray
Write-Host "   - Token payload correct (id, email)" -ForegroundColor Gray

Write-Host "`n❌ What Needs Testing:" -ForegroundColor Red
Write-Host "   - Files list endpoint" -ForegroundColor Gray
Write-Host "   - Storage stats endpoint" -ForegroundColor Gray
Write-Host "   - Upload endpoint (MUST test in browser!)" -ForegroundColor Gray

Write-Host "`n🔧 NEXT STEPS:`n" -ForegroundColor Yellow

Write-Host "1. Open Browser Developer Console (F12)" -ForegroundColor White
Write-Host "2. Go to: $API_URL" -ForegroundColor Cyan
Write-Host "3. Login: test@railway.com / testpass123" -ForegroundColor White
Write-Host "4. Try to upload file" -ForegroundColor White
Write-Host "5. Check Console tab for errors" -ForegroundColor White
Write-Host "6. Check Network tab for failed requests" -ForegroundColor White
Write-Host "7. Screenshot and report the error message`n" -ForegroundColor White

Write-Host "📝 Common Issues:" -ForegroundColor Yellow
Write-Host "   A. S3_BUCKET_NAME di Railway masih 'kilatbox-storage'" -ForegroundColor Gray
Write-Host "      → Update ke 'exora-storage' atau tetap pakai 'kilatbox-storage'" -ForegroundColor Gray
Write-Host "   B. Bucket belum dibuat di CloudKilat" -ForegroundColor Gray
Write-Host "      → Buat bucket di panel.cloudkilat.com" -ForegroundColor Gray
Write-Host "   C. CloudKilat credentials salah" -ForegroundColor Gray
Write-Host "      → Check Railway Variables: CLOUDKILAT_ACCESS_KEY, CLOUDKILAT_SECRET_KEY" -ForegroundColor Gray
Write-Host "   D. Railway belum selesai deploy" -ForegroundColor Gray
Write-Host "      → Check Deployments tab, tunggu sampai Success" -ForegroundColor Gray

Write-Host "`n========================================`n" -ForegroundColor Cyan

# Save token for manual testing
$global:exoraToken = $token
Write-Host "Token saved to variable: exoraToken" -ForegroundColor Gray
Write-Host "You can use this for manual API testing" -ForegroundColor Gray
Write-Host ""
