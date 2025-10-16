const jwt = require('jsonwebtoken');
const pool = require('../models/db');

// Middleware untuk verifikasi JWT token
const verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user ke request object
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
};

// Middleware untuk cek storage quota
const checkStorageQuota = async (req, res, next) => {
  try {
    const fileSize = parseInt(req.headers['content-length']) || 0;
    
    const result = await pool.query(
      `SELECT u.storage_used, sp.storage_limit
       FROM users u
       JOIN user_subscriptions us ON u.id = us.user_id
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE u.id = $1 AND us.is_active = TRUE`,
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'No active subscription found' });
    }
    
    const { storage_used, storage_limit } = result.rows[0];
    
    // Jika unlimited (-1), skip check
    if (storage_limit === -1) {
      return next();
    }
    
    // Cek apakah masih ada ruang
    if (storage_used + fileSize > storage_limit) {
      return res.status(403).json({ 
        error: 'Storage quota exceeded',
        storage_used,
        storage_limit,
        file_size: fileSize,
        message: 'Please upgrade your plan to upload more files'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error checking storage quota:', error);
    res.status(500).json({ error: 'Failed to check storage quota' });
  }
};

// Middleware untuk cek fitur berdasarkan plan
const checkFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT sp.features
         FROM user_subscriptions us
         JOIN subscription_plans sp ON us.plan_id = sp.id
         WHERE us.user_id = $1 AND us.is_active = TRUE`,
        [req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(403).json({ 
          error: 'No active subscription found' 
        });
      }
      
      const features = result.rows[0].features;
      
      if (!features.includes(featureName)) {
        return res.status(403).json({ 
          error: `Feature '${featureName}' not available in your current plan`,
          message: 'Please upgrade your plan to access this feature'
        });
      }
      
      next();
    } catch (error) {
      console.error('Error checking feature access:', error);
      res.status(500).json({ error: 'Failed to check feature access' });
    }
  };
};

module.exports = { 
  authenticateToken: verifyToken,
  verifyToken,
  checkStorageQuota,
  checkFeature
};

