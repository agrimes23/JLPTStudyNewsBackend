import express from 'express'

import { deleteUser, getAllUsers, updateUser, getUserInfo } from '../controllers/users'
import { verifyJWT } from '../middleware'
const router = express.Router()



export default (router: express.Router) => {
    router.get('/users', getAllUsers)
    router.get('/user', verifyJWT, getUserInfo)
    router.delete('/users/:id', verifyJWT, deleteUser)
    router.patch('/users/:id', verifyJWT, updateUser)
}