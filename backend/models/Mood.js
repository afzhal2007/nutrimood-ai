const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    mood: {
      type: String,
      required: true
    },
    icon: String,
    confidence: Number,
    faceScore: Number,
    voiceScore: Number,
    selfScore: Number,
    method: {
      type: String,
      default: "self-check"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Mood", moodSchema);
