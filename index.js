const express = require('express')
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Hey server is running")
})


app.post("/home", (req, res) => {
    console.log("I am on the homepage")
})

app.listen(PORT, console.log(`Server is runnng ${PORT}`));