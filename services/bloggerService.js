const axios = require("axios");
const { BLOG_ID, API_KEY } = require("../config/config");

let cachedPosts = [];

exports.getAllPosts = async () => {
  if (cachedPosts.length > 0) return cachedPosts;

  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=500`;
    const res = await axios.get(url);

    if (!res.data.items) {
      console.error("Blogger API returned no posts:", res.data);
      return [];
    }

    cachedPosts = res.data.items.map(post => ({
      title: post.title,
      content: post.content,
      url: post.url
    }));

    return cachedPosts;
  } catch (err) {
    console.error("Error fetching Blogger posts:", err.response ? err.response.data : err.message);
    return [];
  }
};
