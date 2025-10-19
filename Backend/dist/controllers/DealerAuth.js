"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dlogin = exports.Dsignup = void 0;
const Dealer_1 = __importDefault(require("../models/Dealer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Helper to generate JWT
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const Dsignup = async (req, res) => {
    const { name, email, Dealer_ID, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await Dealer_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Dealer already exists" });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const dealer = await Dealer_1.default.create({
            name,
            email,
            Dealer_ID,
            password: hashedPassword,
        });
        if (dealer) {
            res.status(201).json({
                _id: dealer._id,
                name: dealer.name,
                email: dealer.email,
                dealerID: dealer.Dealer_ID,
                token: generateToken(dealer._id.toString()),
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
exports.Dsignup = Dsignup;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const Dlogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const user = await Dealer_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Compare passwords
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Successful login
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            dealerID: user.Dealer_ID,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.Dlogin = Dlogin;
