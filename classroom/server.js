const express = require("express")
const app = express();
// const users = require("./routes/user.js")

app.get("/", (req, res) => {
    res.send("Hi, I am root!");
});

//Index - users
router.get("/users", (req, res) => {
    res.send("GET for users");
});

//Show - users
router.get("/users/:id", (req, res) => {
    res.send("GET for users");
});

//POST - users
router.post("/users", (req, res) => {
    res.send("POST for users");
});

// DELETE - users 
router.delete("/users/:id", (req, res) => {
    res.send("DELETE for users");
});








app.listen(3000, () => {
    console.log("server is listing to 3000")
})