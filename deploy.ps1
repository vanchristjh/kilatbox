# KilatBox Quick Deploy Script
# Pilih platform hosting Anda

Write-Host "================================" -ForegroundColor Cyan
Write-Host "   KilatBox Deployment Helper   " -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pilih platform hosting:" -ForegroundColor Yellow
Write-Host "1. Railway (Recommended)" -ForegroundColor Green
Write-Host "2. Render" -ForegroundColor Green
Write-Host "3. Heroku" -ForegroundColor Green
Write-Host "4. Docker Compose (Local/VPS)" -ForegroundColor Green
Write-Host "5. Setup Git Repository" -ForegroundColor Green
Write-Host "0. Exit" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Masukkan pilihan (0-5)"

switch ($choice) {
    "1" {
        Write-Host "`n=== Railway Deployment ===" -ForegroundColor Cyan
        Write-Host "1. Push code ke GitHub terlebih dahulu (pilih opsi 5 jika belum)" -ForegroundColor Yellow
        Write-Host "2. Buka: https://railway.app" -ForegroundColor Yellow
        Write-Host "3. Klik 'Start a New Project' -> 'Deploy from GitHub repo'" -ForegroundColor Yellow
        Write-Host "4. Pilih repository KilatBox" -ForegroundColor Yellow
        Write-Host "5. Tambah PostgreSQL: Klik 'New' -> 'Database' -> 'PostgreSQL'" -ForegroundColor Yellow
        Write-Host "6. Set Environment Variables di tab 'Variables'" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Environment Variables yang perlu diset:" -ForegroundColor Green
        Write-Host "CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id"
        Write-Host "CLOUDKILAT_ACCESS_KEY=<your-key>"
        Write-Host "CLOUDKILAT_SECRET_KEY=<your-secret>"
        Write-Host "S3_BUCKET_NAME=kilatbox-storage"
        Write-Host "JWT_SECRET=<random-string>"
        Write-Host "NODE_ENV=production"
        Write-Host "PORT=3000"
        Write-Host ""
        Write-Host "7. Setelah deploy, jalankan schema.sql di PostgreSQL" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Buka browser untuk melanjutkan ke Railway? (Y/N)" -ForegroundColor Cyan
        $open = Read-Host
        if ($open -eq "Y" -or $open -eq "y") {
            Start-Process "https://railway.app"
        }
    }
    "2" {
        Write-Host "`n=== Render Deployment ===" -ForegroundColor Cyan
        Write-Host "1. Push code ke GitHub terlebih dahulu (pilih opsi 5 jika belum)" -ForegroundColor Yellow
        Write-Host "2. Buka: https://render.com" -ForegroundColor Yellow
        Write-Host "3. Klik 'New +' -> 'Web Service'" -ForegroundColor Yellow
        Write-Host "4. Connect GitHub repository" -ForegroundColor Yellow
        Write-Host "5. Konfigurasi:" -ForegroundColor Yellow
        Write-Host "   - Name: kilatbox"
        Write-Host "   - Environment: Node"
        Write-Host "   - Build Command: npm install"
        Write-Host "   - Start Command: npm start"
        Write-Host "6. Tambah PostgreSQL: 'New +' -> 'PostgreSQL'" -ForegroundColor Yellow
        Write-Host "7. Set Environment Variables sama seperti Railway" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Buka browser untuk melanjutkan ke Render? (Y/N)" -ForegroundColor Cyan
        $open = Read-Host
        if ($open -eq "Y" -or $open -eq "y") {
            Start-Process "https://render.com"
        }
    }
    "3" {
        Write-Host "`n=== Heroku Deployment ===" -ForegroundColor Cyan
        Write-Host "Catatan: Heroku tidak lagi gratis (minimal $5/bulan)" -ForegroundColor Red
        Write-Host ""
        
        # Check if Heroku CLI is installed
        $herokuInstalled = Get-Command heroku -ErrorAction SilentlyContinue
        
        if (-not $herokuInstalled) {
            Write-Host "Heroku CLI belum terinstall." -ForegroundColor Yellow
            Write-Host "Download dari: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Buka halaman download? (Y/N)" -ForegroundColor Cyan
            $open = Read-Host
            if ($open -eq "Y" -or $open -eq "y") {
                Start-Process "https://devcenter.heroku.com/articles/heroku-cli"
            }
        } else {
            Write-Host "Heroku CLI terdeteksi!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Jalankan perintah berikut:" -ForegroundColor Yellow
            Write-Host "1. heroku login"
            Write-Host "2. heroku create kilatbox"
            Write-Host "3. heroku addons:create heroku-postgresql:mini"
            Write-Host "4. heroku config:set CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id"
            Write-Host "5. heroku config:set CLOUDKILAT_ACCESS_KEY=<your-key>"
            Write-Host "6. heroku config:set CLOUDKILAT_SECRET_KEY=<your-secret>"
            Write-Host "7. heroku config:set S3_BUCKET_NAME=kilatbox-storage"
            Write-Host "8. heroku config:set JWT_SECRET=<random-string>"
            Write-Host "9. heroku config:set NODE_ENV=production"
            Write-Host "10. git push heroku main"
            Write-Host "11. heroku pg:psql < schema.sql"
        }
    }
    "4" {
        Write-Host "`n=== Docker Compose Deployment ===" -ForegroundColor Cyan
        
        # Check if Docker is installed
        $dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
        
        if (-not $dockerInstalled) {
            Write-Host "Docker belum terinstall." -ForegroundColor Red
            Write-Host "Download Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Buka halaman download? (Y/N)" -ForegroundColor Cyan
            $open = Read-Host
            if ($open -eq "Y" -or $open -eq "y") {
                Start-Process "https://www.docker.com/products/docker-desktop"
            }
        } else {
            Write-Host "Docker terdeteksi!" -ForegroundColor Green
            Write-Host ""
            
            # Create .env file for docker-compose
            Write-Host "Membuat file .env untuk Docker Compose..." -ForegroundColor Yellow
            
            $envContent = @"
# Database Password
DB_PASSWORD=kilatbox_secure_password_123

# CloudKilat Configuration
CLOUDKILAT_S3_ENDPOINT=https://s3-id-jkt-1.kilatstorage.id
CLOUDKILAT_ACCESS_KEY=your_access_key_here
CLOUDKILAT_SECRET_KEY=your_secret_key_here
S3_BUCKET_NAME=kilatbox-storage

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Node Environment
NODE_ENV=production
"@
            
            $envContent | Out-File -FilePath ".env.docker" -Encoding UTF8
            
            Write-Host "File .env.docker telah dibuat!" -ForegroundColor Green
            Write-Host "Edit file .env.docker dan isi kredensial yang benar" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Kemudian jalankan:" -ForegroundColor Cyan
            Write-Host "docker-compose --env-file .env.docker up -d" -ForegroundColor White
            Write-Host ""
            Write-Host "Untuk melihat logs:" -ForegroundColor Cyan
            Write-Host "docker-compose logs -f app" -ForegroundColor White
            Write-Host ""
            Write-Host "Untuk stop:" -ForegroundColor Cyan
            Write-Host "docker-compose down" -ForegroundColor White
            Write-Host ""
            
            Write-Host "Jalankan Docker Compose sekarang? (Y/N)" -ForegroundColor Yellow
            $run = Read-Host
            if ($run -eq "Y" -or $run -eq "y") {
                Write-Host "Pastikan sudah edit .env.docker terlebih dahulu!" -ForegroundColor Red
                Write-Host "Press Enter untuk melanjutkan atau Ctrl+C untuk batal..."
                Read-Host
                docker-compose --env-file .env.docker up -d
                Write-Host ""
                Write-Host "Aplikasi berjalan di: http://localhost:3000" -ForegroundColor Green
            }
        }
    }
    "5" {
        Write-Host "`n=== Setup Git Repository ===" -ForegroundColor Cyan
        
        # Check if git is installed
        $gitInstalled = Get-Command git -ErrorAction SilentlyContinue
        
        if (-not $gitInstalled) {
            Write-Host "Git belum terinstall." -ForegroundColor Red
            Write-Host "Download dari: https://git-scm.com/downloads" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Buka halaman download? (Y/N)" -ForegroundColor Cyan
            $open = Read-Host
            if ($open -eq "Y" -or $open -eq "y") {
                Start-Process "https://git-scm.com/downloads"
            }
        } else {
            Write-Host "Git terdeteksi!" -ForegroundColor Green
            Write-Host ""
            
            # Check if already a git repo
            if (Test-Path ".git") {
                Write-Host "Repository Git sudah diinisialisasi!" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "Remote repository saat ini:" -ForegroundColor Cyan
                git remote -v
                Write-Host ""
                Write-Host "Push ke remote? (Y/N)" -ForegroundColor Yellow
                $push = Read-Host
                if ($push -eq "Y" -or $push -eq "y") {
                    git add .
                    git commit -m "Prepare for deployment"
                    git push
                }
            } else {
                Write-Host "Inisialisasi Git repository..." -ForegroundColor Yellow
                git init
                Write-Host ""
                
                Write-Host "Masukkan URL GitHub repository (contoh: https://github.com/username/kilatbox.git):" -ForegroundColor Cyan
                $repoUrl = Read-Host
                
                if ($repoUrl) {
                    git remote add origin $repoUrl
                    git add .
                    git commit -m "Initial commit - KilatBox deployment ready"
                    
                    Write-Host ""
                    Write-Host "Push ke GitHub? (Y/N)" -ForegroundColor Yellow
                    $push = Read-Host
                    if ($push -eq "Y" -or $push -eq "y") {
                        git branch -M main
                        git push -u origin main
                        Write-Host ""
                        Write-Host "Code berhasil di push ke GitHub!" -ForegroundColor Green
                        Write-Host "Sekarang Anda bisa deploy ke Railway atau Render" -ForegroundColor Green
                    }
                }
            }
        }
    }
    "0" {
        Write-Host "Keluar..." -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host "Pilihan tidak valid!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Untuk panduan lengkap, baca file: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter untuk keluar..."
Read-Host
