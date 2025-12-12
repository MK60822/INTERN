const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema(
    {
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600 // Auto-delete after 1 hour (3600 seconds)
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
sessionSchema.index({ code: 1, isActive: 1 });
sessionSchema.index({ classId: 1, isActive: 1 });

module.exports = mongoose.model('Session', sessionSchema);

