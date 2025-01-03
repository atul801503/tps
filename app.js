const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path  = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log("Error connecting to DB:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => { 
    res,send("Hi, I am root");
});





app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);




  



app.get("/listings/:id", wrapAsync(async (req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show.ejs", {listing});
}));

// app.get("/testListing", async (req, res) => {
//    let sampleListing = new Listing({
//             title: "My Sweet Patna",
//             description: "By the Town",
//             price: 1000,
//             location: "JD Women Hostel",
//             country: "India",
//         });

//         await sampleListing.save();
//         console.log("Sample was saved");
//         res.send("Successful testing");
    
// });

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err, statusCode, message });
});



app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});