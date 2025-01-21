const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    comment:String,
  rating:{
    type:Number,
    min:1,
    max:5,
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Register the schema with Mongoose and create the model
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;