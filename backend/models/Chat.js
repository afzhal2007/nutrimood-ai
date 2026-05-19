const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    userMessage: {
      type: String,
      required: true
    },
    aiResponse: {
      type: String,
      required: true
    },
    mood: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Chat", chatSchema);
