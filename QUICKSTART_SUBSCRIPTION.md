# 🚀 QUICK START - Subscription System

## 1️⃣ Setup Database (WAJIB!)
```bash
psql -U postgres -d kilatbox_db -f kilatbox/schema.sql
```

## 2️⃣ Start Server
```bash
cd kilatbox
npm start
```

## 3️⃣ Test Basic Flow

### Register & Auto Free Plan
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

### View Plans
```
Browser: http://localhost:3000/plans.html
API: http://localhost:3000/api/subscriptions/plans
```

### Upgrade to Pro (plan_id=2)
```bash
curl -X POST http://localhost:3000/api/subscriptions/upgrade \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan_id":2}'
```

## 🎯 Plan IDs
- Free: 1
- Pro: 2
- Business: 3
- Enterprise: 4

## 📋 Features per Plan
- **Free**: upload, download, delete
- **Pro+**: share_file, auto_backup
- **Business+**: team_folder, statistics
- **Enterprise+**: internal_employee, api_integration

## 🔗 Key URLs
- Plans Page: http://localhost:3000/plans.html
- Dashboard: http://localhost:3000/dashboard.html
- API Docs: SUBSCRIPTION_FEATURES.md
- Setup Guide: SETUP_SUBSCRIPTION.md

## ⚡ Quick Tests

### Test Share (Pro+)
```bash
curl -X POST http://localhost:3000/api/share/1/share \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"expiresInDays":7}'
```

### Test Team Folder (Business+)
```bash
curl -X POST http://localhost:3000/api/team-folders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"folder_name":"Test Folder"}'
```

### Test Statistics (Business+)
```bash
curl -H "Authorization: Bearer TOKEN" \
     http://localhost:3000/api/statistics/storage
```

## 🐛 Troubleshooting

**No subscription?**
```sql
INSERT INTO user_subscriptions (user_id, plan_id, is_active)
SELECT id, 1, TRUE FROM users WHERE id NOT IN (SELECT user_id FROM user_subscriptions);
```

**Check user plan:**
```sql
SELECT u.email, sp.plan_name FROM users u
JOIN user_subscriptions us ON u.id=us.user_id
JOIN subscription_plans sp ON us.plan_id=sp.id
WHERE us.is_active=TRUE;
```

## ✅ Done!
Sistem subscription KilatBox siap digunakan! 🎉
