// routes/authRoutes.js
import express from 'express'
const router = express.Router()
import { register, login, getProfileData, updateProfile } from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';
import upload from '../middlewares/multer.js';

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getProfileData);
router.post("/update-profile", verifyToken, upload.single('avtar'), updateProfile);
//here un upload.single given name jis name se frontent se data daal ke bhej rahe ho

export default router;
