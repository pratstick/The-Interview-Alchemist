const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImageUrl: {
            type: String,
            default: null,
        },
        goals: {
            dailySessionGoal: { type: Number, default: 1, min: 1, max: 10 },
            weeklyQuestionGoal: { type: Number, default: 10, min: 1, max: 200 },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);