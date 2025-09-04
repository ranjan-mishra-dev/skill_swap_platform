import express from "express"
import {addingFeedback} from '../controllers/rateController.js'
import verifyToken from "../middlewares/verifyToken.js"
const router = express.Router()

router.post("/:id/feedback", verifyToken, addingFeedback)

export default router