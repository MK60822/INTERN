const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { 
    createClass, 
    getAllClasses, 
    manageStudent, 
    getClassReport 
} = require('../controllers/classController');

// All routes are protected and admin-only
router.post('/', protect, adminOnly, createClass);
router.get('/', protect, adminOnly, getAllClasses);
router.put('/:id/student', protect, adminOnly, manageStudent);
router.get('/:id/report', protect, adminOnly, getClassReport);

module.exports = router;

