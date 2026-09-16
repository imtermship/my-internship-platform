const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  submitApplication,
  getApplications,
  acceptApplication,
  rejectApplication,
  verifyAcceptance,
  confirmAcceptance,
} = require('../controllers/applicationController');

router.get('/', authMiddleware, getApplications);
router.post('/submit', authMiddleware, submitApplication);
router.post('/accept', authMiddleware, acceptApplication);
router.post('/reject', authMiddleware, rejectApplication);
router.post('/verify', verifyAcceptance);
router.post('/confirm', authMiddleware, confirmAcceptance);

module.exports = router;
