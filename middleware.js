let Listing = require("./models/listing");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    // console.log("req.path",req.path,"req.original url",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in on wonderlust");
       return res.redirect("/login");
      }
    next()  ;    

}


module.exports .saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}


module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
     req.flash("error","You are not owner of this listing");
     return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
  if (typeof req.body.listing.category === "string") {
      req.body.listing.category = [req.body.listing.category];
  }
  let { error } = listingSchema.validate(req.body.listing);
  if (error) {
      let errMsg = error.details.map((el) => el.message).join(", ");
      return next(new ExpressError(400, errMsg));
  }
  next();
};
  module.exports.validateListing = (req, res, next) => {
    // If the user selects only one category, convert it into an array for validation
    if (typeof req.body.listing.category === "string") {
        req.body.listing.category = [req.body.listing.category];
    }

    // Validate only the listing part of the request body
    let { error } = listingSchema.validate(req.body.listing); 

    if (error) {
        // Extract error details and throw ExpressError
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Adjust if necessary
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg); // Custom error with status code
    } else {
      next();
    }
};
  
  module.exports.isReviewAuthor= async(req,res,next)=>
    {
    let {id,reviewId} = req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
     req.flash("error","You are not author of this review");
     return res.redirect(`/listings/${id}`);
    }
    next();
};

