const he = require('he'); // for decoding HTML entities

function stripHtml(html) {
  if (!html) return "";
  // Remove HTML tags
  const text = html.replace(/<[^>]+>/g, " ");
  // Decode HTML entities and normalize spaces
  return he.decode(text).replace(/\s+/g, " ").trim();
}

exports.searchPosts = (posts, query) => {
  if (!query || !posts?.length) return null;

  // Split query into keywords, filter out empty strings
  const keywords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (keywords.length === 0) return null;

  const matches = [];

  for (let post of posts) {
    const title = post.title?.toLowerCase() || "";
    const content = stripHtml(post.content).toLowerCase();

    // Match if ANY keyword exists (whole-word match)
    const matched = keywords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i'); // whole word, case-insensitive
      return regex.test(title) || regex.test(content);
    });

    if (matched) {
      matches.push({
        title: post.title,
        content: stripHtml(post.content).substring(0, 500), // first 500 chars
        url: post.url
      });
    }
  }

  if (matches.length === 0) return null;

  // Return up to 3 matches
  return matches.slice(0, 3)
    .map(post => `From "${post.title}":\n${post.content}...\nLink: ${post.url}`)
    .join("\n\n");
};
