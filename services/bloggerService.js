/**
 * services/bloggerService.js
 *
 * Provides searchAllContent(query) to search Blogger posts and pages,
 * extract snippets, images, PDF/DOC links and return an HTML-formatted reply.
 *
 * Requirements: axios (npm install axios)
 */

const axios = require('axios');

// ---------- CONFIG ----------
const BLOG_ID = process.env.BLOGGER_BLOG_ID || 'YOUR_NUMERIC_BLOG_ID'; // numeric blog id
const API_KEY = process.env.BLOGGER_API_KEY || 'YOUR_BLOGGER_API_KEY';
const MAX_RESULTS = 50; // max posts/pages to fetch per request
const MAX_IMAGES = 5; // limit images returned per post/page
// ----------------------------

if (!BLOG_ID || BLOG_ID === 'YOUR_NUMERIC_BLOG_ID') {
  console.error('BloggerService: WARNING - BLOG_ID is not set or is a placeholder. Set process.env.BLOGGER_BLOG_ID or update the file.');
}
if (!API_KEY || API_KEY === 'YOUR_BLOGGER_API_KEY') {
  console.error('BloggerService: WARNING - API_KEY is not set or is a placeholder. Set process.env.BLOGGER_API_KEY or update the file.');
}

/**
 * Utility: strip HTML tags and condense whitespace
 */
function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Utility: extract image src attributes from HTML (returns unique list)
 */
function extractImageSrcs(html = '') {
  const imgs = [];
  const imgRegex = /<img[^>]+src=(?:'|")([^'"]+)(?:'|")[^>]*>/gi;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    let src = m[1].trim();
    if (!src) continue;
    // Add protocol if missing but starts with //
    if (src.startsWith('//')) src = 'https:' + src;
    // If relative (starts with /) we cannot fix reliably; skip or keep as-is
    imgs.push(src);
  }
  // deduplicate preserving order
  return [...new Set(imgs)];
}

/**
 * Utility: extract file links (pdf, doc, docx)
 */
function extractFiles(html = '') {
  const files = { pdfs: [], docs: [] };
  const hrefRegex = /href=(?:'|")([^'"]+)(?:'|")/gi;
  let m;
  while ((m = hrefRegex.exec(html)) !== null) {
    const href = m[1].trim();
    if (!href) continue;
    const lower = href.toLowerCase();
    if (lower.endsWith('.pdf')) files.pdfs.push(href);
    if (lower.endsWith('.doc') || lower.endsWith('.docx')) files.docs.push(href);
  }
  // dedupe
  files.pdfs = [...new Set(files.pdfs)];
  files.docs = [...new Set(files.docs)];
  return files;
}

/**
 * Fetch posts from Blogger API (returns array of post objects or empty array)
 */
async function fetchPosts() {
  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?maxResults=${MAX_RESULTS}&key=${API_KEY}`;
    // Debug:
    // console.log('BloggerService: fetchPosts url=', url);
    const res = await axios.get(url);
    return res.data.items || [];
  } catch (err) {
    // Propagate a friendly error message but don't throw fatal
    console.error('BloggerService: Error fetching posts:', err.response?.status, err.response?.data || err.message);
    return [];
  }
}

/**
 * Fetch pages from Blogger API (returns array of page objects or empty array)
 */
async function fetchPages() {
  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/pages?maxResults=${MAX_RESULTS}&key=${API_KEY}`;
    // console.log('BloggerService: fetchPages url=', url);
    const res = await axios.get(url);
    return res.data.items || [];
  } catch (err) {
    console.error('BloggerService: Error fetching pages:', err.response?.status, err.response?.data || err.message);
    return [];
  }
}

/**
 * Choose the best matching post/page from a list based on query
 * Returns object { source: 'post'|'page', item: <item> } or null
 */
function findBestMatch(items = [], query = '') {
  if (!items || items.length === 0) return null;
  const q = query.toLowerCase();

  // scoring: title matches higher than content; exact phrase wins
  let best = null;
  let bestScore = 0;

  for (const it of items) {
    const title = (it.title || '').toLowerCase();
    const content = (it.content || '').toLowerCase();
    let score = 0;

    if (title.includes(q)) score += 100;
    if (content.includes(q)) score += 50;

    // Boost if exact phrase appears (boundary)
    const phraseRegex = new RegExp('\\b' + escapeRegExp(q) + '\\b', 'i');
    if (phraseRegex.test(title)) score += 200;
    if (phraseRegex.test(content)) score += 100;

    // small boost for shorter distance (not implemented: would require indexOf)
    if (score > bestScore) {
      bestScore = score;
      best = it;
    }
  }

  return best ? { item: best, score: bestScore } : null;
}

/**
 * Escape RegExp special characters in a string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build HTML response for a matched item (post or page)
 */
function buildHtmlForItem(item) {
  if (!item) return null;

  const title = item.title || 'Untitled';
  const url = item.url || item.selfLink || '#';
  const rawContent = item.content || '';
  const textSnippet = stripHtml(rawContent).slice(0, 300);

  // images
  const allImgs = extractImageSrcs(rawContent);
  const images = allImgs.slice(0, MAX_IMAGES);
  const imageHtml = images.map(src => `<br><img src="${src}" style="max-width:100%; border-radius:8px; margin-top:6px;">`).join('');

  // files
  const files = extractFiles(rawContent);
  let filesHtml = '';
  files.pdfs.forEach((p) => {
    filesHtml += `<br><a href="${p}" target="_blank" rel="noopener">📕 PDF Document</a>`;
  });
  files.docs.forEach((d) => {
    filesHtml += `<br><a href="${d}" target="_blank" rel="noopener">📝 Word Document</a>`;
  });

  // Compose HTML - include title, snippet, read more, images and files
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <strong>${escapeHtml(title)}</strong><br>
      <div style="margin-top:6px;">${escapeHtml(textSnippet)}${textSnippet.length >= 300 ? '...' : ''}</div>
      <div style="margin-top:8px;"><a href="${url}" target="_blank" rel="noopener">Read more</a></div>
      ${imageHtml}
      ${filesHtml}
    </div>
  `;
  return html;
}

/**
 * basic HTML escape for title/snippet safety
 */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Public function: searchAllContent(query)
 *
 * Steps:
 *  - Fetch posts and pages
 *  - Combine them and find best match using findBestMatch
 *  - If match found, return buildHtmlForItem(match)
 *  - Otherwise return null
 */
async function searchAllContent(query) {
  if (!query || !query.trim()) return null;
  try {
    // Fetch posts and pages in parallel
    const [posts, pages] = await Promise.all([fetchPosts(), fetchPages()]);

    // Combine into a list with some marker if needed (we only need item)
    const combined = [];
    if (posts && posts.length) combined.push(...posts);
    if (pages && pages.length) combined.push(...pages);

    if (combined.length === 0) {
      // nothing to search
      return null;
    }

    // find best match
    const match = findBestMatch(combined, query);
    if (!match || !match.item) return null;

    // build html for matched item
    const html = buildHtmlForItem(match.item);
    return html;
  } catch (err) {
    console.error('BloggerService: Error in searchAllContent:', err.message || err);
    return null;
  }
}

module.exports = {
  searchAllContent
};
