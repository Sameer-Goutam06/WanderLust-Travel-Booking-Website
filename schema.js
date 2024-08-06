//this file is created for server side schema validation using Joi package instead of if else conditions to trigger errors
//used joi package
const Joi = require('joi');

const ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required().min(50).max(500),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(500).max(50000),
        image: Joi.object({
            filename: Joi.string().default('default-image.jpg'),
            url: Joi.string().default('https://cff2.earth.com/uploads/2017/09/31200356/Nature-imagery-has-a-calming-effects-on-prisoners-850x500.jpg')
        }).optional(),
        categories: Joi.array().items(Joi.string()).required()
    }).required(),
});

//creating a user defined schema to verify reviews
const ReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0.5).max(5),
        comment: Joi.string().required().min(5).max(500),
    }).required(),
});

// Define Joi schema for validation
const bookingSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    count: Joi.number().integer().min(1).max(20).required(),
    date: Joi.object({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required()
    }).required()
});

module.exports={ListingSchema,ReviewSchema,bookingSchema};