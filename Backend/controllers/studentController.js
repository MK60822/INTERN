const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Mark attendance using session code
// @route   POST /api/student/mark-attendance
// @access  Student Only
const markAttendance = async (req, res) => {
    const { code } = req.body;

    try {
        // Find active session with this code
        const session = await Session.findOne({ code, isActive: true });

        if (!session) {
            return res.status(404).json({ message: 'Invalid or expired session code' });
        }

        // Verify student is enrolled in this class
        const classDoc = await Class.findById(session.classId);

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (!classDoc.students.includes(req.user._id)) {
            return res.status(403).json({ message: 'You are not enrolled in this class' });
        }

        // Check if attendance already marked today for this class
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            studentId: req.user._id,
            classId: session.classId,
            date: { $gte: today }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        // Create attendance record
        const attendance = await Attendance.create({
            studentId: req.user._id,
            classId: session.classId,
            status: 'Present'
        });

        res.status(201).json({
            message: 'Attendance marked successfully',
            className: classDoc.className,
            subject: classDoc.subject,
            date: attendance.date
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's attendance percentage across all classes
// @route   GET /api/student/my-percentage
// @access  Student Only
const getMyPercentage = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Find all classes the student is enrolled in
        const enrolledClasses = await Class.find({ students: studentId })
            .populate('teacher', 'name email department')
            .lean();

        if (!enrolledClasses || enrolledClasses.length === 0) {
            return res.status(200).json({
                message: 'Not enrolled in any classes',
                classes: []
            });
        }

        // Calculate stats for each class
        const classStats = await Promise.all(
            enrolledClasses.map(async (classDoc) => {
                // Get total number of sessions for this class
                const totalSessions = await Session.countDocuments({ classId: classDoc._id });

                // Count attendance records for this student in this class
                const attendedSessions = await Attendance.countDocuments({
                    studentId,
                    classId: classDoc._id
                });

                // Calculate percentage
                const percentage = totalSessions > 0
                    ? ((attendedSessions / totalSessions) * 100).toFixed(2)
                    : 0;

                return {
                    classId: classDoc._id,
                    className: classDoc.className,
                    subject: classDoc.subject,
                    teacher: classDoc.teacher,
                    totalSessions,
                    attendedSessions,
                    missedSessions: totalSessions - attendedSessions,
                    percentage: parseFloat(percentage),
                    status: parseFloat(percentage) >= 75 ? 'Good' : 'Low'
                };
            })
        );

        res.status(200).json({
            success: true,
            studentName: req.user.name,
            studentEmail: req.user.email,
            rollNumber: req.user.rollNumber,
            totalClasses: enrolledClasses.length,
            classes: classStats
        });

    } catch (error) {
        console.error('Error fetching student percentage:', error);
        res.status(500).json({ message: 'Server error while fetching statistics' });
    }
};

// @desc    Get student's enrolled classes
// @route   GET /api/student/classes
// @access  Student Only
const getEnrolledClasses = async (req, res) => {
    try {
        const studentId = req.user._id;

        const enrolledClasses = await Class.find({ students: studentId })
            .populate('teacher', 'name email department')
            .select('className subject teacher')
            .lean();

        res.status(200).json({
            success: true,
            count: enrolledClasses.length,
            classes: enrolledClasses
        });

    } catch (error) {
        console.error('Error fetching enrolled classes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    markAttendance,
    getMyPercentage,
    getEnrolledClasses
};

