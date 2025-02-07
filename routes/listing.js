const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

  router
  .route("/")         // ("/" path pr hi get and post request aa rahi )
  .get(  wrapAsync(listingController.index))
  .post( isLoggedIn,                 
     upload.single('listing[image]'), 
     validateListing,       
      wrapAsync(listingController.createListing)
    );  
  
  

  // render new form
  /*use listing/:id later because it can consider even listings/new or listings/anything as id for get req*/

  //add listing: new route(get), take new listings data from user
  router.get("/new", isLoggedIn,listingController.renderNewForm );

  //filter category route
router.get("/category", wrapAsync(listingController.filterListings));
 

//search route
  router.get("/search", listingController.searchListings);


  router
  .route("/:id")
  .get(  wrapAsync(listingController.showListing) )
  .put( isLoggedIn, isOwner,
    upload.single('listing[image]'), 
     validateListing, 
      wrapAsync (listingController.updateListing))
  .delete( isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));
        
    //  edit route
   router.get("/:id/edit", isLoggedIn,  isOwner, wrapAsync(listingController.renderEditForm));
   
  module.exports = router;




  // index.route
  //  router.get("/",  wrapAsync(listingController.index));
   //   create rout post 
  // router.post("/",  isLoggedIn, validateListing, wrapAsync(listingController.createListing));
   //  // show route
  //  router.get("/:id",  wrapAsync(listingController.showListing) );
  // edit rout putrequest i.e update route
  // router.put("/:id", isLoggedIn, isOwner, validateListing,  wrapAsync (listingController.updateListing));
  // delete route
  // router.delete("/:id",  isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));
  // render new form
  // router.get("/new", isLoggedIn,listingController.renderNewForm );
