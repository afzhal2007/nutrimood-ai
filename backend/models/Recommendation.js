const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    mood: String,
    foods: [
      {
        emoji: String,
        name: String,
        description: String
      }
    ],
    benefits: [String],
    tip: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
