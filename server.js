import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();

app.use(cors());
app.use(express.json());

// ------------------------------------------------------
// ⭐ BLOGGER SCRAPER FUNCTION
// ------------------------------------------------------
async function scrapeBlogger(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);

    // Blogger usually stores content in these selectors:
    const content =
      $(".post-body").html() ||
      $(".entry-content").html() ||
      $(".post").html();

    return content || null;
  } catch (err) {
    return null;
  }
}

// ------------------------------------------------------
// ⭐ ENDPOINT 1 — DIRECT SCRAPE (Front-End Can Call It)
// ------------------------------------------------------
app.get("/blog", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "Missing ?url parameter" });
  }

  const content = await scrapeBlogger(url);

  if (!content) {
    return res.json({ error: "Unable to extract Blogger article content." });
  }

  res.json({ content });
});

// ------------------------------------------------------
// ⭐ ENDPOINT 2 — CHATBOT HANDLES BLOGGER LINKS AUTOMATICALLY
// ------------------------------------------------------
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Detect any Blogger URL in the message
    const blogUrlMatch = message.match(/https?:\/\/[^\s]+\.blogspot\.com[^\s]*/i);

    if (blogUrlMatch) {
      const blogUrl = blogUrlMatch[0];

      const content = await scrapeBlogger(blogUrl);

      if (!content) {
        return res.json({
          reply: "❌ I couldn't extract the content from that Blogger link."
        });
      }

      return res.json({
        reply: content
      });
    }

    // Normal chatbot fallback
    res.json({
      reply: "Chat response here"
    });

  } catch (error) {
    res.json({
      reply: "Server error: " + error.message
    });
  }
});

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
