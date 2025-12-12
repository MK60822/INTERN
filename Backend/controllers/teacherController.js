const Session = require('../models/Session');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Helper function to generate random 6-digit code
const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Generate a unique 6-digit code for a class session
// @route   POST /api/teacher/generate-code
// @access  Teacher Only
const generateSessionCode = async (req, res) => {
    const { classId } = req.body;

    try {
        // Verify the class exists
        const classDoc = await Class.findById(classId);
        
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Verify the teacher owns this class
        if (classDoc.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to create sessions for this class' });
        }

        // Deactivate any existing active sessions for this class
        await Session.updateMany(
            { classId, isActive: true },
            { isActive: false }
        );

        // Generate unique code
        let code = generateCode();
        let codeExists = await Session.findOne({ code, isActive: true });
        
        // Ensure code is unique
        while (codeExists) {
            code = generateCode();
            codeExists = await Session.findOne({ code, isActive: true });
        }

        // Create new session
        const session = await Session.create({
            classId,
            teacherId: req.user._id,
            code,
            isActive: true
        });

        res.status(201).json({
            message: 'Session code generated successfully',
            code: session.code,
            sessionId: session._id,
            className: classDoc.className,
            subject: classDoc.subject
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get class attendance report with student percentages
// @route   GET /api/teacher/class-report/:classId
// @access  Teacher Only
const getClassReport = async (req, res) => {
    const { classId } = req.params;

    try {
        // Verify the class exists
        const classDoc = await Class.findById(classId).populate('students', '-password');
        
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Verify the teacher owns this class
        if (classDoc.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view this class report' });
        }

        // Get total number of sessions for this class
        const totalSessions = await Session.countDocuments({ classId });

        // Calculate attendance percentage for each student
        const studentsWithPercentage = await Promise.all(
            classDoc.students.map(async (student) => {
                // Count attendance records for this student in this class
                const attendedSessions = await Attendance.countDocuments({
                    studentId: student._id,
                    classId
                });

                // Calculate percentage
                const percentage = totalSessions > 0 
                    ? ((attendedSessions / totalSessions) * 100).toFixed(2)
                    : 0;

                return {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    rollNumber: student.rollNumber,
                    attendedSessions,
                    totalSessions,
                    percentage: parseFloat(percentage)
                };
            })
        );

        res.json({
            className: classDoc.className,
            subject: classDoc.subject,
            totalSessions,
            students: studentsWithPercentage
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get teacher's classes
// @route   GET /api/teacher/my-classes
// @access  Teacher Only
const getMyClasses = async (req, res) => {
    try {
        const classes = await Class.find({ teacher: req.user._id })
            .populate('students', 'name email rollNumber');
        
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateSessionCode,
    getClassReport,
    getMyClasses
};

