if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require('./models/listing.js');

 const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;

//connecting to database
main()
.then(() =>{
    console.log("connection successfull");
}) .catch((err) =>{
    console.log(err);
});

async function main(){
  await mongoose.connect(MONGO_URL);

}





// Middleware and Configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
9
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

// Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.get('/search', async(req, res)=>{
  let input = req.query.q.trim().replace(/\s+/g, " ");
  if (input == "" || input == " ") {
    req.flash("error", "Please enter search query!");
    res.redirect("/listings");
  }
  

  let data = input.split("");
  let element = "";
  let flag = false;
  for (let index = 0; index < data.length; index++) {
    if (index == 0 || flag) {
      element = element + data[index].toUpperCase();
    } else {
      element = element + data[index].toLowerCase();
    }
    flag = data[index] == " ";
  }

  let allListings = await Listing.find({
    title: { $regex: element, $options: "i" },
  });
  if (allListings.length != 0) {
    res.locals.success = "Listings searched by Title!";
    res.render("listings/index.ejs", { allListings });
    return;
  }

  if (allListings.length == 0) {
    allListings = await Listing.find({
      category: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by Category!";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    allListings = await Listing.find({
      country: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by Country!";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }

  if (allListings.length == 0) {
    allListings = await Listing.find({
      location: { $regex: element, $options: "i" },
    }).sort({ _id: -1 });
    if (allListings.length != 0) {
      res.locals.success = "Listings searched by Location!";
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }

  const intValue = parseInt(element, 10);
  const intDec = Number.isInteger(intValue);

  if (allListings.length == 0 && intDec) {
    allListings = await Listing.find({ price: { $lte: element } }).sort({
      price: 1,
    });
    if (allListings.length != 0) {
      res.locals.success = `Listings searched by price less than Rs ${element}!`;
      res.render("listings/index.ejs", { allListings });
      return;
    }
  }
  if (allListings.length == 0) {
    req.flash("error", "No listings found based on your search!");
    res.redirect("/listings");
  }
})


// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

module.exports.filterListings=async(req, res)=>{
  let category=req.query.filter;
  let allListings=await Listing.find({}).where('category').in(category);    
  res.render("listings/category.ejs", {allListings: allListings, category: category});
};

module.exports.searchListings=async(req, res)=>{
  let {searchInput}=req.query;
  const regex=new RegExp(searchInput, "i");
  let searchedListing=await Listing.find({
      $or:[
          {title: {$regex: regex}},
          {description: {$regex:regex}},
          {location: {$regex: regex}},
          {country: {$regex:regex}},
          {category: {$regex: regex}}
      ]
  });
  res.render("listings/category.ejs",{allListings: searchedListing, category: searchInput});
};



// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err, statusCode, message });
});

// In your /api/search route
app.get('/api/search', async (req, res) => {
  try {
    console.log("Received search query:", req.query.query);
    const searchQuery = req.query.query.replace(/[^\w\s]/gi, '').trim();
    console.log("Sanitized query:", searchQuery);

    const results = await Listing.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } }
      ]
    }).lean();

    console.log("Search results from DB:", results);
    
    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: "No results found",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error("Search route error:", {
      message: error.message,
      stack: error.stack,
      query: req.query.query
    });
    res.status(500).json({
      success: false,
      message: "Internal server error during search"
    });
  }
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});