import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, unique: true, required: true },

    current_password: { type: String, required: true }, // never store raw password

    location: { type: String }, // optional

    avatarUrl: { type: String, default: "https://i.pravatar.cc/40"}, // optional

    skillsOffered: [{ type: String }], // e.g. ["Photoshop", "Excel"]

    skillsWanted: [{ type: String }],

    availability: {
      weekends: { type: Boolean, default: false },
      weekdaysEvenings: { type: Boolean, default: false },
      weekdaysDaytime: { type: Boolean, default: false },
    },

    isPublic: { type: Boolean, default: true },

    bio: { type: String },

    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    }, // denormalized

    role: { type: String, enum: ["user", "admin"], default: "user" },

    banned: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

// 🔹 Indexes
userSchema.index({ skillsOffered: 1 });
userSchema.index({ skillsWanted: 1 });

// 🔹 Full-text search index
userSchema.index({
  name: "text",
  skillsOffered: "text",
  skillsWanted: "text",
  location: "text",
});

export default mongoose.model("User", userSchema);