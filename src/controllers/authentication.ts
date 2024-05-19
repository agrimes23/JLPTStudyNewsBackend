import express from 'express'
require('dotenv').config();
import { UserModel, createUser, getUserByEmail } from '../models/users'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const maxAge = 3 * 24 * 60 * 60;  

const createAccessToken = (id: Types.ObjectId) => {
    console.log("hitting create token")
    
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10m'
    })
}

const createRefreshToken = (id: Types.ObjectId) => {

    return jwt.sign(
        { id }, 
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
    )
}

const handleErrors = (err: any) => {
    console.error(err.message, err.code)

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

export const refresh = (req: express.Request, res: express.Response) => {
    const cookies = req.cookies
    if (!cookies?.jwtToken) return res.status(401).json({  message: 'Unauthorized' })

    const refreshToken = cookies.jwtToken
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: `Forbidden: ${err}`})
            console.log("decoded id: " + JSON.stringify(decoded.id))
            const foundUser = await UserModel.findOne({ _id: decoded.id}).exec()
            console.log("found user: " + JSON.stringify(foundUser))
            if (!foundUser) return res.status(401).json({ message: "Unauthorized" })

            const accessToken = jwt.sign(
                { "id": foundUser._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m'}
            )

            res.json({ accessToken })
        }
    )
}


export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required"})
        }

        const user = await getUserByEmail(email)

        if (!user) {
            return res.status(401).json({ message: "Unauthorized"})
        }

        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.status(401).json({ message: "Unauthorized"})
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
            refreshToken: refreshToken
          });
        
    } catch (error) {
        const err = handleErrors(error)
        console.log(err)
        return res.status(400).json({ err })
    }
}


export const register = async (req: express.Request, res: express.Response) => {

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

        const token = createAccessToken(user._id)

        res.cookie("jwtToken", token, {
            httpOnly: true,
            secure: false,
            domain: 'localhost',
            sameSite: 'lax',
            path: "/",
            maxAge: maxAge * 1000,
          });

        res.status(201).json({user: user._id, refreshToken: token})

    } catch (error) {
        const err = handleErrors(error)
        console.log(err)
        return res.status(400).json({ err })
    }
}

// do I need to do more to this??
export const logout = (req: express.Request, res: express.Response) => {
    
    const cookies = req.cookies
    if(!cookies?.jwtToken) return res.sendStatus(204)
    res.clearCookie('jwtToken', { sameSite: 'none' })
    res.json({ message: 'Cookie Cleared'})
}