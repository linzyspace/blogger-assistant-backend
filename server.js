const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your Blogger blog feed URL
const BLOG_FEED_URL = "https://YOUR_BLOG.blogspot.com/feeds/posts/default?alt=json";

// Fetch posts and extract first image
async function fetchBloggerPosts() {
  try {
    const res = await axios.get(BLOG_FEED_URL);
    const posts = res.data.feed.entry || [];

    return posts.map(post => {
      const content = post.content?.$t || "";
      const $ = cheerio.load(content);

      // Extract first image URL
      const firstImage = $("img").first().attr("src") || null;

      // Text snippet (first 200 chars)
      const snippet = $.text().trim().substring(0, 200);

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
    return res.json({ text: "Please enter a valid message.", image: null, link: null, linkText: null });
  }

  try {
    const posts = await fetchBloggerPosts();

    // Match post by keyword in title
    const match = posts.find(p => p.title.toLowerCase().includes(message.toLowerCase()));

    if (match) {
      return res.json({
        text: match.snippet || match.title,
        image: match.image,   // actual image URL
        link: match.link,
        linkText: "Read more"
      });
    } else {
      return res.json({
        text: "Sorry, no matching blog post was found.",
        image: null,
        link: null,
        linkText: null
      });
    }
  } catch (err) {
    console.error(err);
    return res.json({
      text: "Server error. Please try again later.",
      image: null,
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
