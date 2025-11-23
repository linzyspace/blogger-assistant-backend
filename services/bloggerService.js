const axios = require('axios');

const BLOG_ID = 'YOUR_BLOGGER_BLOG_ID';
const API_KEY = 'YOUR_BLOGGER_API_KEY';

async function searchPosts(query) {
  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/search?q=${encodeURIComponent(query)}&key=${API_KEY}`;
    const res = await axios.get(url);
    const posts = res.data.items;

    if (!posts || posts.length === 0) return null;

    const post = posts[0];
    const snippet = post.content.replace(/<[^>]*>?/gm, '').slice(0, 300); // strip HTML, limit length
    const link = post.url;

    // Image
    let imageTag = '';
    const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/i);
    if (imgMatch) imageTag = `<br><img src="${imgMatch[1]}" style="max-width:100%; border-radius:8px;">`;

    // PDFs and Word docs
    let fileLinks = '';
    const pdfMatches = [...post.content.matchAll(/href="([^"]+\.pdf)"/gi)];
    const wordMatches = [...post.content.matchAll(/href="([^"]+\.docx?)"/gi)];

    pdfMatches.forEach(m => fileLinks += `<br><a href="${m[1]}" target="_blank">PDF Document</a>`);
    wordMatches.forEach(m => fileLinks += `<br><a href="${m[1]}" target="_blank">Word Document</a>`);

    return `${snippet}...<br><a href="${link}" target="_blank">Read more</a>${imageTag}${fileLinks}`;
  } catch (err) {
    console.error('Error fetching Blogger posts:', err.message);
    return null;
  }
}

module.exports = { searchPosts };
