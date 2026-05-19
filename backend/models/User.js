const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    age: String,
    gender: String,
    height: String,
    weight: String,
    foodPreference: String,
    healthGoal: String,
    activityLevel: String,
    commonMood: String,
    allergies: {
      type: String,
      default: "None"
    },
    profileCompleted: {
      type: Boolean,
      default: false
    },
    instructionsCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
