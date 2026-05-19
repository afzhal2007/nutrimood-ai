const express = require("express");
const Mood = require("../models/Mood");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const mood = await Mood.create(req.body);

    res.json({
      ok: true,
      mood
    });
  } catch (error) {
    console.error("Mood save error:", error);
    res.status(500).json({
      ok: false,
      error: "Mood save failed"
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId }).sort({
      createdAt: -1
    });

    res.json({
      ok: true,
      moods
    });
  } catch (error) {
    console.error("Mood fetch error:", error);
    res.status(500).json({
      ok: false,
      error: "Mood fetch failed"
    });
  }
});

module.exports = router;
