// backend.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your Blogger blog feed URL
const BLOG_FEED_URL = "https://YOUR_BLOG.blogspot.com/feeds/posts/default?alt=json";

// Fetch posts from Blogger
async function fetchBloggerPosts() {
  try {
    const res = await axios.get(BLOG_FEED_URL);
    const posts = res.data.feed.entry || [];
    return posts.map(post => {
      // Extract content snippet
      const content = post.content?.$t || "";
      const $ = cheerio.load(content);
      const snippet = $.text().trim().substring(0, 200); // short preview

      return {
        title: post.title.$t,
        link: post.link.find(l => l.rel === "alternate")?.href || "",
        snippet
      };
    });
  } catch (err) {
    console.error("Error fetching Blogger posts:", err);
    return [];
  }
}

// Remove "🖼️ Images found" and direct image URLs
function cleanReplyText(text) {
  if (!text) return "";

  // Remove lines starting with "🖼️ Images found"
  let cleaned = text
    .split("\n")
    .filter(line => !line.trim().startsWith("🖼️ Images found"))
    .join("\n");

  // Remove any direct image URLs
  cleaned = cleaned.replace(/https?:\/\/\S+\.(png|jpe?g|gif)/gi, "").trim();

  return cleaned;
}

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.json({ text: "Please enter a valid message.", link: null, linkText: null });
  }

  try {
    const posts = await fetchBloggerPosts();

    // Find first matching post by title
    const match = posts.find(p =>
      p.title.toLowerCase().includes(message.toLowerCase())
    );

    if (match) {
      const cleanedSnippet = cleanReplyText(match.snippet || match.title);
      res.json({
        text: cleanedSnippet,
        link: match.link,
        linkText: "Read more"
      });
    } else {
      res.json({
        text: "Sorry, no matching blog post was found. Try different keywords!",
        link: null,
        linkText: null
      });
    }
  } catch (err) {
    console.error(err);
    res.json({
      text: "Server error. Please try again later.",
      link: null,
      linkText: null
    });
  }
});

// Health check
app.get("/", (req, res) => res.send("Blogger Assistant Backend is running!"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
