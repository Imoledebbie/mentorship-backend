"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Feedback_1 = __importDefault(require("../models/Feedback"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware")); // fixed import
const router = express_1.default.Router();
// ✅ POST: Submit feedback for a session (mentees only)
router.post('/', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { sessionId, rating, comments } = req.body;
        const menteeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // ✅ Fixed: use userId from token
        console.log('📝 Feedback Body:', req.body);
        console.log('👤 Mentee ID:', menteeId);
        if (!sessionId || !rating) {
            return res.status(400).json({ message: 'sessionId and rating are required' });
        }
        const feedback = new Feedback_1.default({ sessionId, menteeId, rating, comments });
        yield feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    }
    catch (error) {
        console.error('❌ Error in feedback POST:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}));
// ✅ GET: View feedback for a session
router.get('/:sessionId', auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        const feedbacks = yield Feedback_1.default.find({ sessionId }).populate('menteeId', 'name');
        res.json(feedbacks);
    }
    catch (error) {
        console.error('❌ Error in feedback GET:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
