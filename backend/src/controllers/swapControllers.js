import Swap from "../models/SwapModel.js";
import mongoose from "mongoose";

// Inbox - received requests
const saveSwap = async (req, res) => {
  try {
    const { requesterId, receiverId, offeredSkill, requestedSkill, message } =
      req.body;

    // console.log(offeredSkill);
    // console.log(requestedSkill);
    // console.log(receiverId);
    // console.log(message);
    // console.log(rejectSwap);

    const newSwap = new Swap({
      requesterId,
      receiverId,
      offeredSkill,
      requestedSkill,
      message,
    });

    const swap = await newSwap.save()
    // console.log(swap)
    res.json({Success: true, message: "Swap saved successfully", swap})

  } catch (error) {
    res
      .status(500)
      .json({ Success: false, error: err.message, message: "Swap not saved" });
  }
};

const getInbox = async (req, res) => {
  try {
    const receiverId = req.userId;
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
    console.log("inbox us", receiverObjectId)
    const messages = await Swap.find({ receiverId: receiverObjectId })
      .populate("requesterId", "name avatarUrl rating") // name, profile pic, rating
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({Success: false, error: err.message });
  }
};

// Outbox - sent requests
const getOutbox = async (req, res) => {
  try {

    const receiverId = req.userId;
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
    console.log("outbox us", receiverObjectId)
    const swaps = await Swap.find({ requesterId: req.userId })
      .populate("receiverId", "name avatarUrl rating")
      .sort({ createdAt: -1 });
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Completed swaps
const getCompleted = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ requesterId: req.userId }, { receiverId: req.userId }],
      status: "completed",
    }).populate("requesterId receiverId", "name avatarUrl rating");
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept request
const acceptSwap = async (req, res) => {
  try {
    console.log("accept swap", req.params.id)
    const swap = await Swap.findOneAndUpdate(
      { _id: req.params.id, receiverId: req.userId },
      { status: "accepted", requesterCanDelete: false },
      { new: true }
    );
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    res.json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject request
const rejectSwap = async (req, res) => {
  try {
    const swap = await Swap.findOneAndUpdate(
      { _id: req.params.id, receiverId: req.user.id },
      { status: "rejected" },
      { new: true }
    );
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    res.json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Withdraw (only if pending & requester)
const withdrawSwap = async (req, res) => {
  try {
    const swap = await Swap.findOneAndDelete({
      _id: req.params.id,
      requesterId: req.userId,
      status: "pending",
    });
    if (!swap) return res.status(404).json({ message: "Cannot withdraw swap" });
    res.json({ message: "Swap withdrawn" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark as completed
const markCompleted = async (req, res) => {
  try {
    const swap = await Swap.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [{ requesterId: req.userId }, { receiverId: req.userId }],
        status: "accepted",
      },
      { status: "completed" },
      { new: true }
    );
    if (!swap)
      return res
        .status(404)
        .json({ message: "Swap not found or not accepted yet" });
    res.json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add feedback after completion
const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const swap = await Swap.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "completed",
        $or: [{ requesterId: req.user.id }, { receiverId: req.user.id }],
      },
      { feedback: { rating, comment } },
      { new: true }
    );
    if (!swap) return res.status(404).json({ message: "Cannot add feedback" });
    res.json(swap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addFeedback,
  markCompleted,
  withdrawSwap,
  rejectSwap,
  acceptSwap,
  getCompleted,
  getInbox,
  getOutbox,
  saveSwap,
};
