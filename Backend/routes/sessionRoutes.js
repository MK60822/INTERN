const express = require('express');
const router = express.Router();
const { createSession, markAttendance, getActiveSession } = require('../controllers/sessionController');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// Create a new session (Teacher only)
router.post('/', protect, teacherOnly, createSession);

// Mark attendance using session code (Student only - we'll add studentOnly middleware)
router.post('/mark-attendance', protect, markAttendance);

// Get active session for a class (Teacher only)
router.get('/class/:classId', protect, teacherOnly, getActiveSession);

module.exports = router;

