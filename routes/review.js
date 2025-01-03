const express = require("express");
const router = express.Router({ mergeParams: true }); // Merge parameters from parent route
const wrapAsync = require("../utils/wrapAsync");
const validateReview = require("../middlewares/validateReview");
const Listing = require("../models/Listing");
const Review = require("../models/Review");

// POST route for creating a review
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found.");
    }
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  })
);

// DELETE route for deleting a review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } },
      { new: true }
    );
    if (!listing) {
      return res.status(404).send("Listing not found.");
    }
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).send("Review not found.");
    }
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
