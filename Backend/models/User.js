const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'], // Strict Role Control
        default: 'student'
    },
    // For students only - REQUIRED if role is 'student'
    rollNumber: {
        type: String,
        required: function() {
            return this.role === 'student';
        }
    },
    // For teachers only (optional: department)
    department: { type: String, default: null }
}, {
    timestamps: true
});

// Middleware: Encrypt password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method: Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);