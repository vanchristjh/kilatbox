const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// Generate unique transaction ID
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TRX-${timestamp}-${random}`;
}

// Create new payment
router.post('/create', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { plan_id, payment_method, notes } = req.body;
    const user_id = req.user.id;

    // Validate plan exists
    const planResult = await client.query(
      'SELECT * FROM subscription_plans WHERE id = $1',
      [plan_id]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Plan tidak ditemukan' 
      });
    }

    const plan = planResult.rows[0];
    const transaction_id = generateTransactionId();

    // Create payment record
    const result = await client.query(
      `INSERT INTO payments (user_id, plan_id, amount, payment_method, status, transaction_id, notes)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6)
       RETURNING *`,
      [user_id, plan_id, plan.price, payment_method || 'manual_transfer', transaction_id, notes]
    );

    res.json({
      success: true,
      message: 'Pembayaran berhasil dibuat. Silakan lakukan pembayaran.',
      payment: result.rows[0],
      payment_info: {
        amount: plan.price,
        plan_name: plan.display_name,
        transaction_id: transaction_id
      }
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal membuat pembayaran' 
    });
  } finally {
    client.release();
  }
});

// Get user's payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, sp.display_name as plan_name, sp.storage_limit
       FROM payments p
       JOIN subscription_plans sp ON p.plan_id = sp.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      payments: result.rows
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal mengambil histori pembayaran' 
    });
  }
});

// Upload payment proof
router.post('/upload-proof/:payment_id', authenticateToken, async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { proof_url } = req.body;
    const user_id = req.user.id;

    // Verify payment belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM payments WHERE id = $1 AND user_id = $2',
      [payment_id, user_id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pembayaran tidak ditemukan' 
      });
    }

    // Update payment proof
    const result = await pool.query(
      `UPDATE payments 
       SET payment_proof_url = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [proof_url, payment_id, user_id]
    );

    res.json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah',
      payment: result.rows[0]
    });

  } catch (error) {
    console.error('Error uploading payment proof:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal mengunggah bukti pembayaran' 
    });
  }
});

// Confirm payment (simulate manual approval)
router.post('/confirm/:payment_id', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { payment_id } = req.params;
    const user_id = req.user.id;

    // Get payment details
    const paymentResult = await client.query(
      'SELECT * FROM payments WHERE id = $1 AND user_id = $2',
      [payment_id, user_id]
    );

    if (paymentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        success: false, 
        error: 'Pembayaran tidak ditemukan' 
      });
    }

    const payment = paymentResult.rows[0];

    if (payment.status === 'completed') {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false, 
        error: 'Pembayaran sudah dikonfirmasi sebelumnya' 
      });
    }

    // Update payment status
    await client.query(
      `UPDATE payments 
       SET status = 'completed', paid_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [payment_id]
    );

    // Update or create user subscription
    const subCheckResult = await client.query(
      'SELECT * FROM user_subscriptions WHERE user_id = $1',
      [user_id]
    );

    if (subCheckResult.rows.length > 0) {
      // Update existing subscription
      await client.query(
        `UPDATE user_subscriptions 
         SET plan_id = $1, started_at = NOW(), is_active = TRUE
         WHERE user_id = $2`,
        [payment.plan_id, user_id]
      );
    } else {
      // Create new subscription
      await client.query(
        `INSERT INTO user_subscriptions (user_id, plan_id, is_active)
         VALUES ($1, $2, TRUE)`,
        [user_id, payment.plan_id]
      );
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi! Subscription Anda telah diaktifkan.'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error confirming payment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal mengkonfirmasi pembayaran' 
    });
  } finally {
    client.release();
  }
});

// Get pending payments (for user)
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, sp.display_name as plan_name, sp.price
       FROM payments p
       JOIN subscription_plans sp ON p.plan_id = sp.id
       WHERE p.user_id = $1 AND p.status = 'pending'
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      pending_payments: result.rows
    });

  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal mengambil pembayaran pending' 
    });
  }
});

// Cancel payment
router.post('/cancel/:payment_id', authenticateToken, async (req, res) => {
  try {
    const { payment_id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      `UPDATE payments 
       SET status = 'rejected', updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND status = 'pending'
       RETURNING *`,
      [payment_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pembayaran tidak ditemukan atau tidak dapat dibatalkan' 
      });
    }

    res.json({
      success: true,
      message: 'Pembayaran berhasil dibatalkan',
      payment: result.rows[0]
    });

  } catch (error) {
    console.error('Error canceling payment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Gagal membatalkan pembayaran' 
    });
  }
});

module.exports = router;
