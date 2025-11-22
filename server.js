const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const { PORT } = require("./config");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", chatRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
