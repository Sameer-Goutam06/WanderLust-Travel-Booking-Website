const mongoose = require('mongoose');
const Listing = require('./models/listing');
const Review = require('./models/review.js');
const wrapAsync = require('./utilities/Errors/wrapAsync');
const ExpressError = require('./utilities/Errors/ExpressError');
//Acquiring joi schema
const { ListingSchema ,ReviewSchema,bookingSchema} = require("./schema.js");
const Booking=require("./models/bookings.js")

//writing the server side validation schema for post methods like create and edit route
//using Joi we are creating a seperate function which checks for error objects inside result object
//so each and every error will be thrown on server side as it is done on client side
//it is important to validate data on server side because we need to be aware of hoppscotch and postman api testers 
///we need to create a robust and secure api
// Server-side validation schema for POST methods
module.exports.validateSchema = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new ExpressError(404, msg);
    } else {
        next();
    }
};

// Validate Review Schema
module.exports.validateReview = (req, res, next) => {
    let { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new ExpressError(404, msg);
    } else {
        next();
    }
};

//validate booking schema
module.exports.validateBooking=(req,res,next)=>{
    const { id } = req.params;
    const { name, count, date } = req.body;   
    // Validate input data using joi schema
    const { error } = bookingSchema.validate({ name, count, date });
    if (error) {
        throw new ExpressError(404, `Validation error: ${error.details[0].message}`);
    }
    else{
        next();
    }
}

//passport login check middleware
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to use this feature");
        return res.redirect("/user/login");
    }
    next();
}

//express middleware to redirect to the page the request has passed before
module.exports.saveRedirectUrl=(req,res,next)=>{
    const redirectUrl = req.session.redirectUrl;
    if (redirectUrl && !redirectUrl.includes("undefined")) {
        res.locals.redirectUrl = redirectUrl;
    } else {
        res.locals.redirectUrl = "/listings";
    }
    delete req.session.redirectUrl; // Clear the session variable after setting it
    next();
}

//express middleware to verify authorization of user to perform operations on listings
module.exports.isOwner=async(req,res,next)=>{
    const { id } = req.params;
    const listingDetails=await Listing.findById(id);
    if(!(res.locals.currentUser._id).equals(listingDetails.owner._id))
    {
        req.flash("error","You are not authorized to edit the details of a destination");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id, rid } = req.params;
    let review=await Review.findById(rid);
    if(!(review.author._id).equals(res.locals.currentUser._id))
    {
        req.flash("error","You are not authorized to delete the reviews of other users");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//to ensure that new listings can only be added by admin
module.exports.isAdmin =(req, res, next) => {
    const Admin = "Admin";
    if (req.user.username !== Admin) {
        req.flash("error", "Only Admin is authorized to create new stays");
        return res.redirect(`/listings`);
    }
    next();
};

module.exports.isSameUser=async(req,res,next)=>{
    const {bookingId}=req.params;
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) {
        req.flash('error', 'Booking not found.');
        return res.redirect('/listings');
    }
    const bookedUser=booking.user;
    if(booking.user._id.toString() !== res.locals.currentUser._id.toString() && req.user.username !== "Admin")
    {
        req.flash("error","You are not authorized to view the booking details of other users");
        return res.redirect(`/listings`);
    }
    next();
}

module.exports.isUser=(req,res,next)=>
{
    const {id}=req.params;
    if(!req.user || id.toString() !== req.user._id.toString())
    {
        req.flash("error","You are not authorized to view profile of other users");
        return res.redirect(`/listings`);
    }
    next();
}