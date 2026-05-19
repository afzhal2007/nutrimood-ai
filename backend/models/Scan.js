const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    foodName: String,
    calories: String,
    protein: String,
    carbs: String,
    fat: String,
    imageName: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Scan", scanSchema);
