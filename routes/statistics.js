const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken, checkFeature } = require('../middleware/auth');

// Get storage statistics (Business+)
router.get('/storage', authenticateToken, checkFeature('statistics'), async (req, res) => {
  try {
    // Get storage summary
    const storageResult = await pool.query(
      `SELECT u.storage_used, sp.storage_limit
       FROM users u
       JOIN user_subscriptions us ON u.id = us.user_id
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE u.id = $1 AND us.is_active = TRUE`,
      [req.user.id]
    );
    
    // Get file type breakdown
    const fileTypesResult = await pool.query(
      `SELECT 
         CASE 
           WHEN mime_type LIKE 'image%' THEN 'Images'
           WHEN mime_type LIKE 'video%' THEN 'Videos'
           WHEN mime_type LIKE 'audio%' THEN 'Audio'
           WHEN mime_type LIKE 'application/pdf' THEN 'PDFs'
           WHEN mime_type LIKE 'application/vnd%' OR mime_type LIKE 'application/msword%' THEN 'Documents'
           WHEN mime_type LIKE 'application/zip%' OR mime_type LIKE 'application/x-rar%' THEN 'Archives'
           ELSE 'Others'
         END as file_type,
         COUNT(*) as count,
         SUM(size) as total_size
       FROM files
       WHERE user_id = $1
       GROUP BY file_type
       ORDER BY total_size DESC`,
      [req.user.id]
    );
    
    // Get upload trend (last 30 days)
    const trendResult = await pool.query(
      `SELECT 
         DATE(uploaded_at) as date,
         COUNT(*) as files_uploaded,
         SUM(size) as bytes_uploaded
       FROM files
       WHERE user_id = $1 
         AND uploaded_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(uploaded_at)
       ORDER BY date DESC`,
      [req.user.id]
    );
    
    // Get largest files
    const largestFilesResult = await pool.query(
      `SELECT original_name, size, mime_type, uploaded_at
       FROM files
       WHERE user_id = $1
       ORDER BY size DESC
       LIMIT 10`,
      [req.user.id]
    );
    
    res.json({
      storage: {
        used: storageResult.rows[0].storage_used,
        limit: storageResult.rows[0].storage_limit,
        percentage: storageResult.rows[0].storage_limit === -1 ? 0 : 
          ((storageResult.rows[0].storage_used / storageResult.rows[0].storage_limit) * 100).toFixed(2)
      },
      file_types: fileTypesResult.rows,
      upload_trend: trendResult.rows,
      largest_files: largestFilesResult.rows
    });
  } catch (error) {
    console.error('Error getting storage statistics:', error);
    res.status(500).json({ error: 'Failed to get storage statistics' });
  }
});

// Get file statistics (Business+)
router.get('/files', authenticateToken, checkFeature('statistics'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_files,
         COUNT(CASE WHEN is_shared THEN 1 END) as shared_files,
         COUNT(CASE WHEN folder_id IS NOT NULL THEN 1 END) as files_in_folders,
         MAX(uploaded_at) as last_upload,
         MIN(uploaded_at) as first_upload,
         AVG(size)::BIGINT as average_file_size
       FROM files
       WHERE user_id = $1`,
      [req.user.id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting file statistics:', error);
    res.status(500).json({ error: 'Failed to get file statistics' });
  }
});

// Get share statistics (Business+)
router.get('/shares', authenticateToken, checkFeature('statistics'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_shares,
         SUM(download_count) as total_downloads,
         COUNT(CASE WHEN expires_at IS NULL THEN 1 END) as permanent_shares,
         COUNT(CASE WHEN expires_at IS NOT NULL AND expires_at > NOW() THEN 1 END) as active_shares,
         COUNT(CASE WHEN expires_at IS NOT NULL AND expires_at <= NOW() THEN 1 END) as expired_shares
       FROM shared_files
       WHERE shared_by = $1`,
      [req.user.id]
    );
    
    // Get most downloaded shares
    const topSharesResult = await pool.query(
      `SELECT f.original_name, sf.download_count, sf.created_at, sf.share_token
       FROM shared_files sf
       JOIN files f ON sf.file_id = f.id
       WHERE sf.shared_by = $1
       ORDER BY sf.download_count DESC
       LIMIT 10`,
      [req.user.id]
    );
    
    res.json({
      summary: result.rows[0],
      top_shares: topSharesResult.rows
    });
  } catch (error) {
    console.error('Error getting share statistics:', error);
    res.status(500).json({ error: 'Failed to get share statistics' });
  }
});

// Get activity log (Business+)
router.get('/activity', authenticateToken, checkFeature('statistics'), async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  
  try {
    // Get recent file uploads
    const uploads = await pool.query(
      `SELECT 'upload' as activity_type, original_name as description, uploaded_at as timestamp
       FROM files
       WHERE user_id = $1
       ORDER BY uploaded_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );
    
    res.json({
      activities: uploads.rows,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error getting activity log:', error);
    res.status(500).json({ error: 'Failed to get activity log' });
  }
});

module.exports = router;
