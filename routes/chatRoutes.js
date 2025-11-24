const express = require("express");
const router = express.Router();
const { searchAllContent } = require("./services/bloggerService");

router.post("/chat", async (req, res) => {
  const msg = req.body.message;

  try {
    const reply = await searchAllContent(msg);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error while searching your blog." });
  }
});

module.exports = router;
