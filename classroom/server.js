const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.get("/getcookies", (req, res) => {
    res.cookie("great", "hello");
    res.send("sent you some cookies");
});

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.use("/users", users);
app.use("/posts", posts);

app.listings(3000, () => {
    console.log("server is listing to 3000");
});