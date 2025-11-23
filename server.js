const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ---- Helper: Extract image from Blogger post ----
async function extractImageFromURL(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Find the first <img> tag
    const firstImg = $("img").first().attr("src");

    if (firstImg) {
      return firstImg.startsWith("http")
        ? firstImg
        : "https:" + firstImg; // Blogger sometimes omits protocol
    }

    return null;
  } catch (error) {
    console.error("Error extracting image:", error.message);
    return null;
  }
}

// ---- MAIN CHAT ENDPOINT ----
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // If message contains a Blogger URL, extract image
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    let imageUrl = null;

    if (urlMatch) {
      const postUrl = urlMatch[0];
      imageUrl = await extractImageFromURL(postUrl);
    }

    // Simulate AI response
    let replyText = `Here is your result:\n\n${message}`;

    // If image exists, append it to the reply
    if (imageUrl) {
      replyText += `\n\nImage:\n${imageUrl}`;
    } else {
      replyText += `\n\n(No image was detected in the post.)`;
    }

    return res.json({ reply: replyText });

  } catch (err) {
    console.error(err);
    return res.json({ reply: "Server error." });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
