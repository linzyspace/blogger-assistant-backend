// server.js
import express from "express";
import cors from "cors";
import process from "process";

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables (recommended)
const BLOG_ID = process.env.BLOGGER_ID || "6604544777764868713";
const BLOGGER_API_KEY = process.env.BLOGGER_API_KEY || "AIzaSyCaUZEDFK50huQDi-WLKjUwOHEp0h";
// Optional: If you want to use OpenAI to rewrite answers more naturally, set OPENAI_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;

// Utility: strip HTML tags (simple)
function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// Fetch all posts from Blogger API (handles pagination)
async function fetchAllPosts() {
  const posts = [];
  let pageToken = undefined;
  const base = `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${BLOGGER_API_KEY}&maxResults=50`;

  try {
    while (true) {
      const url = pageToken ? `${base}&pageToken=${pageToken}` : base;
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Blogger API error: ${res.status} ${res.statusText} — ${text}`);
      }
      const json = await res.json();
      if (json.items) {
        for (const p of json.items) {
          posts.push({
            id: p.id,
            title: p.title || "",
            content: p.content || "",
            published: p.published || "",
            url: p.url || "",
          });
        }
      }
      if (json.nextPageToken) {
        pageToken = json.nextPageToken;
      } else {
        break;
      }
    }
    return posts;
  } catch (err) {
    console.error("fetchAllPosts error:", err);
    throw err;
  }
}

// Basic in-memory search: score by frequency of query terms in title+content
function searchPosts(posts, query, maxResults = 3) {
  if (!query) return [];
  const q = query.toLowerCase().split(/\s+/).filter(Boolean);

  const scored = posts.map(p => {
    const text = (p.title + " " + stripHtml(p.content)).toLowerCase();
    let score = 0;
    for (const term of q) {
      // occurrences count (simple)
      let idx = 0;
      while (true) {
        idx = text.indexOf(term, idx);
        if (idx === -1) break;
        score += 1;
        idx += term.length;
      }
    }
    return { post: p, score, excerpt: makeExcerpt(p, q) };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score > 0).slice(0, maxResults);
}

// Make a short excerpt containing query terms
function makeExcerpt(post, queryTerms, excerptLength = 200) {
  const text = stripHtml(post.content);
  const lower = text.toLowerCase();
  let firstIdx = -1;
  for (const t of queryTerms) {
    const idx = lower.indexOf(t);
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) firstIdx = idx;
  }
  if (firstIdx === -1) {
    // fallback to start of content or title
    const source = post.title ? `${post.title}. ${text}` : text;
    return source.slice(0, excerptLength) + (source.length > excerptLength ? "…" : "");
  }
  const start = Math.max(0, firstIdx - Math.floor(excerptLength / 2));
  const excerpt = text.slice(start, start + excerptLength);
  return (start > 0 ? "…" : "") + excerpt + (text.length > start + excerptLength ? "…" : "");
}

// Optionally call OpenAI to rewrite/condense — placeholder function (commented out)
async function rewriteWithOpenAI(prompt) {
  if (!OPENAI_API_KEY) return prompt;
  // Example of using OpenAI — you must set OPENAI_API_KEY in env and uncomment fetch call below.
  // For legal and billing reasons we leave this commented in the template.
  /*
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // change to the model you have access to
      messages: [{ role: "system", content: "You are a helpful assistant that answers using only the provided excerpts." },
                 { role: "user", content: prompt }],
      max_tokens: 400
    })
  });
  const j = await res.json();
  return j.choices?.[0]?.message?.content ?? prompt;
  */
  return prompt;
}

app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body?.message || "").toString();
    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    // 1) fetch posts (consider caching in production)
    const posts = await fetchAllPosts();

    // 2) search
    const matches = searchPosts(posts, userMessage, 3);

    let reply = "";
    if (matches.length === 0) {
      reply = `I couldn't find any matching content in the blog for "${userMessage}". Try rephrasing or ask something else.`;
    } else {
      // Build the reply using matched excerpts
      reply = matches.map((m, i) => {
        const p = m.post;
        return `Match ${i+1}: "${p.title}" — excerpt: ${m.excerpt}\nLink: ${p.url}`;
      }).join("\n\n");

      // If you want a rewritten/natural reply, call OpenAI rewrite (optional)
      reply = await rewriteWithOpenAI(reply);
    }

    // Return plain JSON with "reply" field expected by frontend
    return res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ reply: "Server error when searching blog. Check server logs." });
  }
});

// Health check
app.get("/", (_req, res) => res.send("Blogger-assistant backend is running."));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
