const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Get institution data' });
});

router.get('/students/:id', authMiddleware, (req, res) => {
  res.json({ message: 'Get institution students' });
});

module.exports = router;
