const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your Blogger blog ID or feed URL
const BLOG_FEED_URL = "https://YOUR_BLOG.blogspot.com/feeds/posts/default?alt=json";

async function fetchBloggerPosts() {
  try {
    const res = await axios.get(BLOG_FEED_URL);
    const posts = res.data.feed.entry || [];
    return posts.map(post => {
      // Extract first image from content
      const content = post.content.$t || "";
      const $ = cheerio.load(content);
      const firstImage = $("img").first().attr("src") || null;
      const snippet = $.text().trim().substring(0, 200); // short preview

      return {
        title: post.title.$t,
        link: post.link.find(l => l.rel === "alternate")?.href || "",
        snippet,
        image: firstImage
      };
    });
  } catch (err) {
    console.error("Error fetching Blogger posts:", err);
    return [];
  }
}

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.json({ text: "Please enter a valid message." });
  }

  try {
    const posts = await fetchBloggerPosts();
    const match = posts.find(p =>
      p.title.toLowerCase().includes(message.toLowerCase())
    );

    if (match) {
      res.json({
        text: match.snippet || match.title,
        link: match.link,
        linkText: "Read more",
        image: match.image
      });
    } else {
      res.json({ text: "Sorry, no matching blog post was found.", link: null, linkText: null, image: null });
    }
  } catch (err) {
    console.error(err);
    res.json({ text: "Server error. Please try again later.", link: null, linkText: null, image: null });
  }
});

// Health check
app.get("/", (req, res) => res.send("Blogger Assistant Backend is running!"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
