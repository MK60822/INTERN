const Class = require('../models/Class');
const User = require('../models/User');

// @desc    Create a new class
// @route   POST /api/admin/classes
// @access  Admin Only
const createClass = async (req, res) => {
    const { className, subject, teacherId } = req.body;

    try {
        // Validate teacher exists and is actually a teacher
        const teacher = await User.findById(teacherId);
        
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        if (teacher.role !== 'teacher') {
            return res.status(400).json({ message: 'Selected user is not a teacher' });
        }

        // Create the class
        const newClass = await Class.create({
            className,
            subject,
            teacher: teacherId,
            students: []
        });

        res.status(201).json({
            message: 'Class created successfully',
            class: newClass
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add student to a class
// @route   POST /api/admin/classes/:classId/students
// @access  Admin Only
const addStudentToClass = async (req, res) => {
    const { classId } = req.params;
    const { studentId } = req.body;

    try {
        // Validate student exists and is actually a student
        const student = await User.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.role !== 'student') {
            return res.status(400).json({ message: 'Selected user is not a student' });
        }

        // Find the class
        const classDoc = await Class.findById(classId);
        
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check if student is already enrolled
        if (classDoc.students.includes(studentId)) {
            return res.status(400).json({ message: 'Student is already enrolled in this class' });
        }

        // Add student to class
        classDoc.students.push(studentId);
        await classDoc.save();

        res.json({
            message: 'Student added to class successfully',
            class: classDoc
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove student from a class
// @route   DELETE /api/admin/classes/:classId/students/:studentId
// @access  Admin Only
const removeStudentFromClass = async (req, res) => {
    const { classId, studentId } = req.params;

    try {
        // Find the class
        const classDoc = await Class.findById(classId);
        
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check if student is enrolled
        if (!classDoc.students.includes(studentId)) {
            return res.status(400).json({ message: 'Student is not enrolled in this class' });
        }

        // Remove student from class
        classDoc.students = classDoc.students.filter(
            id => id.toString() !== studentId
        );
        await classDoc.save();

        res.json({
            message: 'Student removed from class successfully',
            class: classDoc
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all teachers (for dropdown)
// @route   GET /api/admin/teachers
// @access  Admin Only
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all students (for dropdown)
// @route   GET /api/admin/students
// @access  Admin Only
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createClass,
    addStudentToClass,
    removeStudentFromClass,
    getAllTeachers,
    getAllStudents
};

