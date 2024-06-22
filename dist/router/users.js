"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
exports.default = (router) => {
    router.get('/users', users_1.getAllUsers);
    router.get('/user', middleware_1.verifyJWT, users_1.getUserInfo);
    router.delete('/users/:id', middleware_1.verifyJWT, users_1.deleteUser);
    router.patch('/users/:id', middleware_1.verifyJWT, users_1.updateUser);
};
//# sourceMappingURL=users.js.map