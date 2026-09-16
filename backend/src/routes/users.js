const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Get user profile', user: req.user });
});

router.put('/:id', authMiddleware, (req, res) => {
  res.json({ message: 'Update user profile' });
});

module.exports = router;
