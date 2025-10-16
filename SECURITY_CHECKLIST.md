# 🔐 Production Security Checklist

## ✅ Sebelum Deploy

### 1. Environment Variables
- [ ] JWT_SECRET diganti dengan string random yang kuat (minimal 64 karakter)
- [ ] Database password diganti (jangan gunakan default)
- [ ] CloudKilat credentials sudah benar
- [ ] NODE_ENV diset ke "production"
- [ ] Semua credentials TIDAK ada di Git repository

### 2. File .gitignore
- [ ] .env sudah ada di .gitignore
- [ ] node_modules/ sudah ada di .gitignore
- [ ] File log sudah diabaikan
- [ ] Backup database files diabaikan

### 3. Dependencies
- [ ] Tidak ada unused packages
- [ ] Semua packages up-to-date (check dengan npm audit)
- [ ] Production dependencies terpisah dari dev dependencies

### 4. Database
- [ ] Schema.sql sudah dijalankan di production database
- [ ] Database backup strategy sudah ada
- [ ] Connection pooling sudah dikonfigurasi
- [ ] SSL enabled untuk database (jika production)

### 5. CORS Configuration
- [ ] CORS origin diset ke domain production (tidak pakai '*')
- [ ] Credentials sudah dikonfigurasi dengan benar

## 🛡️ Setelah Deploy

### 1. Security Headers
Tambahkan rate limiting dan security headers. Instal:
```bash
npm install express-rate-limit helmet
```

Edit `server.js`:
```javascript
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### 2. HTTPS/SSL
- [ ] SSL certificate sudah terinstall
- [ ] Force HTTPS redirect aktif
- [ ] Certificate auto-renewal dikonfigurasi (Let's Encrypt)

### 3. Database Security
- [ ] Database tidak exposed ke public internet
- [ ] Hanya aplikasi yang bisa akses database
- [ ] Regular backups dikonfigurasi
- [ ] SQL injection prevention (sudah menggunakan parameterized queries)

### 4. CloudKilat/S3 Security
- [ ] Bucket permissions sudah benar
- [ ] Access keys tidak exposed
- [ ] Signed URLs digunakan untuk private files
- [ ] File upload size limits dikonfigurasi

### 5. Monitoring
- [ ] Error logging dikonfigurasi
- [ ] Uptime monitoring aktif (UptimeRobot, Pingdom, dll)
- [ ] Performance monitoring (optional: New Relic, DataDog)

### 6. Backup Strategy
- [ ] Database backup otomatis
- [ ] File storage backup (CloudKilat)
- [ ] Backup restoration sudah ditest

## 🚨 Red Flags - Jangan Lakukan Ini!

❌ Commit file .env ke Git
❌ Gunakan password default (admin/admin123)
❌ Expose database port ke public
❌ Gunakan JWT_SECRET yang weak ('secret', 'mysecret', dll)
❌ Disable SSL/HTTPS di production
❌ Tidak ada rate limiting untuk auth endpoints
❌ Tidak ada backup database
❌ Gunakan CORS origin '*' di production
❌ Hardcode credentials di code
❌ Tidak monitor error logs

## 📊 Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-domain.com/api/health
```

### 2. Security Headers Check
Buka: https://securityheaders.com
Masukkan URL aplikasi Anda

### 3. SSL/TLS Check
Buka: https://www.ssllabs.com/ssltest/
Masukkan domain Anda

### 4. Performance Check
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### 5. Functional Testing
- [ ] Register user baru
- [ ] Login
- [ ] Upload file
- [ ] Download file
- [ ] Delete file
- [ ] Payment flow (jika sudah aktif)
- [ ] Dashboard statistics

## 🔄 Maintenance Checklist

### Weekly
- [ ] Check error logs
- [ ] Monitor disk space
- [ ] Check database size

### Monthly
- [ ] Update dependencies (npm update)
- [ ] Security audit (npm audit fix)
- [ ] Review access logs
- [ ] Test backup restoration
- [ ] Check SSL certificate expiry

### Quarterly
- [ ] Review and update security policies
- [ ] Performance optimization review
- [ ] Cost optimization (hosting, storage)
- [ ] Update documentation

## 🆘 Emergency Contacts

### Jika Terjadi Masalah
1. **Server Down**
   - Check hosting dashboard
   - Check error logs
   - Restart application
   - Check database connection

2. **Database Issues**
   - Check connection string
   - Check database server status
   - Restore from backup if needed

3. **Storage Issues**
   - Check CloudKilat dashboard
   - Verify credentials
   - Check bucket permissions

4. **Security Breach**
   - Rotate all credentials immediately
   - Check access logs
   - Update passwords
   - Inform affected users
   - Contact hosting support

## 📚 Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Node.js Security Best Practices: https://nodejs.org/en/docs/guides/security/
- Express Security Tips: https://expressjs.com/en/advanced/best-practice-security.html
- PostgreSQL Security: https://www.postgresql.org/docs/current/security.html

## ✅ Final Checklist Before Going Live

- [ ] All security items checked
- [ ] SSL certificate installed and tested
- [ ] Environment variables properly set
- [ ] Database schema deployed
- [ ] Backups configured and tested
- [ ] Monitoring set up
- [ ] Error logging working
- [ ] Performance tested under load
- [ ] All endpoints tested
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Rollback plan prepared

---

**Remember:** Security is not a one-time setup, it's an ongoing process!
