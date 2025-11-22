const axios = require("axios");
const { BLOG_ID, API_KEY } = require("../config");

async function fetchPosts() {
  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`;
    const res = await axios.get(url);
    return res.data.items || [];
  } catch (err) {
    console.error("Error fetching Blogger posts:", err.message);
    return [];
  }
}

function findMatchingPost(message, posts) {
  const lowerMsg = message.toLowerCase();
  for (let post of posts) {
    const title = post.title.toLowerCase();
    const content = post.content.replace(/<[^>]+>/g, "").toLowerCase();
    if (lowerMsg.includes(title) || content.includes(lowerMsg)) {
      const snippet = content.length > 200 ? content.substring(0, 200) + "..." : content;
      return `From your blog post "${post.title}": ${snippet}`;
    }
  }
  return null;
}

module.exports = { fetchPosts, findMatchingPost };
