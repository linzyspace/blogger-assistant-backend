import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();

app.use(cors());
app.use(express.json());

// -------------------------
// EXISTING CHAT ENDPOINT
// -------------------------
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  
  // Your existing chat logic…
  res.json({ reply: "Chat response here" });
});

// -------------------------
// ⭐ ADD THIS: Blogger Content Scraper
// -------------------------
app.get("/blog", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ error: "Missing ?url parameter" });

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);

    // Blogger posts normally store content in .post-body or .entry-content
    const content =
      $(".post-body").html() ||
      $(".entry-content").html() ||
      $(".post").html();

    if (!content) {
      return res.json({ error: "Unable to extract Blogger article content." });
    }

    res.json({ content });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
