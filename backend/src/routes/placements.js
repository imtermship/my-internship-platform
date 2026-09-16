const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { markInternshipComplete } = require('../controllers/completionController');

router.post('/mark-complete', authMiddleware, markInternshipComplete);

module.exports = router;
