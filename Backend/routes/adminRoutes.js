const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    createClass,
    addStudentToClass,
    removeStudentFromClass,
    getAllTeachers,
    getAllStudents
} = require('../controllers/adminController');

// All routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

// Class management
router.post('/classes', createClass);
router.post('/classes/:classId/students', addStudentToClass);
router.delete('/classes/:classId/students/:studentId', removeStudentFromClass);

// Get teachers and students for dropdowns
router.get('/teachers', getAllTeachers);
router.get('/students', getAllStudents);

module.exports = router;

