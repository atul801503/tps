const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");



 // Reviews
//Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    
      // Find the listing by ID from the route parameters
      let listing = await Listing.findById(req.params.id);
      
      // Create a new review with the review data from the request body
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
    
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
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
    })
);

module.exports = router;


