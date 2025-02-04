const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    country: String,
    image: {
        url: String,
        filename: String,
    },
    reviews: [
        { type: mongoose.Schema.Types.ObjectId,
             ref: 'Review' 
            } // Ensure 'Review' matches the registered model name
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],  // Corrected typo here
      required: true,   // Corrected "require" to "required"
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
 
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.delereMany({ _id: { $in: listing .reviews}});
    }
});


module.exports = mongoose.model('Listing', listingSchema);