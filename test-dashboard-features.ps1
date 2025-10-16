#!/usr/bin/env pwsh
# Quick Test Dashboard Features

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   DASHBOARD FEATURES TEST" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
Write-Host "1. Checking if server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Server is running!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Server is not running. Please start with: node server.js" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Testing API endpoints..." -ForegroundColor Yellow

# Test auth endpoint (should return 401 without token)
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/files" -Method GET -SkipHttpErrorCheck
    if ($response.StatusCode -eq 401) {
        Write-Host "   ✅ Auth middleware working" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Unexpected status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Auth endpoint error" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   FEATURES TO TEST MANUALLY" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$features = @(
    "✅ Upload file (drag & drop)",
    "✅ Upload file (button click)",
    "✅ Progress bar saat upload",
    "✅ List files dengan icon",
    "✅ Search files",
    "✅ Download file",
    "✅ Share file (modal + copy link)",
    "✅ Delete file (dengan konfirmasi)",
    "✅ Storage statistics update",
    "✅ Toast notifications",
    "✅ Loading states",
    "✅ Error handling"
)

Write-Host "Please test these features manually:" -ForegroundColor White
Write-Host ""
foreach ($feature in $features) {
    Write-Host "  $feature" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   TESTING STEPS" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host "2. Login with your credentials" -ForegroundColor White
Write-Host "3. You should see the dashboard with dark theme" -ForegroundColor White
Write-Host "4. Test each feature:" -ForegroundColor White
Write-Host ""
Write-Host "   📤 UPLOAD:" -ForegroundColor Yellow
Write-Host "      - Drag a file to upload zone" -ForegroundColor Gray
Write-Host "      - See progress bar (0-100%)" -ForegroundColor Gray
Write-Host "      - Wait for success toast" -ForegroundColor Gray
Write-Host ""
Write-Host "   📋 LIST:" -ForegroundColor Yellow
Write-Host "      - See all your files with icons" -ForegroundColor Gray
Write-Host "      - Different colors for different types" -ForegroundColor Gray
Write-Host ""
Write-Host "   🔍 SEARCH:" -ForegroundColor Yellow
Write-Host "      - Type in search box" -ForegroundColor Gray
Write-Host "      - Files filter in real-time" -ForegroundColor Gray
Write-Host ""
Write-Host "   ⬇️  DOWNLOAD:" -ForegroundColor Yellow
Write-Host "      - Click blue download icon" -ForegroundColor Gray
Write-Host "      - New tab opens with file" -ForegroundColor Gray
Write-Host ""
Write-Host "   🔗 SHARE:" -ForegroundColor Yellow
Write-Host "      - Click green share icon" -ForegroundColor Gray
Write-Host "      - Modal appears with link" -ForegroundColor Gray
Write-Host "      - Click 'Salin Link'" -ForegroundColor Gray
Write-Host "      - Test link in incognito" -ForegroundColor Gray
Write-Host ""
Write-Host "   🗑️  DELETE:" -ForegroundColor Yellow
Write-Host "      - Click red delete icon" -ForegroundColor Gray
Write-Host "      - Confirm in modal" -ForegroundColor Gray
Write-Host "      - File disappears from list" -ForegroundColor Gray
Write-Host ""
Write-Host "   📊 STATISTICS:" -ForegroundColor Yellow
Write-Host "      - Check storage used (top cards)" -ForegroundColor Gray
Write-Host "      - Upload file → storage increases" -ForegroundColor Gray
Write-Host "      - Delete file → storage decreases" -ForegroundColor Gray
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   EXPECTED BEHAVIORS" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Toast notifications appear for all actions" -ForegroundColor Green
Write-Host "✅ Loading spinners show during operations" -ForegroundColor Green
Write-Host "✅ Progress bar moves smoothly (upload)" -ForegroundColor Green
Write-Host "✅ Modals are styled with dark theme" -ForegroundColor Green
Write-Host "✅ Buttons have hover effects" -ForegroundColor Green
Write-Host "✅ All animations are smooth" -ForegroundColor Green
Write-Host "✅ Responsive on mobile" -ForegroundColor Green
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   IF ERRORS OCCUR" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Open browser console (F12)" -ForegroundColor White
Write-Host "2. Check for JavaScript errors" -ForegroundColor White
Write-Host "3. Check Network tab for failed requests" -ForegroundColor White
Write-Host "4. Verify .env file has correct credentials" -ForegroundColor White
Write-Host "5. Check server console for errors" -ForegroundColor White
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "   DOCUMENTATION" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📄 Full documentation: DASHBOARD_FEATURES_COMPLETE.md" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Dashboard is ready for testing!" -ForegroundColor Green
Write-Host "🚀 All features have been implemented and improved!" -ForegroundColor Green
Write-Host ""
