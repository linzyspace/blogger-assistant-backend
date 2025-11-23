const axios = require("axios");
const cheerio = require("cheerio");

const BLOG_ID = process.env.BLOGGER_BLOG_ID;
const API_KEY = process.env.BLOGGER_API_KEY;

const BASE = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}`;

module.exports = {
  
  // 🔍 Fetch all posts
  fetchPosts: async function () {
    try {
      const res = await axios.get(`${BASE}/posts?maxResults=500&key=${API_KEY}`);
      return res.data.items || [];
    } catch (err) {
      console.error("❌ ERROR fetching Blogger POSTS");
      console.error("Status:", err.response?.status);
      console.error("Message:", err.response?.data);
      return [];
    }
  },

  // 🔍 Fetch all pages
  fetchPages: async function () {
    try {
      const res = await axios.get(`${BASE}/pages?maxResults=200&key=${API_KEY}`);
      return res.data.items || [];
    } catch (err) {
      console.error("❌ ERROR fetching Blogger PAGES");
      console.error("Status:", err.response?.status);
      console.error("Message:", err.response?.data);
      return [];
    }
  },

  // 🧠 Clean HTML to plain text
  stripHTML(html) {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  },

  // 🖼 Extract image URLs
  extractImages(html) {
    const $ = cheerio.load(html);
    const images = [];

    $("img").each((_, img) => {
      const src = $(img).attr("src");
      if (src) images.push(src);
    });

    return images;
  },

  // 📄 Extract PDFs, DOCs, XLS, PPT
  extractFiles(html) {
    const fileRegex = /(https?:\/\/[^\s"'<>]+\.(pdf|doc|docx|xls|xlsx|ppt|pptx))/gi;
    const matches = html.match(fileRegex);
    return matches || [];
  },

  // 🔍 Main search function
  searchPosts: async function (query) {
    const q = query.toLowerCase();

    console.log("🔍 Searching Blogger content for:", q);

    // Fetch both posts & pages
    const [posts, pages] = await Promise.all([this.fetchPosts(), this.fetchPages()]);

    console.log("👉 Posts found:", posts.length);
    console.log("👉 Pages found:", pages.length);

    const all = [...posts, ...pages];

    if (all.length === 0) {
      console.error("❌ No posts/pages fetched. API NOT RETURNING DATA.");
      return null;
    }

    // Try exact match first
    let match = all.find(item =>
      item.title?.toLowerCase().includes(q) ||
      this.stripHTML(item.content || "").toLowerCase().includes(q)
    );

    // If no exact, try fuzzy partial match
    if (!match) {
      match = all.find(item => {
        const text = this.stripHTML(item.content || "").toLowerCase();
        return q.split(" ").some(word => text.includes(word));
      });
    }

    if (!match) {
      console.log("❌ No content match found inside blog.");
      return null;
    }

    // Prepare extracted content
    const text = this.stripHTML(match.content || "");
    const snippet = text.substring(0, 400) + "...";

    const images = this.extractImages(match.content);
    const files = this.extractFiles(match.content);

    let response = `📌 **Found something from your blog:**\n\n`;
    response += `**${match.title}**\n`;
    response += `${snippet}\n\n`;
    response += `🔗 ${match.url}\n\n`;

    if (images.length) {
      response += `🖼 **Images found:**\n${images.map(i => `- ${i}`).join("\n")}\n\n`;
    }

    if (files.length) {
      response += `📄 **Files found:**\n${files.map(f => `- ${f}`).join("\n")}\n\n`;
    }

    return response.trim();
  }
};
