const express = require("express");
const cors = require("cors");
const chatbot = require("./data/defaultResponses"); // adjust path if needed
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(cors());

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.json({ reply: "Please enter a valid message." });
  }

  try {
    const replyText = await chatbot.getReply(message);
    return res.json({ reply: replyText });
  } catch (err) {
    console.error("Error processing chat:", err);
    return res.json({ reply: "Server error. Please try again later." });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Blogger Assistant Backend is running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
