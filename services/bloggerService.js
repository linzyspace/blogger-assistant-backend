const axios = require("axios");
const cheerio = require("cheerio");

const BLOG_ID = process.env.BLOGGER_BLOG_ID;
const API_KEY = process.env.BLOGGER_API_KEY;

const BASE = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}`;

module.exports = {
  fetchPosts: async () => {
    try {
      const res = await axios.get(`${BASE}/posts?maxResults=500&key=${API_KEY}`);
      return res.data.items || [];
    } catch (err) {
      console.error("Error fetching posts:", err.response?.status, err.response?.data);
      return [];
    }
  },

  fetchPages: async () => {
    try {
      const res = await axios.get(`${BASE}/pages?maxResults=200&key=${API_KEY}`);
      return res.data.items || [];
    } catch (err) {
      console.error("Error fetching pages:", err.response?.status, err.response?.data);
      return [];
    }
  },

  stripHTML: (html) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),

  extractImages: (html) => {
    const $ = cheerio.load(html);
    const images = [];
    $("img").each((_, img) => {
      const src = $(img).attr("src");
      if (src) images.push(src);
    });
    return images;
  },

  extractFiles: (html) => {
    const fileRegex = /(https?:\/\/[^\s"'<>]+\.(pdf|doc|docx|xls|xlsx|ppt|pptx))/gi;
    const matches = html.match(fileRegex);
    return matches || [];
  },

  searchAllContent: async (query) => {
    const q = query.toLowerCase();

    const [posts, pages] = await Promise.all([module.exports.fetchPosts(), module.exports.fetchPages()]);
    const allContent = [...posts, ...pages];

    if (!allContent.length) return null;

    // Search posts/pages for query
    let match = allContent.find(item => {
      const title = (item.title || "").toLowerCase();
      const content = module.exports.stripHTML(item.content || "").toLowerCase();
      return title.includes(q) || content.includes(q);
    });

    if (!match) {
      // Fuzzy: match if any word exists in content
      match = allContent.find(item => {
        const content = module.exports.stripHTML(item.content || "").toLowerCase();
        return q.split(" ").some(word => content.includes(word));
      });
    }

    if (!match) return null;

    const text = module.exports.stripHTML(match.content || "");
    const snippet = text.substring(0, 400) + "...";
    const images = module.exports.extractImages(match.content);
    const files = module.exports.extractFiles(match.content);

    let reply = `**${match.title}**\n${snippet}\nLink: ${match.url}\n`;
    if (images.length) reply += `Images: ${images.join(", ")}\n`;
    if (files.length) reply += `Files: ${files.join(", ")}\n`;

    return reply;
  }
};

