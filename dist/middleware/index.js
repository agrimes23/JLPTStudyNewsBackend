"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
const hashPassword = async (req, res, next) => {
    try {
        const salt = await bcrypt_1.default.genSalt();
        req.body.password = await bcrypt_1.default.hash(req.body.password, salt);
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.hashPassword = hashPassword;
const verifyJWT = (req, res, next) => {
    console.log("checking...");
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Forbidden' });
        req.body._id = decoded.id;
        next();
    });
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=index.js.map