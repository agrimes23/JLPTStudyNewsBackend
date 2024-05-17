import express from 'express'

import { deleteUser, getAllUsers, updateUser, getUserInfo } from '../controllers/users'
import { verifyJWT } from '../middleware'
const router = express.Router()
router.use(verifyJWT)


export default (router: express.Router) => {
    router.get('/users', getAllUsers)
    router.get('/users/:id', getUserInfo)
    router.delete('/users/:id', deleteUser)
    router.patch('/users/:id', updateUser)
}