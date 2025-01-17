const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
   let { error } = reviewSchema.validate(req.body);
  
    if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
     next();
    }
  };

 // Reviews
//Post Review Route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    
      // Find the listing by ID from the route parameters
      let listing = await Listing.findById(req.params.id);
      
      // Create a new review with the review data from the request body
      let newReview = new Review(req.body.review);
      console.log(newReview);
      // Push the new review to the listing's reviews array
      listing.reviews.push(newReview);
      
      // Save the new review and listing
      await newReview.save();
      await listing.save();
      req.flash("success", "New Review Created");
      
      // Redirect back to the listing page
      res.redirect(`/listings/${listing._id}`);
  })
);
//Delete Rreview Route
router.delete("/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
    })
);

module.exports = router;


