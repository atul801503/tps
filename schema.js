const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  category: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  geometry: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }).required()
});

module.exports.validateListing = (req, res, next) => {
  if (!req.body || !req.body.title) {
    throw new Error("Request body is missing or malformed"); // Debugging check
  }

  const { error } = listingSchema.validate(req.body); // 💡 Check here

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new Error(msg);
  } else {
    next();
  }
};

const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required().min(5),
});

module.exports = { listingSchema, reviewSchema };