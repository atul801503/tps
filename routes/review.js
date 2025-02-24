const express = require("express");
const router = express.Router({ mergeParams: true }); // Enables access to parent route params
const wrapAsync = require("../utils/wrapAsync.js");   // Async error handler
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

// POST route to create a review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControllers.createReview)
);

// DELETE route to remove a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.destroyReview)
);

module.exports = router;
