const Session = require('../models/Session');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Helper function to generate random 6-character alphanumeric code
const generateSessionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// @desc    Create a new session (Teacher Only)
// @route   POST /api/sessions
// @access  Teacher only
const createSession = async (req, res) => {
    const { classId } = req.body;

    try {
        // Validate that the class exists
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Verify that the teacher owns this class
        if (classDoc.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to start a session for this class' });
        }

        // Deactivate any existing active sessions for this class
        await Session.updateMany(
            { classId, isActive: true },
            { isActive: false }
        );

        // Generate a unique code
        let code = generateSessionCode();
        let existingSession = await Session.findOne({ code, isActive: true });
        
        // Ensure code is unique (regenerate if collision)
        while (existingSession) {
            code = generateSessionCode();
            existingSession = await Session.findOne({ code, isActive: true });
        }

        // Create new session
        const session = await Session.create({
            classId,
            teacherId: req.user._id,
            code,
            isActive: true
        });

        res.status(201).json({
            success: true,
            code: session.code,
            classId: session.classId,
            className: classDoc.className,
            subject: classDoc.subject,
            sessionId: session._id
        });

    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Server error while creating session' });
    }
};

// @desc    Mark attendance using session code (Student Only)
// @route   POST /api/sessions/mark-attendance
// @access  Student only
const markAttendance = async (req, res) => {
    const { code } = req.body;

    try {
        // Find active session with this code
        const session = await Session.findOne({ code: code.toUpperCase(), isActive: true })
            .populate('classId');

        if (!session) {
            return res.status(404).json({ message: 'Invalid or expired session code' });
        }

        // Check if student is enrolled in this class
        const classDoc = await Class.findById(session.classId);
        const isEnrolled = classDoc.students.some(
            studentId => studentId.toString() === req.user._id.toString()
        );

        if (!isEnrolled) {
            return res.status(403).json({ message: 'You are not enrolled in this class' });
        }

        // Check for duplicate attendance (same student, same class, same day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingAttendance = await Attendance.findOne({
            classId: session.classId,
            attendees: req.user._id,
            date: { $gte: today, $lt: tomorrow }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        // Find or create attendance record for this session
        let attendanceRecord = await Attendance.findOne({
            classId: session.classId,
            sessionCode: session.code,
            date: { $gte: today, $lt: tomorrow }
        });

        if (attendanceRecord) {
            // Add student to existing record
            attendanceRecord.attendees.push(req.user._id);
            await attendanceRecord.save();
        } else {
            // Create new attendance record
            attendanceRecord = await Attendance.create({
                classId: session.classId,
                teacherId: session.teacherId,
                sessionCode: session.code,
                date: new Date(),
                attendees: [req.user._id]
            });
        }

        res.status(200).json({
            success: true,
            message: 'Attendance marked successfully',
            className: classDoc.className,
            subject: classDoc.subject,
            date: attendanceRecord.date
        });

    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Server error while marking attendance' });
    }
};

// @desc    Get active session for a class (Teacher Only)
// @route   GET /api/sessions/class/:classId
// @access  Teacher only
const getActiveSession = async (req, res) => {
    try {
        const session = await Session.findOne({
            classId: req.params.classId,
            isActive: true
        }).populate('classId');

        if (!session) {
            return res.status(404).json({ message: 'No active session found' });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createSession,
    markAttendance,
    getActiveSession
};

