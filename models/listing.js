const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const Joi = require("joi");



const listingSchema = new Schema({
   title: {
       type: String,
       required: true,
   },
   description: String,
   image: {
       url: String,
       filename: String,
   },
   price: Number,
   location: String,
   country: String,
   reviews: [
       {
           type: Schema.Types.ObjectId,
           ref: "Review",
       },
   ],
   owner: {
       type: Schema.Types.ObjectId,
       ref: "User",
   },
   geometry: {
       type: {
           type: String, // Don't do { location: { type: String } }
           enum: ["Point"], // 'location.type' must be 'Point'
       },
       coordinates: {
           type: [Number],
       },
   },
   category: String,
});
//when the listing is deleted, delete the reviews associated with that listing.
listingSchema.post("findOneAndDelete",async(listing) =>{
   if(listing){
      await Review.deleteMany({_id:{$in:listing.reviews}});
   }
});

//creating indexes for effiecient query processing.
listingSchema.index({
   title: 'text', description: 'text', location: 'text', country: 'text', category: 1, reviews: 1, owner: 1, geometry: "2dsphere"
});


const Listing = mongoose.model("Listing",listingSchema );
module.exports = Listing;