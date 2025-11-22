const defaultResponses = require("../data/defaultResponses");
const { matchKeyword } = require("../utils/keywordMatcher");
const { fetchPosts, findMatchingPost } = require("../services/bloggerService");

async function chatHandler(req, res) {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided." });

  // Check predefined responses
  const predefinedReply = matchKeyword(message, defaultResponses);
  if (predefinedReply) return res.json({ reply: predefinedReply });

  // Fetch posts and find match
  const posts = await fetchPosts();
  const postReply = findMatchingPost(message, posts);
  if (postReply) return res.json({ reply: postReply });

  // Default fallback
  res.json({ reply: "I couldn't find a related post. Can you ask something else?" });
}

module.exports = { chatHandler };
