"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const mentor_routes_1 = __importDefault(require("./routes/mentor.routes"));
const mentee_routes_1 = __importDefault(require("./routes/mentee.routes"));
const session_routes_1 = __importDefault(require("./routes/session.routes")); // ✅ Session routes
const feedback_routes_1 = __importDefault(require("./routes/feedback.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ✅ Connect to MongoDB
(0, db_1.default)();
// ✅ Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true // Needed if using cookies (optional here)
}));
app.use(express_1.default.json()); // To parse JSON request bodies
// ✅ Route registration
app.use('/api/auth', auth_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/mentors', mentor_routes_1.default);
app.use('/api/mentees', mentee_routes_1.default);
app.use('/api/sessions', session_routes_1.default); // ✅ Session routes
app.use('/api/feedback', feedback_routes_1.default);
// ✅ Test route (optional)
app.get('/', (req, res) => {
    res.send('Mentorship API is working!');
});
// ✅ Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
