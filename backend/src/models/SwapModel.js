import mongoose from "mongoose";

const swapSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offeredSkill: { type: String, required: true },
  requestedSkill: { type: String, required: true },
  message: { type: String },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
    default: "pending",
  },
  requesterCanDelete: { type: Boolean, default: true },
  feedbackGiven: { type: Boolean, default: false }, // ✅ new field
  scheduledAt: { type: Date },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
  },
}, { timestamps: true });

// Indexes
swapSchema.index({ receiverId: 1, status: 1, createdAt: -1 });
swapSchema.index({ requesterId: 1, status: 1, createdAt: -1 });

export default mongoose.model("Swap", swapSchema);
