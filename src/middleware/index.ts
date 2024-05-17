import express, { NextFunction } from 'express'
import { get, merge } from 'lodash'
import bcrypt from 'bcrypt'
import jwt, { decode } from 'jsonwebtoken'
require('dotenv').config();
import { getUserById } from '../models/users'

// TODO: need to work on this interface for requireAuth
interface DecodedToken {
    id: string;
}

interface CustomRequest extends Request {
    _id?: string;
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


export const verifyJWT = (req: express.Request, res: express.Response, next: NextFunction) => {

    const authHeader = req.headers.authorization || req.headers.Authorization
    
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded: DecodedToken) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.body._id = decoded.id
            next()
        }
    )
}
