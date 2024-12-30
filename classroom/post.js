//POST
//Index - users
app.get("/posts", (req, res) => {
    res.send("GET for posts id");
});

//Show - users
app.get("/posts/:id", (req, res) => {
    res.send("GET for posts id");
});

//POST - users
app.post("/posts", (req, res) => {
    res.send("POST for posts id");
});

// DELETE - users 
app.delete("/posts/:id", (req, res) => {
    res.send("DELETE for posts id");
});