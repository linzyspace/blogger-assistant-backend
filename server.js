const express = require("express");
const cors = require("cors");
const chatbot = require("./data/defaultResponses"); // your existing logic
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(cors());

// Utility to extract first image URL from HTML
function extractFirstImage(htmlContent) {
  if (!htmlContent) return null;
  const $ = cheerio.load(htmlContent);
  const img = $("img").first();
  return img.attr("src") || null;
}

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.json({ text: "Please enter a valid message." });
  }

  try {
    // Get reply from your chatbot logic
    const replyHTML = await chatbot.getReply(message);

    // Extract first image from reply HTML
    const firstImage = extractFirstImage(replyHTML);

    // Optionally extract text snippet (remove HTML tags)
    const $ = cheerio.load(replyHTML);
    const textSnippet = $.text().trim();

    // Return structured response
    res.json({
      text: textSnippet || "Here’s the response for your query.",
      image: firstImage,         // this will display in frontend chat
      link: null,                // you can add a real post link if available
      linkText: null
    });
  } catch (err) {
    console.error("Error processing chat:", err);
    res.json({ text: "Server error. Please try again later." });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Blogger Assistant Backend is running!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
