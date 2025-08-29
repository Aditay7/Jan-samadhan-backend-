const express = require("express");
require("dotenv").config({quiet: true});
const { sequelize } = require("./models");
const app = express();
const PORT = process.env.SERVER_PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hey server is running");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await sequelize.sync();
});
