"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clogin = exports.Csignup = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const Csignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await Customer_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const customer = await Customer_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        if (customer) {
            res.status(201).json({
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                token: generateToken(customer._id.toString()),
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
exports.Csignup = Csignup;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const Clogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const customer = await Customer_1.default.findOne({ email });
        if (!customer) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Compare passwords
        const isMatch = await bcryptjs_1.default.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Successful login
        res.json({
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            token: generateToken(customer._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.Clogin = Clogin;
