# Full Test Script for Exora ID

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  Exora ID Registration Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Navigate to project directory
Set-Location D:\PROJECT\ITB\Exora ID

Write-Host "`n1. Testing database connection..." -ForegroundColor Yellow
psql -U postgres -d Exora ID -c "SELECT current_database(), current_user;"

Write-Host "`n2. Checking tables..." -ForegroundColor Yellow
psql -U postgres -d Exora ID -c "\dt"

Write-Host "`n3. Server should be running on http://localhost:3000" -ForegroundColor Yellow
Write-Host "   If not, run: .\start-server.ps1 in another terminal`n" -ForegroundColor Gray

Write-Host "4. Testing registration API..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
node test-register.js

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  Test Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Green
Write-Host "1. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host "2. Try to register a new account" -ForegroundColor White
Write-Host "3. Login with the account" -ForegroundColor White
Write-Host "4. Upload files!`n" -ForegroundColor White
