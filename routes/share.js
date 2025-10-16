const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken, checkFeature } = require('../middleware/auth');
const crypto = require('crypto');

// Share file (Pro+)
router.post('/:fileId/share', authenticateToken, checkFeature('share_file'), async (req, res) => {
  const { fileId } = req.params;
  const { expiresInDays } = req.body;
  
  try {
    // Verify file ownership
    const fileResult = await pool.query(
      'SELECT * FROM files WHERE id = $1 AND user_id = $2',
      [fileId, req.user.id]
    );
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }
    
    // Generate unique share token
    const shareToken = crypto.randomBytes(32).toString('hex');
    
    // Calculate expiration
    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
    }
    
    // Create share record
    const shareResult = await pool.query(
      `INSERT INTO shared_files (file_id, shared_by, share_token, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [fileId, req.user.id, shareToken, expiresAt]
    );
    
    // Update file is_shared status
    await pool.query(
      'UPDATE files SET is_shared = TRUE WHERE id = $1',
      [fileId]
    );
    
    const shareUrl = `${req.protocol}://${req.get('host')}/api/share/${shareToken}`;
    
    res.json({
      message: 'File shared successfully',
      share_url: shareUrl,
      share_token: shareToken,
      expires_at: expiresAt
    });
  } catch (error) {
    console.error('Error sharing file:', error);
    res.status(500).json({ error: 'Failed to share file' });
  }
});

// Get shared file info
router.get('/:shareToken', async (req, res) => {
  const { shareToken } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT sf.*, f.original_name, f.size, f.mime_type, f.object_key, u.name as shared_by_name
       FROM shared_files sf
       JOIN files f ON sf.file_id = f.id
       JOIN users u ON sf.shared_by = u.id
       WHERE sf.share_token = $1`,
      [shareToken]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shared file not found' });
    }
    
    const share = result.rows[0];
    
    // Check if expired
    if (share.expires_at && new Date(share.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Share link has expired' });
    }
    
    // Increment download count
    await pool.query(
      'UPDATE shared_files SET download_count = download_count + 1 WHERE share_token = $1',
      [shareToken]
    );
    
    res.json({
      file_name: share.original_name,
      size: share.size,
      mime_type: share.mime_type,
      shared_by: share.shared_by_name,
      download_count: share.download_count + 1,
      created_at: share.created_at,
      expires_at: share.expires_at
    });
  } catch (error) {
    console.error('Error getting shared file:', error);
    res.status(500).json({ error: 'Failed to get shared file' });
  }
});

// List user's shared files
router.get('/my-shares', authenticateToken, checkFeature('share_file'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sf.*, f.original_name, f.size
       FROM shared_files sf
       JOIN files f ON sf.file_id = f.id
       WHERE sf.shared_by = $1
       ORDER BY sf.created_at DESC`,
      [req.user.id]
    );
    
    const shares = result.rows.map(share => ({
      ...share,
      share_url: `${req.protocol}://${req.get('host')}/api/share/${share.share_token}`,
      is_expired: share.expires_at && new Date(share.expires_at) < new Date()
    }));
    
    res.json(shares);
  } catch (error) {
    console.error('Error listing shares:', error);
    res.status(500).json({ error: 'Failed to list shares' });
  }
});

// Revoke share
router.delete('/:shareToken', authenticateToken, async (req, res) => {
  const { shareToken } = req.params;
  
  try {
    const result = await pool.query(
      `DELETE FROM shared_files 
       WHERE share_token = $1 AND shared_by = $2
       RETURNING file_id`,
      [shareToken, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Share not found or unauthorized' });
    }
    
    // Check if file has other shares
    const otherShares = await pool.query(
      'SELECT COUNT(*) FROM shared_files WHERE file_id = $1',
      [result.rows[0].file_id]
    );
    
    if (otherShares.rows[0].count === '0') {
      await pool.query(
        'UPDATE files SET is_shared = FALSE WHERE id = $1',
        [result.rows[0].file_id]
      );
    }
    
    res.json({ message: 'Share revoked successfully' });
  } catch (error) {
    console.error('Error revoking share:', error);
    res.status(500).json({ error: 'Failed to revoke share' });
  }
});

module.exports = router;
