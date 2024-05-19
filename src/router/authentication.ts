import express from 'express'
import { hashPassword } from '../middleware/index'

import { login, refresh, register, logout } from '../controllers/authentication'
import { verifyJWT } from '../middleware/index'

export default (router: express.Router) => {
    router.post('/auth/register', hashPassword, register)
    router.get('/auth/refresh', refresh)
    router.post('/auth/login', login)
    router.post('/auth/logout', logout)
}