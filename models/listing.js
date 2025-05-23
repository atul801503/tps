const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
   title: { type: String, required: true },
   description: String,
   image: { url: String, filename: String },
   price: Number,
   location: String,
   country: String,
   reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
   owner: { type: Schema.Types.ObjectId, ref: "User" },
   geometry: {
       type: { type: String, enum: ["Point"] },
       coordinates: { type: [Number] },
   },
   category: {
       type: String,
   },
});

// Fix Text Index (Only text fields allowed)
listingSchema.index({ title: "text", description: "text", location: "text", country: "text" });

//  Create a separate geospatial index
listingSchema.index({ geometry: "2dsphere" });

//  When a listing is deleted, remove associated reviews
listingSchema.post("findOneAndDelete", async (listing) => {
   if (listing) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
   }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;