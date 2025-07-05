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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        const existingAdmin = yield User_1.default.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('❌ Admin already exists.');
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash('AdminPass123', 10);
        const admin = yield User_1.default.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });
        console.log('✅ Admin created successfully:', admin);
        process.exit();
    }
    catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
});
createAdmin();
