import express from 'express'

import { deleteUser, getAllUsers, updateUser, getUserInfo } from '../controllers/users'
import { isOwner } from '../middleware'

import { requireAuth } from '../middleware'

export default (router: express.Router) => {
    router.get('/users', requireAuth, getAllUsers)
    router.get('/users/:id', requireAuth, getUserInfo)
    router.delete('/users/:id', requireAuth, isOwner, deleteUser)
    router.patch('/users/:id', requireAuth, isOwner, updateUser)
}