const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null).default("default.jpg"),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),
});




module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // Assuming a rating scale of 1 to 5
        comment: Joi.string().required().min(1).max(500), // Allows up to 500 characters
    }).required(),
});
