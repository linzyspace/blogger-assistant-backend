const bloggerService = require("../services/bloggerService");
const { searchPosts } = require("../utils/searchUtils");

exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: "Please send a message." });

    // Fetch all posts
    const posts = await bloggerService.getAllPosts();

    // Search posts
    const result = searchPosts(posts, message);

    if (!result) {
      return res.json({ reply: "Sorry, I couldn't find anything relevant in your blog." });
    }

    return res.json({ reply: result });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Error fetching blog content." });
  }
};

