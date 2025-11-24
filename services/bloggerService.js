const axios = require("axios");
const cheerio = require("cheerio");

// Load Blogger API credentials
const BLOG_ID = process.env.BLOGGER_BLOG_ID;
const API_KEY = process.env.BLOGGER_API_KEY;

const BASE = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}`;

// ---- Utility Functions ---- //

function stripHTML(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}



function extractFiles(html = "") {
  const fileRegex = /(https?:\/\/[^\s"'<>]+\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip))/gi;
  return html.match(fileRegex) || [];
}

// ---- Fetch All Posts/Pages (with auto-pagination) ---- //

async function fetchAll(endpoint) {
  let url = `${BASE}/${endpoint}?maxResults=50&key=${API_KEY}`;
  let items = [];

  while (url) {
    const res = await axios.get(url);
    const data = res.data;
    if (data.items) items.push(...data.items);

    if (data.nextPageToken) {
      url = `${BASE}/${endpoint}?maxResults=50&pageToken=${data.nextPageToken}&key=${API_KEY}`;
    } else {
      url = null;
    }
  }

  return items;
}

// ---- Main Search Logic ---- //

async function searchAllContent(query) {
  const q = query.toLowerCase();

  // Fetch posts and pages from Blogger API
  const posts = await fetchAll("posts");
  const pages = await fetchAll("pages");

  // Combine and remove duplicates using post.id
  const unique = {};
  [...posts, ...pages].forEach(item => (unique[item.id] = item));
  const allContent = Object.values(unique);

  if (!allContent.length) return "No content found on your blog.";

  // ---- ORIGINAL SEARCH: keyword must appear in title or body ---- //
  let match = allContent.find(item => {
    const title = (item.title || "").toLowerCase();
    const content = stripHTML(item.content || "").toLowerCase();
    return title.includes(q) || content.includes(q);
  });

  // ---- Fuzzy backup: match any word ---- //
  if (!match) {
    const words = q.split(/\s+/);
    match = allContent.find(item => {
      const text = stripHTML(item.content || "").toLowerCase();
      return words.some(word => text.includes(word));
    });
  }

  // Nothing found
  if (!match) return "I could not find anything related to your question.";

  // Build response
  const textContent = stripHTML(match.content || "");
  const snippet = textContent.substring(0, 400) + "...";

  const images = extractImages(match.content);
  const files = extractFiles(match.content);

  let reply = `**${match.title}**\n\n${snippet}\n\n🔗 Link: ${match.url}\n`;

  
  if (files.length)
    reply += `\n📎 Files found:\n${files.join("\n")}\n`;

  return reply;
}

module.exports = {
  searchAllContent
};
