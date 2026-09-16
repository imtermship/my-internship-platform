const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAllInternships, getInternshipById, createInternship, updateInternship } = require('../controllers/internshipController');

router.get('/', getAllInternships);
router.get('/:id', getInternshipById);
router.post('/', authMiddleware, createInternship);
router.put('/:id', authMiddleware, updateInternship);

module.exports = router;
