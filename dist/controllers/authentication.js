"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.register = exports.login = exports.refresh = void 0;
require('dotenv').config();
const users_1 = require("../models/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const maxAge = 3 * 24 * 60 * 60;
const createAccessToken = (id) => {
    console.log("hitting create token");
    return jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10m'
    });
};
const createRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};
const handleErrors = (err) => {
    console.error(err.message, err.code);
    let errors = { email: '', password: '' };
    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That emal is not registered';
    }
    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }
    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
    }
    if (err.message.includes('user validations failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            if (properties && properties.path) {
                const key = properties.path;
                errors[key] = properties.message;
            }
        });
    }
    return errors;
};
const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwtToken)
        return res.status(401).json({ message: 'Unauthorized' });
    const refreshToken = cookies.jwtToken;
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err)
            return res.status(403).json({ message: `Forbidden: ${err}` });
        console.log("decoded id: " + JSON.stringify(decoded.id));
        const foundUser = await users_1.UserModel.findOne({ _id: decoded.id }).exec();
        console.log("found user: " + JSON.stringify(foundUser));
        if (!foundUser)
            return res.status(401).json({ message: "Unauthorized" });
        const accessToken = jsonwebtoken_1.default.sign({ "id": foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
        res.json({ accessToken });
    });
};
exports.refresh = refresh;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await (0, users_1.getUserByEmail)(email);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const auth = await bcrypt_1.default.compare(password, user.password);
        if (!auth) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        res.cookie("jwtToken", refreshToken, {
            httpOnly: true,
            domain: 'localhost',
            secure: false,
            sameSite: 'lax',
            path: "/",
            maxAge: maxAge * 1000,
        });
        res.json({
            message: "User logged in successfully",
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                decks: user.decks
            },
            accessToken: accessToken,
        });
    }
    catch (error) {
        const err = handleErrors(error);
        console.log(err);
        return res.status(400).json({ err });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!email || !password || !firstName) {
            return res.sendStatus(400);
        }
        const existingUser = await (0, users_1.getUserByEmail)(email);
        if (existingUser) {
            return res.sendStatus(400);
        }
        const user = await (0, users_1.createUser)({
            firstName,
            lastName,
            email,
            password
        });
        const token = createAccessToken(user._id);
        res.cookie("jwtToken", token, {
            httpOnly: true,
            secure: false,
            domain: 'localhost',
            sameSite: 'lax',
            path: "/",
            maxAge: maxAge * 1000,
        });
        res.status(201).json({ user: user._id });
    }
    catch (error) {
        const err = handleErrors(error);
        console.log(err);
        return res.status(400).json({ err });
    }
};
exports.register = register;
// do I need to do more to this??
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwtToken) {
        // No cookie found, nothing to clear
        return res.sendStatus(204); // 204 No Content
    }
    // Clear the cookie
    res.clearCookie('jwtToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Cookie Cleared' });
};
exports.logout = logout;
//# sourceMappingURL=authentication.js.map