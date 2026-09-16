const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Get applications' });
});

router.post('/', authMiddleware, (req, res) => {
  res.json({ message: 'Submit application' });
});

router.put('/:id/status', authMiddleware, (req, res) => {
  res.json({ message: 'Update application status' });
});

module.exports = router;
