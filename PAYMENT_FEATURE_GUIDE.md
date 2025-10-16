# 💳 Panduan Fitur Pembayaran KilatBox

## 📋 Daftar Isi
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Flow Pembayaran](#flow-pembayaran)
5. [Cara Menggunakan](#cara-menggunakan)
6. [Testing](#testing)

---

## Overview

Fitur pembayaran sederhana yang memungkinkan user untuk:
- ✅ Membuat pembayaran untuk upgrade subscription
- ✅ Melihat riwayat pembayaran
- ✅ Konfirmasi pembayaran manual
- ✅ Upload bukti pembayaran (optional)
- ✅ Cancel pembayaran yang pending

---

## Database Schema

### Tabel `payments`

```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'manual_transfer',
  payment_proof_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(100) UNIQUE,
  notes TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Kolom:**
- `user_id`: ID user yang melakukan pembayaran
- `plan_id`: ID plan yang dibeli
- `amount`: Jumlah pembayaran
- `payment_method`: Metode pembayaran (manual_transfer, ewallet, credit_card)
- `payment_proof_url`: URL bukti transfer (optional)
- `status`: Status pembayaran (pending, approved, rejected, completed)
- `transaction_id`: ID transaksi unik
- `notes`: Catatan tambahan
- `paid_at`: Timestamp pembayaran dikonfirmasi

---

## API Endpoints

### 1. Create Payment
**POST** `/api/payments/create`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "plan_id": 2,
  "payment_method": "manual_transfer",
  "notes": "Transfer dari BCA"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat. Silakan lakukan pembayaran.",
  "payment": {
    "id": 1,
    "user_id": 1,
    "plan_id": 2,
    "amount": "50000.00",
    "status": "pending",
    "transaction_id": "TRX-1697452800000-1234"
  },
  "payment_info": {
    "amount": 50000,
    "plan_name": "Pro Plan",
    "transaction_id": "TRX-1697452800000-1234"
  }
}
```

---

### 2. Get Payment History
**GET** `/api/payments/history`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "id": 1,
      "amount": "50000.00",
      "status": "completed",
      "plan_name": "Pro Plan",
      "transaction_id": "TRX-1697452800000-1234",
      "created_at": "2024-10-16T10:00:00Z",
      "paid_at": "2024-10-16T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Pending Payments
**GET** `/api/payments/pending`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "success": true,
  "pending_payments": [
    {
      "id": 2,
      "amount": "200000.00",
      "status": "pending",
      "plan_name": "Business Plan",
      "transaction_id": "TRX-1697453000000-5678"
    }
  ]
}
```

---

### 4. Upload Payment Proof
**POST** `/api/payments/upload-proof/:payment_id`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "proof_url": "https://example.com/proof.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bukti pembayaran berhasil diunggah",
  "payment": {
    "id": 1,
    "payment_proof_url": "https://example.com/proof.jpg"
  }
}
```

---

### 5. Confirm Payment
**POST** `/api/payments/confirm/:payment_id`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dikonfirmasi! Subscription Anda telah diaktifkan."
}
```

**Note:** Endpoint ini juga akan mengupdate subscription user secara otomatis.

---

### 6. Cancel Payment
**POST** `/api/payments/cancel/:payment_id`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibatalkan",
  "payment": {
    "id": 1,
    "status": "rejected"
  }
}
```

---

## Flow Pembayaran

### 1. User memilih plan di halaman Plans

```
Plans Page → Klik "Pilih Paket" (untuk paid plan) → Redirect ke Payment Page
```

### 2. User membuat pembayaran

```
Payment Page → Pilih Plan → Pilih Metode → Submit → Get Transaction ID
```

### 3. User melakukan transfer

```
User transfer ke rekening yang ditampilkan
Transaction ID: TRX-XXXXX (untuk referensi)
```

### 4. User konfirmasi pembayaran

```
Payment Page → Pending Payments → Klik "Konfirmasi Pembayaran"
```

### 5. Subscription diaktifkan otomatis

```
Status berubah "completed" → User subscription updated → Redirect ke Dashboard
```

---

## Cara Menggunakan

### 1. Setup Database

Jalankan SQL migration:
```bash
psql -U postgres -d kilatbox -f schema.sql
```

### 2. Start Server

```bash
node server.js
```

### 3. Test Flow:

1. **Login** ke aplikasi
2. **Buka halaman Plans**: `http://localhost:3000/plans.html`
3. **Pilih plan berbayar** (Pro/Business/Enterprise)
4. **Akan redirect** ke halaman payment: `http://localhost:3000/payment.html`
5. **Plan akan ter-select otomatis**
6. **Isi form**:
   - Metode pembayaran
   - Catatan (optional)
7. **Klik "Buat Pembayaran"**
8. **Lihat Transaction ID** yang muncul
9. **Konfirmasi pembayaran** dengan klik tombol "Konfirmasi Pembayaran"
10. **Subscription otomatis aktif** dan redirect ke dashboard

---

## Testing

### Test dengan cURL:

#### 1. Create Payment
```bash
curl -X POST http://localhost:3000/api/payments/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": 2,
    "payment_method": "manual_transfer",
    "notes": "Test payment"
  }'
```

#### 2. Get Payment History
```bash
curl http://localhost:3000/api/payments/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 3. Confirm Payment
```bash
curl -X POST http://localhost:3000/api/payments/confirm/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Informasi Rekening

**Bank:** BCA  
**No. Rekening:** 1234567890  
**Atas Nama:** KilatBox Indonesia

*Note: Ini adalah contoh, ganti dengan rekening real untuk production*

---

## Status Pembayaran

- **pending**: Menunggu konfirmasi user
- **completed**: Pembayaran berhasil, subscription aktif
- **rejected**: Pembayaran dibatalkan
- **approved**: Reserved untuk admin approval (future feature)

---

## Features yang Sudah Ada

✅ Create payment  
✅ Payment history  
✅ Pending payments list  
✅ Manual confirmation  
✅ Cancel payment  
✅ Auto-update subscription on confirm  
✅ Transaction ID generation  
✅ Integration with plans page  

---

## Future Enhancements (Optional)

- 🔄 Payment gateway integration (Midtrans, Xendit, dll)
- 📧 Email notification setelah payment
- 👨‍💼 Admin panel untuk approve payment
- 📱 Upload bukti transfer langsung dari UI
- 🔔 Payment reminder untuk pending payments
- 📊 Payment analytics dashboard

---

## Troubleshooting

### Payment tidak tersimpan
- Cek koneksi database
- Pastikan plan_id valid
- Cek token authentication

### Subscription tidak terupdate setelah konfirmasi
- Cek transaction di database
- Pastikan payment status berubah ke "completed"
- Cek foreign key constraint

### Error "Plan tidak ditemukan"
- Pastikan plan_id ada di tabel subscription_plans
- Cek dengan query: `SELECT * FROM subscription_plans;`

---

## Database Queries Berguna

### Check all payments
```sql
SELECT p.*, u.email, sp.display_name 
FROM payments p
JOIN users u ON p.user_id = u.id
JOIN subscription_plans sp ON p.plan_id = sp.id
ORDER BY p.created_at DESC;
```

### Check pending payments
```sql
SELECT * FROM payments 
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Check user subscription after payment
```sql
SELECT us.*, sp.display_name, p.status as payment_status
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id
LEFT JOIN payments p ON p.user_id = us.user_id
WHERE us.user_id = 1;
```

---

## Kesimpulan

Fitur pembayaran sudah siap digunakan! Sistem ini simple dan mudah digunakan untuk proses manual transfer. User bisa langsung konfirmasi sendiri setelah transfer, dan subscription akan otomatis aktif.

Happy coding! 🚀
