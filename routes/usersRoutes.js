import express from 'express'
import { getUsers, deleteUser } from '../controllers/usersController.js'

const router = express.Router()

router.route('/')
    .get(getUsers)
    .delete(deleteUser)
    
export default router