"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.getAllUsers = exports.getUserInfo = void 0;
const users_1 = require("../models/users");
const getUserInfo = async (req, res) => {
    try {
        const userId = req.body._id;
        const user = await (0, users_1.getUserById)(userId);
        return res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};
exports.getUserInfo = getUserInfo;
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, users_1.getUsers)();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await (0, users_1.deleteUserById)(id);
        return res.json(deletedUser);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName } = req.body;
        if (!firstName) {
            return res.sendStatus(400);
        }
        const user = await (0, users_1.getUserById)(id);
        user.firstName = firstName;
        await user.save();
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=users.js.map