const express = require("express");
const cors = require("cors");
const chatbot = require("./commonReplies"); // the module above

const app = express();
app.use(express.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const replyText = chatbot.getReply(message);
    return res.json({ reply: replyText });
  } catch (err) {
    console.error(err);
    return res.json({ reply: "Server error." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
