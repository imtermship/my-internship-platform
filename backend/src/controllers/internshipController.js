const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const getAllInternships = async (req, res) => {
  try {
    const { search, location, workMode, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM internship_listings WHERE status = \'active\'';
    const params = [];

    if (search) {
      query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    if (location) {
      query += ` AND location ILIKE $${params.length + 1}`;
      params.push(`%${location}%`);
    }

    if (workMode) {
      query += ` AND work_mode = $${params.length + 1}`;
      params.push(workMode);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json({ internships: result.rows, total: result.rows.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM internship_listings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    res.json({ internship: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInternship = async (req, res) => {
  try {
    const { title, description, location, workMode, startDate, endDate, durationWeeks, salary } = req.body;
    const { userId } = req.user;

    // Verify company exists
    const companyResult = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (companyResult.rows.length === 0) {
      return res.status(403).json({ error: 'You must create a company profile first' });
    }

    const companyId = companyResult.rows[0].id;
    const internshipId = uuidv4();

    await pool.query(
      `INSERT INTO internship_listings 
       (id, company_id, title, description, location, work_mode, start_date, end_date, duration_weeks, salary, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [internshipId, companyId, title, description, location, workMode, startDate, endDate, durationWeeks, salary, 'active']
    );

    res.status(201).json({
      message: 'Internship created successfully',
      internship: { id: internshipId, title, description, location, workMode, startDate, endDate },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    await pool.query(
      'UPDATE internship_listings SET title = $1, description = $2, status = $3, updated_at = NOW() WHERE id = $4',
      [title, description, status, id]
    );

    res.json({ message: 'Internship updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllInternships, getInternshipById, createInternship, updateInternship };
