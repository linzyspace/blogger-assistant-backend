const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Environment variables
// .env file should contain:
// BLOG_ID=YOUR_BLOGGER_BLOG_ID
// BLOG_API_KEY=YOUR_BLOGGER_API_KEY
const BLOG_ID = process.env.BLOG_ID;
const BLOG_API_KEY = process.env.BLOG_API_KEY;

// Strip HTML from post content
function stripHTML(html) {
  return html.replace(/<[^>]*>?/gm, "");
}

// Fetch all posts
async function fetchBlogPosts() {
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${BLOG_API_KEY}`);
  const data = await res.json();
  return data.items || [];
}

// Find relevant post by keyword
function findRelevantPost(posts, query) {
  const q = query.toLowerCase();
  for (let post of posts) {
    const content = stripHTML(post.content).toLowerCase();
    if (content.includes(q)) {
      return stripHTML(post.content);
    }
  }
  return null;
}

// API endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const posts = await fetchBlogPosts();
    const reply = findRelevantPost(posts, message) || "Sorry, I couldn't find relevant content.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error fetching blog content." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
