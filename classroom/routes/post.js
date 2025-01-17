const express = require("express");
const router = express.Router();

 
 
 
 
 
 // index Posts
 router.get("/",(req,res) =>{
    res.send("GET for  Posts");
  });
  //  show Posts
  router.get("/:id",(req,res) =>{
    res.send("GET for  Posts id");
  });
  
  // postPosts
  router.post("/",(req,res) =>{
      res.send("post for Posts");
    });
  
    router.delete("/:id",(req,res) =>{
      res.send("delete for Posts id");
    });
  

    module.exports = router;