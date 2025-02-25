const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        category: Joi.array().items(Joi.string()).required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        // Wrapped inside "review" to match request structure
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});

module.exports = { listingSchema, reviewSchema };