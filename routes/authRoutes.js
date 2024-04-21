import express from 'express'
import { register, login, logout, refresh } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.delete('/logout', logout)
router.get('/refresh', refresh)

export default router