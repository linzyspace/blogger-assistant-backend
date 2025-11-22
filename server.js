import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const BLOG_ID = "6604544777764868713";
const API_KEY = "AIzaSyCaUZEDFK50huQDi-WLKjUwOHEp0h";

let blogPosts = [];

// Fetch all blogger posts on startup
async function loadBlogPosts() {
  try {
    console.log("Fetching Blogger posts...");

    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`;
    const res = await axios.get(url);

    blogPosts = res.data.items || [];

    console.log(`Loaded ${blogPosts.length} blog posts.`);
  } catch (error) {
    console.error("Error loading blog posts:", error.message);
  }
}

loadBlogPosts();

app.get("/", (req, res) => {
  res.send("Blogger Assistant is running.");
});

// Main chat route
app.post("/chat", (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  if (!userMessage) {
    return res.json({ reply: "Please enter a message." });
  }

  // Search posts
  let matches = [];
  blogPosts.forEach(post => {
    const content = (post.content || "").toLowerCase();
    const title = (post.title || "").toLowerCase();

    if (content.includes(userMessage) || title.includes(userMessage)) {
      matches.push({
        title: post.title,
        url: post.url,
        snippet: post.content.substring(0, 300)
      });
    }
  });

  // No matches found
  if (matches.length === 0) {
    return res.json({
      reply: "I couldn’t find anything about that in your Blogger content."
    });
  }

  // Found matches → return the best one
  const best = matches[0];

  res.json({
    reply: `Here’s what I found from your blog:

🔹 **${best.title}**
${best.snippet}...

Full post: ${best.url}`
  });
});

// Render listen port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
