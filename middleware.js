const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    category: Joi.array().items(Joi.string()).required(), 
    location: Joi.string().required(),
    country: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.validateListing = (req, res, next) => {
  if (!req.body.listing) {
      return next(new ExpressError(400, "Listing data is required")); // Prevents undefined error
  }
  if (!Array.isArray(req.body.listing.category)) {
      req.body.listing.category = [req.body.listing.category];
  }
  let { error } = listingSchema.validate(req.body);
  if (error) {
      let errMsg = error.details.map((el) => el.message).join(", ");
      return next(new ExpressError(400, errMsg));
  }
  next();
};

const reviewSchema = Joi.object({
  review: Joi.object({ // Wrapped inside "review" to match request structure
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(5).required(),
  }).required(),
});

module.exports = { listingSchema, reviewSchema };