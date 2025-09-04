import User from "../models/User.js";
import Announcement from "../models/Announcement.js";


const adminDashboard = async (req, res) => {
try {
    const { page = 1, search = "" } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({ users, total: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getAnnouncement = async (req, res) => {
   try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const makeAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    console.log(title)
    const announcement = new Announcement({
      title,
      message,
      createdBy: req.userId
    });

    await announcement.save();

    // Emit via socket
    req.io.emit("newAnnouncement", announcement);

    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const bannedUser = async (req, res) => {
    try {
    const userId = req.params.id;
    console.log(userId)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { banned: true, isPublic: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User suspended successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export { adminDashboard, makeAnnouncement, bannedUser, getAnnouncement }