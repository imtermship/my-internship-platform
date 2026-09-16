const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Get company profile' });
});

router.put('/', authMiddleware, (req, res) => {
  res.json({ message: 'Update company profile' });
});

module.exports = router;
