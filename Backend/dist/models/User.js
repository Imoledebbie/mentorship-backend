"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'mentor', 'mentee'], required: true },
    bio: String,
    skills: [String],
    goals: String,
    // Mentor-specific fields
    expertise: [String],
    availability: String,
    experience: String,
    // Mentee-specific fields
    interests: [String],
    learningStyle: String,
}, {
    timestamps: true
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
