# 💳 Payment Feature - Quick Start

## Setup Cepat

### 1. Update Database
```bash
# Tambahkan tabel payments ke database
psql -U postgres -d kilatbox -f add_payments_table.sql

# Atau jika menggunakan schema.sql lengkap
psql -U postgres -d kilatbox -f schema.sql
```

### 2. Start Server
```bash
node server.js
```

### 3. Test Payment Feature
```bash
node test-payment.js
```

## Cara Pakai (Manual Test via UI)

### 1. Login
- Buka: `http://localhost:3000`
- Login dengan akun Anda

### 2. Pilih Plan
- Buka: `http://localhost:3000/plans.html`
- Klik "Pilih Paket" pada plan berbayar (Pro/Business/Enterprise)

### 3. Buat Pembayaran
- Otomatis redirect ke: `http://localhost:3000/payment.html`
- Plan yang dipilih otomatis ter-select
- Pilih metode pembayaran
- Klik "Buat Pembayaran"

### 4. Konfirmasi Pembayaran
- Lihat Transaction ID yang muncul
- Scroll ke "Pembayaran Pending"
- Klik "Konfirmasi Pembayaran"
- Subscription otomatis aktif!

## Fitur

✅ **Create Payment** - Buat pembayaran baru  
✅ **Payment History** - Lihat riwayat pembayaran  
✅ **Pending Payments** - Kelola pembayaran pending  
✅ **Confirm Payment** - Konfirmasi pembayaran manual  
✅ **Cancel Payment** - Batalkan pembayaran  
✅ **Auto Subscription Update** - Subscription otomatis aktif setelah konfirmasi  

## API Endpoints

```
POST   /api/payments/create           - Buat pembayaran baru
GET    /api/payments/history          - Riwayat pembayaran
GET    /api/payments/pending          - Pembayaran pending
POST   /api/payments/upload-proof/:id - Upload bukti transfer
POST   /api/payments/confirm/:id      - Konfirmasi pembayaran
POST   /api/payments/cancel/:id       - Batalkan pembayaran
```

## Rekening Transfer

**Bank:** BCA  
**No. Rekening:** 1234567890  
**Atas Nama:** KilatBox Indonesia

## Status Pembayaran

- `pending` - Menunggu konfirmasi
- `completed` - Berhasil, subscription aktif
- `rejected` - Dibatalkan

## Troubleshooting

### "Tabel payments tidak ada"
```bash
psql -U postgres -d kilatbox -f add_payments_table.sql
```

### "Route /api/payments tidak ditemukan"
Pastikan server sudah di-restart setelah menambahkan route baru

### Payment tidak update subscription
Cek database:
```sql
SELECT * FROM payments WHERE status = 'completed';
SELECT * FROM user_subscriptions;
```

## Dokumentasi Lengkap

Lihat: [PAYMENT_FEATURE_GUIDE.md](./PAYMENT_FEATURE_GUIDE.md)

---

**Catatan:** Ini adalah sistem pembayaran manual sederhana. Untuk production, sebaiknya gunakan payment gateway seperti Midtrans atau Xendit.
