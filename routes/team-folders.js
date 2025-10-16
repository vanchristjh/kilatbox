const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken, checkFeature } = require('../middleware/auth');

// Create team folder (Business+)
router.post('/', authenticateToken, checkFeature('team_folder'), async (req, res) => {
  const { folder_name, description } = req.body;
  
  if (!folder_name) {
    return res.status(400).json({ error: 'Folder name is required' });
  }
  
  try {
    const result = await pool.query(
      `INSERT INTO team_folders (owner_id, folder_name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, folder_name, description]
    );
    
    res.status(201).json({
      message: 'Team folder created successfully',
      folder: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating team folder:', error);
    res.status(500).json({ error: 'Failed to create team folder' });
  }
});

// List team folders
router.get('/', authenticateToken, checkFeature('team_folder'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tf.*, u.name as owner_name, COUNT(f.id) as file_count
       FROM team_folders tf
       JOIN users u ON tf.owner_id = u.id
       LEFT JOIN files f ON f.folder_id = tf.id
       WHERE tf.owner_id = $1
       GROUP BY tf.id, u.name
       ORDER BY tf.created_at DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error listing team folders:', error);
    res.status(500).json({ error: 'Failed to list team folders' });
  }
});

// Get team folder details
router.get('/:folderId', authenticateToken, checkFeature('team_folder'), async (req, res) => {
  const { folderId } = req.params;
  
  try {
    const folderResult = await pool.query(
      `SELECT tf.*, u.name as owner_name
       FROM team_folders tf
       JOIN users u ON tf.owner_id = u.id
       WHERE tf.id = $1 AND tf.owner_id = $2`,
      [folderId, req.user.id]
    );
    
    if (folderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team folder not found' });
    }
    
    const filesResult = await pool.query(
      `SELECT id, file_name, original_name, size, mime_type, uploaded_at
       FROM files
       WHERE folder_id = $1
       ORDER BY uploaded_at DESC`,
      [folderId]
    );
    
    res.json({
      folder: folderResult.rows[0],
      files: filesResult.rows
    });
  } catch (error) {
    console.error('Error getting team folder:', error);
    res.status(500).json({ error: 'Failed to get team folder' });
  }
});

// Update team folder
router.put('/:folderId', authenticateToken, checkFeature('team_folder'), async (req, res) => {
  const { folderId } = req.params;
  const { folder_name, description } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE team_folders
       SET folder_name = COALESCE($1, folder_name),
           description = COALESCE($2, description)
       WHERE id = $3 AND owner_id = $4
       RETURNING *`,
      [folder_name, description, folderId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team folder not found' });
    }
    
    res.json({
      message: 'Team folder updated successfully',
      folder: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating team folder:', error);
    res.status(500).json({ error: 'Failed to update team folder' });
  }
});

// Delete team folder
router.delete('/:folderId', authenticateToken, checkFeature('team_folder'), async (req, res) => {
  const { folderId } = req.params;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Remove folder_id from files
    await client.query(
      'UPDATE files SET folder_id = NULL WHERE folder_id = $1',
      [folderId]
    );
    
    // Delete folder
    const result = await client.query(
      'DELETE FROM team_folders WHERE id = $1 AND owner_id = $2 RETURNING *',
      [folderId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Team folder not found' });
    }
    
    await client.query('COMMIT');
    
    res.json({ message: 'Team folder deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting team folder:', error);
    res.status(500).json({ error: 'Failed to delete team folder' });
  } finally {
    client.release();
  }
});

// Add file to team folder
router.post('/:folderId/files/:fileId', authenticateToken, checkFeature('team_folder'), async (req, res) => {
  const { folderId, fileId } = req.params;
  
  try {
    // Verify folder ownership
    const folderResult = await pool.query(
      'SELECT * FROM team_folders WHERE id = $1 AND owner_id = $2',
      [folderId, req.user.id]
    );
    
    if (folderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team folder not found' });
    }
    
    // Verify file ownership
    const fileResult = await pool.query(
      'UPDATE files SET folder_id = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [folderId, fileId, req.user.id]
    );
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }
    
    res.json({
      message: 'File added to team folder successfully',
      file: fileResult.rows[0]
    });
  } catch (error) {
    console.error('Error adding file to folder:', error);
    res.status(500).json({ error: 'Failed to add file to folder' });
  }
});

// Remove file from team folder
router.delete('/:folderId/files/:fileId', authenticateToken, checkFeature('team_folder'), async (req, res) => {
  const { folderId, fileId } = req.params;
  
  try {
    const result = await pool.query(
      `UPDATE files 
       SET folder_id = NULL 
       WHERE id = $1 AND folder_id = $2 AND user_id = $3
       RETURNING *`,
      [fileId, folderId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found in this folder' });
    }
    
    res.json({
      message: 'File removed from team folder successfully',
      file: result.rows[0]
    });
  } catch (error) {
    console.error('Error removing file from folder:', error);
    res.status(500).json({ error: 'Failed to remove file from folder' });
  }
});

module.exports = router;
