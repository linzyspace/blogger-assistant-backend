const axios = require('axios');

// ==== CONFIGURE YOUR BLOGGER DETAILS ====
const BLOG_ID = 'YOUR_NUMERIC_BLOG_ID';  // e.g., 1234567890123456789
const API_KEY = 'YOUR_BLOGGER_API_KEY';  // Make sure Blogger API is enabled

if (!BLOG_ID || !API_KEY) {
  console.error("ERROR: BLOG_ID or API_KEY is missing. Please configure them correctly.");
}

// =========================================

/**
 * Fetch all posts from Blogger and find the first post that matches the query
 * in title or content. Returns snippet + images + PDFs + Word docs.
 * @param {string} query User input to search for
 * @returns {string|null} Formatted HTML response or null if no match
 */
async function searchPosts(query) {
  if (!query || !query.trim()) return null;

  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?maxResults=50&key=${API_KEY}`;
    console.log("Fetching Blogger posts from:", url);

    const res = await axios.get(url);
    const posts = res.data.items;

    if (!posts || posts.length === 0) return null;

    const lowerQuery = query.toLowerCase();

    // Find first post that matches the query in title or content
    const matchingPost = posts.find(post =>
      (post.title && post.title.toLowerCase().includes(lowerQuery)) ||
      (post.content && post.content.toLowerCase().includes(lowerQuery))
    );

    if (!matchingPost) return null;

    // Prepare snippet
    const snippet = matchingPost.content.replace(/<[^>]*>?/gm, '').slice(0, 300);
    const link = matchingPost.url;

    // Extract first image if available
    let imageTag = '';
    const imgMatch = matchingPost.content.match(/<img[^>]+src="([^">]+)"/i);
    if (imgMatch) imageTag = `<br><img src="${imgMatch[1]}" style="max-width:100%; border-radius:8px;">`;

    // Extract PDFs and Word documents
    let fileLinks = '';
    const pdfMatches = [...matchingPost.content.matchAll(/href="([^"]+\.pdf)"/gi)];
    const wordMatches = [...matchingPost.content.matchAll(/href="([^"]+\.docx?)"/gi)];

    pdfMatches.forEach(m => fileLinks += `<br><a href="${m[1]}" target="_blank">PDF Document</a>`);
    wordMatches.forEach(m => fileLinks += `<br><a href="${m[1]}" target="_blank">Word Document</a>`);

    return `${snippet}...<br><a href="${link}" target="_blank">Read more</a>${imageTag}${fileLinks}`;
  } catch (err) {
    console.error("Error fetching Blogger posts:", err.message);
    return null;
  }
}

module.exports = { searchPosts };
