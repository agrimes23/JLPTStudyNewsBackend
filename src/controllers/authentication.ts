import express from 'express'

import { createUser, getUserByEmail } from '../db/users'
import { authentication, random } from '../helpers'

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try{
        const { firstName, lastName, email, password } = req.body

        if (!email || !password || ! firstName) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            return res.sendStatus(400)
        }

        const salt = random();
        const user = await createUser({
            firstName,
            lastName,
            email,
            authentication: {
                salt,
                password: authentication(salt, password),
            } 
        })

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}