const express = require('express');
const router = express.Router();

// Mock routes - will be implemented with controllers
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

module.exports = router;
