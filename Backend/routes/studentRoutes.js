const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getMyPercentage,
    getEnrolledClasses
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected (student only)
router.use(protect);

// Mark attendance with session code
router.post('/mark-attendance', markAttendance);

// Get student's attendance percentage
router.get('/my-percentage', getMyPercentage);

// Get enrolled classes
router.get('/classes', getEnrolledClasses);

module.exports = router;

