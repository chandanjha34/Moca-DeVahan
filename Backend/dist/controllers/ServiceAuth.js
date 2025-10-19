"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slogin = exports.Ssignup = void 0;
const Service_1 = __importDefault(require("../models/Service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const Ssignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await Service_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const Service = await Service_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        if (Service) {
            res.status(201).json({
                _id: Service._id,
                name: Service.name,
                email: Service.email,
                token: generateToken(Service._id.toString()),
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.Ssignup = Ssignup;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const Slogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const Service = await Service_1.default.findOne({ email });
        if (!Service) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Compare passwords
        const isMatch = await bcryptjs_1.default.compare(password, Service.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Successful login
        res.json({
            _id: Service._id,
            name: Service.name,
            email: Service.email,
            token: generateToken(Service._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.Slogin = Slogin;
