const express = require("express");
const Chat = require("../models/Chat");

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const chat = await Chat.create(req.body);

    res.json({
      ok: true,
      chat
    });
  } catch (error) {
    console.error("Chat save error:", error);
    res.status(500).json({
      ok: false,
      error: "Chat save failed"
    });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId }).sort({
      createdAt: -1
    });

    res.json({
      ok: true,
      chats
    });
  } catch (error) {
    console.error("Chat fetch error:", error);
    res.status(500).json({
      ok: false,
      error: "Chat fetch failed"
    });
  }
});

module.exports = router;
