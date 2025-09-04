import express from 'express'
const router = express.Router()
import isAdmin from '../middlewares/isAdmin.js'
import verifyToken from '../middlewares/verifyToken.js'
import {adminDashboard, makeAnnouncement, bannedUser, getAnnouncement} from '../controllers/adminController.js'
import { login } from '../controllers/authController.js'

router.get('/dashboard', verifyToken, isAdmin, adminDashboard)
router.post('/login', login)
router.post('/announcement', verifyToken, isAdmin, makeAnnouncement)
router.get('/announcements', getAnnouncement)
router.post('/users/:id/suspend', verifyToken, isAdmin, bannedUser)

export default router