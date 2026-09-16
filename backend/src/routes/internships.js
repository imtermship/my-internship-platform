const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', (req, res) => {
  res.json({ message: 'Get all internships' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get internship details' });
});

router.post('/', authMiddleware, (req, res) => {
  res.json({ message: 'Create new internship' });
});

module.exports = router;
