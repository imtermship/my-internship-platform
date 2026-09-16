const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { register, login, verifyToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;
