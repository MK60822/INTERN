const express = require('express');
const router = express.Router();
const { protect, teacherOnly } = require('../middleware/authMiddleware');
const {
    generateSessionCode,
    getClassReport,
    getMyClasses
} = require('../controllers/teacherController');

// All routes are protected and teacher-only
router.use(protect);
router.use(teacherOnly);

// Session code generation
router.post('/generate-code', generateSessionCode);

// Class report with student percentages
router.get('/class-report/:classId', getClassReport);

// Get teacher's classes
router.get('/my-classes', getMyClasses);

module.exports = router;

