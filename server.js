// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());

// Sample posts
const posts = [
  { title: "Cat Tricks", content: "<p>Learn how to train your cat!</p>", url: "/cat-tricks" },
  { title: "Dog Tricks", content: "<p>Fun ways to train dogs &amp; puppies.</p>", url: "/dog-tricks" },
  { title: "Bird Care", content: "<p>How to care for your pet birds &amp; parrots.</p>", url: "/bird-care" }
];

// Function to strip HTML tags
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Search function
function searchPosts(posts, query) {
  if (!query || !posts?.length) return null;

  const keywords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (keywords.length === 0) return null;

  const matches = posts.filter(post => {
    const text = (post.title + " " + stripHtml(post.content)).toLowerCase();
    return keywords.some(word => text.includes(word));
  }).slice(0, 3);

  if (matches.length === 0) return null;

  return matches
    .map(post => `From "${post.title}":\n${stripHtml(post.content).substring(0, 500)}...\nLink: ${post.url}`)
    .join("\n\n");
}

// POST /chat endpoint for Blogger Assistant
app.post('/chat', (req, res) => {
  const message = req.body.message || '';
  const reply = searchPosts(posts, message) || "No matching posts found.";
  res.json({ reply });
});

// Optional GET /search endpoint (for testing)
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  const result = searchPosts(posts, query);
  res.send(result || 'No matching posts found.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
