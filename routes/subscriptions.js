const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

// Get all available subscription plans
router.get('/plans', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, plan_name, display_name, storage_limit, price, features FROM subscription_plans ORDER BY price ASC'
    );
    
    // Format storage limit untuk display
    const plans = result.rows.map(plan => {
      let storageDisplay;
      if (plan.storage_limit === -1) {
        storageDisplay = 'Unlimited';
      } else {
        const gb = plan.storage_limit / (1024 * 1024 * 1024);
        storageDisplay = `${gb} GB`;
      }
      
      return {
        ...plan,
        storage_display: storageDisplay
      };
    });
    
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
});

// Get user's current subscription
router.get('/my-subscription', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT us.*, sp.plan_name, sp.display_name, sp.storage_limit, sp.price, sp.features, u.storage_used
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.id
       JOIN users u ON us.user_id = u.id
       WHERE us.user_id = $1 AND us.is_active = TRUE`,
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      // User belum punya subscription, assign Free Plan
      const freePlan = await pool.query(
        "SELECT id FROM subscription_plans WHERE plan_name = 'free'"
      );
      
      await pool.query(
        'INSERT INTO user_subscriptions (user_id, plan_id, is_active) VALUES ($1, $2, TRUE)',
        [req.user.id, freePlan.rows[0].id]
      );
      
      // Fetch ulang
      const newResult = await pool.query(
        `SELECT us.*, sp.plan_name, sp.display_name, sp.storage_limit, sp.price, sp.features, u.storage_used
         FROM user_subscriptions us
         JOIN subscription_plans sp ON us.plan_id = sp.id
         JOIN users u ON us.user_id = u.id
         WHERE us.user_id = $1 AND us.is_active = TRUE`,
        [req.user.id]
      );
      
      return res.json(formatSubscriptionData(newResult.rows[0]));
    }
    
    res.json(formatSubscriptionData(result.rows[0]));
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Upgrade/Change subscription
router.post('/upgrade', authenticateToken, async (req, res) => {
  const { plan_id } = req.body;
  
  if (!plan_id) {
    return res.status(400).json({ error: 'Plan ID is required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Cek apakah plan valid
    const planResult = await client.query(
      'SELECT * FROM subscription_plans WHERE id = $1',
      [plan_id]
    );
    
    if (planResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    const newPlan = planResult.rows[0];
    
    // Cek storage usage vs new limit
    const userResult = await client.query(
      'SELECT storage_used FROM users WHERE id = $1',
      [req.user.id]
    );
    
    const storageUsed = userResult.rows[0].storage_used;
    
    if (newPlan.storage_limit !== -1 && storageUsed > newPlan.storage_limit) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Cannot downgrade: current storage usage exceeds new plan limit',
        storage_used: storageUsed,
        new_limit: newPlan.storage_limit
      });
    }
    
    // Deactivate current subscription
    await client.query(
      'UPDATE user_subscriptions SET is_active = FALSE WHERE user_id = $1',
      [req.user.id]
    );
    
    // Create new subscription
    await client.query(
      `INSERT INTO user_subscriptions (user_id, plan_id, is_active) 
       VALUES ($1, $2, TRUE)`,
      [req.user.id, plan_id]
    );
    
    await client.query('COMMIT');
    
    res.json({ 
      message: 'Subscription updated successfully',
      new_plan: newPlan.display_name
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ error: 'Failed to upgrade subscription' });
  } finally {
    client.release();
  }
});

// Check if user has feature access
router.get('/check-feature/:feature', authenticateToken, async (req, res) => {
  const { feature } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT sp.features
       FROM user_subscriptions us
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE us.user_id = $1 AND us.is_active = TRUE`,
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.json({ has_access: false });
    }
    
    const features = result.rows[0].features;
    const hasAccess = features.includes(feature);
    
    res.json({ has_access: hasAccess });
  } catch (error) {
    console.error('Error checking feature access:', error);
    res.status(500).json({ error: 'Failed to check feature access' });
  }
});

// Check storage quota
router.get('/quota', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.storage_used, sp.storage_limit
       FROM users u
       JOIN user_subscriptions us ON u.id = us.user_id
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE u.id = $1 AND us.is_active = TRUE`,
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User subscription not found' });
    }
    
    const { storage_used, storage_limit } = result.rows[0];
    const isUnlimited = storage_limit === -1;
    const percentageUsed = isUnlimited ? 0 : ((storage_used / storage_limit) * 100).toFixed(2);
    
    res.json({
      storage_used,
      storage_limit,
      is_unlimited: isUnlimited,
      percentage_used: parseFloat(percentageUsed),
      storage_used_display: formatBytes(storage_used),
      storage_limit_display: isUnlimited ? 'Unlimited' : formatBytes(storage_limit)
    });
  } catch (error) {
    console.error('Error checking quota:', error);
    res.status(500).json({ error: 'Failed to check quota' });
  }
});

// Helper functions
function formatSubscriptionData(subscription) {
  let storageDisplay;
  if (subscription.storage_limit === -1) {
    storageDisplay = 'Unlimited';
  } else {
    const gb = subscription.storage_limit / (1024 * 1024 * 1024);
    storageDisplay = `${gb} GB`;
  }
  
  const percentageUsed = subscription.storage_limit === -1 
    ? 0 
    : ((subscription.storage_used / subscription.storage_limit) * 100).toFixed(2);
  
  return {
    ...subscription,
    storage_display: storageDisplay,
    storage_used_display: formatBytes(subscription.storage_used),
    percentage_used: parseFloat(percentageUsed),
    is_unlimited: subscription.storage_limit === -1
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

module.exports = router;
