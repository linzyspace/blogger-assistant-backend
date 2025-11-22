const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const chatRoutes = require("./routes/chat");
const { PORT } = require("./config/config");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/chat", chatRoutes);

app.get("/", (req, res) => res.send("Blogger Assistant Backend Running"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

