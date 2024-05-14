import express, { NextFunction } from 'express'
import { get, merge } from 'lodash'
import bcrypt from 'bcrypt'
import jwt, { decode } from 'jsonwebtoken'
require('dotenv').config();
import { getUserById } from '../models/users'

// TODO: need to work on this interface for requireAuth
interface DecodedToken {
    // Define the structure of decoded token properties here
    // For example:
    userId: string;
    username: string;
    // Add more properties as needed
}


export const hashPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("hitting thsi middleware")
    try {
      const salt = await bcrypt.genSalt();
      req.body.password = await bcrypt.hash(req.body.password, salt);
      console.log("does this work?")
      next();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


export const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.jwt;

    // check json web token exists and is verified
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: jwt.VerifyErrors | null, decodedToken: any | undefined) => {
            if (err) {
                console.log('redirecting to login')
            } else {
                console.log("decoded token: " + JSON.stringify(decodedToken))
                next();
            }
    })
        
    } else {
        console.log('redirecting to login')
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        const token = req.cookies.jwt;

        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: jwt.VerifyErrors | null, decodedToken: any | undefined) => {
                if (err) {
                    console.log(err.message)
                    res.locals.user = null
                    next();
                } else {
                    console.log("decoded token: " + JSON.stringify(decodedToken))
                    let user = getUserById(decodedToken.id)
                    // TODO: Does this work?? Please check
                    res.locals.user = user
                    next();
                }
            })

        } else {
            res.locals.user = null
            next();
        }

    } catch (error){ 
        console.log(error)
        return res.sendStatus(400)
    }
}

// FIXME: need to update this isAuthenticate route

// export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     try {
//         const sessionToken = req.cookies["JLPT-STUDY-NEWS"]
        
//         if(!sessionToken){
//             return res.sendStatus(403)
//         }

//         const existingUser = await getUserBySessionToken(sessionToken)

//         if(!existingUser){
//             return res.sendStatus(403)
//         }

//         merge(req, { identity: existingUser })

//         return next();
//     } catch (error) {
//         console.log(error)
//         return res.sendStatus(400)
//     }
// }