const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "nutrimood_secret", {
    expiresIn: "7d"
  });
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        error: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        ok: false,
        error: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileCompleted: false,
      instructionsCompleted: false
    });

    const token = createToken(user._id);

    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
        instructionsCompleted: user.instructionsCompleted
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      ok: false,
      error: "Signup failed"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        error: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        ok: false,
        error: "Invalid email or password"
      });
    }

    const token = createToken(user._id);

    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        foodPreference: user.foodPreference,
        healthGoal: user.healthGoal,
        activityLevel: user.activityLevel,
        commonMood: user.commonMood,
        allergies: user.allergies,
        profileCompleted: user.profileCompleted,
        instructionsCompleted: user.instructionsCompleted
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      ok: false,
      error: "Login failed"
    });
  }
});

router.put("/profile/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        profileCompleted: true
      },
      {
        new: true
      }
    ).select("-password");

    res.json({
      ok: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      ok: false,
      error: "Profile update failed"
    });
  }
});

router.put("/instructions/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        instructionsCompleted: true
      },
      {
        new: true
      }
    ).select("-password");

    res.json({
      ok: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Instructions update error:", error);
    res.status(500).json({
      ok: false,
      error: "Instructions update failed"
    });
  }
});

module.exports = router;
