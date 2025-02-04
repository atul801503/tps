const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

.route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show listing details

  // Update a listing (Only owner can update)
  .put(
    isLoggedIn, // Make sure the user is logged in
    isOwner,    // Ensure that the user is the owner of the listing
    upload.single("listing[image]"), // Handle file upload (if needed)
    validateListing, // Validate listing data
    wrapAsync(listingController.updateListing) // Update listing logic
  )
  
//New Route
router
.get("/new", 
  isOwner,
  isLoggedIn, 
  listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isOwner,
  isLoggedIn,
 upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateLisitng)
)

 // Delete a listing (Only owner can delete)
 .delete(
  isLoggedIn, // Ensure the user is logged in
  isOwner,    // Ensure that the user is the owner of the listing
  wrapAsync(listingController.destroyListing) // Delete listing logic
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);




module.exports = router;