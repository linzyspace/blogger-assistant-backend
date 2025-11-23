const chatbot = require('./data/defaultResponses');

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const replyText = await chatbot.getReply(message);
    return res.json({ reply: replyText });
  } catch (err) {
    console.error(err);
    return res.json({ reply: "Server error." });
  }
});
