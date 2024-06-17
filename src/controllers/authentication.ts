import express from 'express'
require('dotenv').config();
import { createUser, getUserByEmail } from '../models/users'
import { authentication, random } from '../helpers'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const maxAge = 3 * 24 * 60 * 60;  

const createToken = (id: Types.ObjectId) => {
    console.log("hitting create token")
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
}

const handleErrors = (err: any) => {
    console.log(err.message, err.code)

    let errors = { email: '', password: '' }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That emal is not registered'
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect'
    }

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered'
    }

    if (err.message.includes('user validations failed')) {
        Object.values(err.errors).forEach(({ properties }: any) => {
            if (properties && properties.path) {
                const key = properties.path as keyof typeof errors;
                errors[key] = properties.message;
            }
        })
    }

    return errors;


}

export const login = async (req: express.Request, res: express.Response) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.sendStatus(400)
        }

        const user = await getUserByEmail(email)
        console.log("user: " + JSON.stringify(user))
        if (!user) {
            return res.sendStatus(400)
        }

        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            throw Error('incorrect password')
        }
        const token = createToken(user._id)
        res.cookie('jwtToken', token, { httpOnly: true, maxAge: maxAge + 1000 })
        res.status(200).json({ user: user._id})
        
        
    } catch (error) {
        const err = handleErrors(error)
        console.log(err)
        return res.status(400).json({ err })
    }
}


export const register = async (req: express.Request, res: express.Response) => {

    console.log("Oh hi there")
    try{
        const { firstName, lastName, email, password } = req.body

        if (!email || !password || !firstName) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            return res.sendStatus(400)
        }

        const user = await createUser({
            firstName,
            lastName,
            email,
            password
        })

        const token = createToken(user._id)
        res.cookie('jwtToken', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({user: user._id})

    } catch (error) {
        const err = handleErrors(error)
        console.log(err)
        return res.status(400).json({ err })
    }
}

// do I need to do more to this??
export const logout = (req: express.Request, res: express.Response) => {
    res.cookie('jwt', '', { maxAge: 1 })
}