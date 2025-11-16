const express = require('express');
const pool = require('../database/db');
const { authenticate } = require('../middleware/auth');
const { processReport } = require('../services/aiService');
const { logReportToBlockchain } = require('../services/blockchainService');
const { ethers } = require('ethers');

const router = express.Router();

// Create report
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const userId = req.user.userId;
    
    // Process with AI
    const fullText = `${title}. ${description}`;
    const aiResult = await processReport(fullText);
    
    // Insert report with AI results
    const result = await pool.query(
      `INSERT INTO reports (user_id, title, description, location, category, urgency, ai_summary, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') 
       RETURNING *`,
      [userId, title, description, location, aiResult.category, aiResult.urgency, aiResult.summary]
    );
    
    // Log AI processing
    await pool.query(
      `INSERT INTO ai_processing_log (report_id, original_text, ai_summary, ai_category, ai_urgency, processing_time_ms) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [result.rows[0].id, fullText, aiResult.summary, aiResult.category, aiResult.urgency, aiResult.processingTime]
    );
    
    // Insert initial status history
    await pool.query(
      `INSERT INTO report_status_history (report_id, status, updated_by) 
       VALUES ($1, 'pending', $2)`,
      [result.rows[0].id, userId]
    );
    
    // Log to blockchain
    const metaHash = ethers.id(fullText).substring(0, 10);
    const txHash = await logReportToBlockchain(
      result.rows[0].id,
      'pending',
      metaHash
    );
    
    if (txHash) {
      await pool.query(
        'UPDATE reports SET blockchain_tx_hash = $1 WHERE id = $2',
        [txHash, result.rows[0].id]
      );
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all reports (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, category, urgency } = req.query;
    let query = 'SELECT r.*, u.name as user_name FROM reports r JOIN users u ON r.user_id = u.id WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    if (status) {
      query += ` AND r.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    if (category) {
      query += ` AND r.category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }
    
    if (urgency) {
      query += ` AND r.urgency = $${paramCount}`;
      params.push(urgency);
      paramCount++;
    }
    
    query += ' ORDER BY r.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single report
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const report = await pool.query(
      `SELECT r.*, u.name as user_name, u.rt_rw 
       FROM reports r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.id = $1`,
      [id]
    );
    
    if (report.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Get status history
    const history = await pool.query(
      `SELECT h.*, u.name as updated_by_name 
       FROM report_status_history h 
       JOIN users u ON h.updated_by = u.id 
       WHERE h.report_id = $1 
       ORDER BY h.created_at ASC`,
      [id]
    );
    
    res.json({
      ...report.rows[0],
      history: history.rows
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update report status (pengurus only)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.userId;
    
    // Update report
    await pool.query(
      `UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [status, id]
    );
    
    // Log to blockchain
    const metaHash = ethers.id(`${id}-${status}`).substring(0, 10);
    const txHash = await logReportToBlockchain(id, status, metaHash);
    
    // Add to history
    await pool.query(
      `INSERT INTO report_status_history (report_id, status, notes, updated_by, blockchain_tx_hash) 
       VALUES ($1, $2, $3, $4, $5)`,
      [id, status, notes, userId, txHash]
    );
    
    const updated = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    res.json(updated.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

