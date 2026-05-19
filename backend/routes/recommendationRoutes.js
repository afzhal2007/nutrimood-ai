const express = require("express");
const Recommendation = require("../models/Recommendation");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const recommendation = await Recommendation.create(req.body);

    res.json({
      ok: true,
      recommendation
    });
  } catch (error) {
    console.error("Recommendation save error:", error);
    res.status(500).json({
      ok: false,
      error: "Recommendation save failed"
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      userId: req.params.userId
    }).sort({
      createdAt: -1
    });

    res.json({
      ok: true,
      recommendations
    });
  } catch (error) {
    console.error("Recommendation fetch error:", error);
    res.status(500).json({
      ok: false,
      error: "Recommendation fetch failed"
    });
  }
});

module.exports = router;
