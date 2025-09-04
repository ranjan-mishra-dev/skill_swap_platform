import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    swapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swap",   // reference to the Swap collection
      required: true,
    },
    raterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // the one who gives rating
      required: true,
    },
    rateeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // the one who receives rating
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // only track createdAt
);

// Index for fast queries like "Get all feedback for a user sorted by time"
feedbackSchema.index({ rateeId: 1, createdAt: -1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
