// server.js
const express = require('express');
const app = express();

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

  const matches = [];

  for (let post of posts) {
    const title = post.title?.toLowerCase() || "";
    const content = stripHtml(post.content).toLowerCase();

    // Match if any keyword exists (substring match)
    const matched = keywords.some(word => title.includes(word) || content.includes(word));

    if (matched) {
      matches.push({
        title: post.title,
        content: stripHtml(post.content).substring(0, 500), // first 500 chars
        url: post.url
      });
    }
  }

  if (matches.length === 0) return null;

  return matches.slice(0, 3)
    .map(post => `From "${post.title}":\n${post.content}...\nLink: ${post.url}`)
    .join("\n\n");
}

// Search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  const result = searchPosts(posts, query);
  res.send(result || 'No matching posts found.');
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
