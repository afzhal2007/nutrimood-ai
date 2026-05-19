const express = require("express");
const Scan = require("../models/Scan");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const scan = await Scan.create(req.body);

    res.json({
      ok: true,
      scan
    });
  } catch (error) {
    console.error("Scan save error:", error);
    res.status(500).json({
      ok: false,
      error: "Scan save failed"
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.params.userId }).sort({
      createdAt: -1
    });

    res.json({
      ok: true,
      scans
    });
  } catch (error) {
    console.error("Scan fetch error:", error);
    res.status(500).json({
      ok: false,
      error: "Scan fetch failed"
    });
  }
});

module.exports = router;
