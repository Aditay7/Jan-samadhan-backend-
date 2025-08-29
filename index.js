const express = require("express");
require("dotenv").config();
const sequelize = require("./config/database");
const User = require("./models/User");
const app = express();
const PORT = process.env.SERVER_PORT || 3000;
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hey server is running");
});



app.listen(PORT, async() => {
    console.log(`Server is running on ${PORT}`);
    await sequelize.sync();
});
