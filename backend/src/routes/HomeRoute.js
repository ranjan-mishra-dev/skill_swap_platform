import express from 'express'
const router = express.Router();
import { homePageData, typedSearch, getProfileDataById } from '../controllers/homePageDataController.js';
import verifyToken from '../middlewares/verifyToken.js';

router.get("/", verifyToken, homePageData)
router.get("/search", verifyToken, typedSearch)
router.get("/get-user-by-id/:id", verifyToken, getProfileDataById)

export default router