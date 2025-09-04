import express from "express";
import {
  getInbox,
  getOutbox,
  getCompleted,
  acceptSwap,
  rejectSwap,
  withdrawSwap,
  markCompleted,
  addFeedback,
  saveSwap
} from "../controllers/swapControllers.js";
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router();

// Fetch swaps
router.post("/", verifyToken, saveSwap);
router.get("/inbox", verifyToken, getInbox);
router.get("/outbox", verifyToken, getOutbox);
router.get("/completed", verifyToken, getCompleted);

// Actions
router.patch("/:id/accept", verifyToken, acceptSwap);
router.patch("/:id/reject", verifyToken, rejectSwap);
router.delete("/:id/withdraw", verifyToken, withdrawSwap);
router.patch("/:id/completed", verifyToken, markCompleted);
router.put("/:id/feedback", verifyToken, addFeedback);

export default router;