import express from 'express'

import { deleteUserById, getUserById, getUsers } from "../models/users"

export const getUserInfo = async (req: express.Request, res: express.Response) => {

    try {
        const userId = req.body._id;

        const user = await getUserById(userId);
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users = await getUsers();

        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params

        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser)

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params
        const { firstName } = req.body
        if (!firstName) {
            return res.sendStatus(400)
        }
        const user = await getUserById(id)

        user.firstName = firstName
        await user.save();
        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}