const axios = require("axios");
const { BLOG_ID, API_KEY } = require("../config/config");

let cachedPosts = [];

exports.getAllPosts = async () => {
  if (cachedPosts.length > 0) return cachedPosts;

  const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=500`;

  const res = await axios.get(url);
  cachedPosts = res.data.items.map(post => ({
    title: post.title,
    content: post.content,
    url: post.url
  }));

  return cachedPosts;
};

