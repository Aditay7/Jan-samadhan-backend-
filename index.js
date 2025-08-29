require("dotenv").config({ quiet: true });
const express = require("express");
const { sequelize } = require("./models");
const app = express();
const PORT = process.env.SERVER_PORT || 3000;
app.use(express.json());
const checkForAuthToken = require("./middlewares/authentication");
const userRoute = require("./routes/user");

app.get("/", (req, res) => {
  res.send("Hey server is running");
});

app.use("/api", userRoute);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await sequelize.sync();
});
