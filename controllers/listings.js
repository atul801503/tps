const { query, response } = require("express");
const Listing = require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews", 
        populate: {
     path: "author",
    },
   })
    .populate("owner");
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings")
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
 }

 module.exports.createListing = async (req, res, next) => {
  try {
    // Make the geocoding request to Mapbox API
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location, // States, Country
        limit: 1,
      })
      .send();

    // Extract the image URL and filename from the uploaded file
    let url = req.file.path;
    let filename = req.file.filename;

    // Create a new Listing object with the data from the request body
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Associate the listing with the logged-in user
    newListing.image = { url, filename }; // Add image info
    newListing.geometry = response.body.features[0].geometry; // Add geometry from geocoding result

    // Save the new listing to the database
    let savedListing = await newListing.save();
    console.log(savedListing);

    // Flash success message and redirect to the listings page
    req.flash("success", "New Listing Created");
    res.redirect("/listings");

  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "There was an error creating your listing.");
    res.redirect("/listings");
  }
};


 module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
let originalImagerurl = listing.image.url;
originalImageUrl = originalImagerurl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing });
  };

  module.exports.updateLisitng = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

     if(typeof req.file !== "underfined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }
    req.flash('success',"Post has been successfully updated");    
    res.redirect(`/listings/${id}`)
    };


    module.exports.destroyListing = async (req, res) => {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
          req.flash("error", "Failed to delete listing. It might not exist.");
          return res.redirect("/listings");
        }
        req.flash("success", "Listing deleted successfully.");
        res.redirect("/listings");
      };