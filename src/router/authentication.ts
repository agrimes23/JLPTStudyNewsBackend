import express from 'express'
import { hashPassword } from '../middleware/index'

import { login, register } from '../controllers/authentication'

export default (router: express.Router) => {
    router.post('/auth/register', hashPassword, register)
    router.post('/auth/login', login)
    router.post('/auth/logout')
}