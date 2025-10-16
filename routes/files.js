const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../s3');
const pool = require('../models/db');
const { authenticateToken, checkStorageQuota } = require('../middleware/auth');
const crypto = require('crypto');
const path = require('path');

// Konfigurasi multer untuk upload file ke memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // Maksimal 100MB per file
  },
  fileFilter: (req, file, cb) => {
    // Filter file types (opsional - bisa disesuaikan)
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|zip|rar|mp4|mp3/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// GET /api/files - List semua file user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, file_name, original_name, object_key, mime_type, size, uploaded_at FROM files WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: {
        files: result.rows,
        totalFiles: result.rows.length
      }
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching files' 
    });
  }
});

// POST /api/files/upload - Upload file ke CloudKilat Storage
router.post('/upload', authenticateToken, checkStorageQuota, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const file = req.file;
    const userId = req.user.id;

    // Generate unique filename untuk S3
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${userId}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${fileExtension}`;

    // Upload ke CloudKilat Storage (S3)
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        'original-name': file.originalname,
        'uploaded-by': userId.toString()
      }
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Simpan metadata file ke database
    const fileResult = await pool.query(
      'INSERT INTO files (user_id, file_name, original_name, object_key, mime_type, size) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, uniqueFileName, file.originalname, uniqueFileName, file.mimetype, file.size]
    );

    // Update storage_used user
    await pool.query(
      'UPDATE users SET storage_used = storage_used + $1 WHERE id = $2',
      [file.size, userId]
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: fileResult.rows[0]
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.message === 'File type not allowed') {
      return res.status(400).json({ 
        success: false, 
        message: 'File type not allowed' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error during upload' 
    });
  }
});

// GET /api/files/download/:id - Generate presigned URL untuk download
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Ambil data file dari database
    const result = await pool.query(
      'SELECT * FROM files WHERE id = $1 AND user_id = $2',
      [fileId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }

    const file = result.rows[0];

    // Generate presigned URL untuk download (berlaku 15 menit)
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.object_key,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(file.original_name)}"`
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 menit

    res.status(200).json({
      success: true,
      data: {
        downloadUrl,
        fileName: file.original_name,
        fileSize: file.size,
        mimeType: file.mime_type,
        expiresIn: '15 minutes'
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while generating download link' 
    });
  }
});

// DELETE /api/files/delete/:id - Hapus file
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Ambil data file dari database
    const result = await pool.query(
      'SELECT * FROM files WHERE id = $1 AND user_id = $2',
      [fileId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }

    const file = result.rows[0];

    // Hapus file dari CloudKilat Storage
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.object_key
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    // Hapus metadata dari database
    await pool.query('DELETE FROM files WHERE id = $1', [fileId]);

    // Update storage_used user
    await pool.query(
      'UPDATE users SET storage_used = storage_used - $1 WHERE id = $2',
      [file.size, userId]
    );

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: {
        deletedFile: {
          id: file.id,
          fileName: file.original_name
        }
      }
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting file' 
    });
  }
});

// GET /api/files/stats - Get storage statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get storage info from subscription
    const subResult = await pool.query(
      `SELECT u.storage_used, sp.storage_limit
       FROM users u
       JOIN user_subscriptions us ON u.id = us.user_id
       JOIN subscription_plans sp ON us.plan_id = sp.id
       WHERE u.id = $1 AND us.is_active = TRUE`,
      [userId]
    );

    const filesResult = await pool.query(
      'SELECT COUNT(*) as total_files FROM files WHERE user_id = $1',
      [userId]
    );

    if (subResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User subscription not found' 
      });
    }

    const user = subResult.rows[0];
    const totalFiles = parseInt(filesResult.rows[0].total_files);

    res.status(200).json({
      success: true,
      data: {
        storageUsed: user.storage_used,
        storageLimit: user.storage_limit,
        storageAvailable: user.storage_limit - user.storage_used,
        storageUsedPercentage: ((user.storage_used / user.storage_limit) * 100).toFixed(2),
        totalFiles: totalFiles
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching statistics' 
    });
  }
});

module.exports = router;
