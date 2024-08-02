const express = require('express');
//to access the parameters even with partial routing
const router = express.Router({ mergeParams: true });
//Acquiring error middleware
const wrapAsync = require('../utilities/Errors/wrapAsync.js');
const ExpressError = require('../utilities/Errors/ExpressError.js');
//Acquiring joi schema
const { ListingSchema } = require("../schema.js");
// Require model created in models folder
const Listing = require('../models/listing.js');
const Review = require("../models/review.js");
const passport=require("passport");
const {isLoggedIn}=require("../isLoggedIn.js");
//acquiring connect-flash and using it

//writing the server side validation schema for post methods like create and edit route
//using Joi we are creating a seperate function which checks for error objects inside result object
//so each and every error will be thrown on server side as it is done on client side
//it is important to validate data on server side because we need to be aware of hoppscotch and postman api testers 
///we need to create a robust and secure api
// Server-side validation schema for POST methods
const validateSchema = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new ExpressError(404, msg);
    } else {
        next();
    }
};

// Listings route - list of all available destinations
router.get('/', wrapAsync(async (req, res) => {
    const l = await Listing.find();
    if (!l) {
        throw new ExpressError(404, "DB not working");
    }
    res.render('listings/index', { l });
}));

// Create a new stay destination
router.get('/new',isLoggedIn, (req, res) => {
    res.render('listings/new');
});

// Acquire the details of stay place
router.post('/new',isLoggedIn, validateSchema, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log('Inserted successfully');
    console.log(newListing);
    req.flash("success","New Stay Created");
    res.redirect('/listings');
}));

// See the details of a destination in detail using object id and anchor tags
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id).populate("reviews");
    if (!result) {
        req.flash("error","Location Unavailable");
        return res.redirect("/listings");
    }
    if (result.reviews.length > 0) {
        const totalRating = result.reviews.reduce((sum, review) => sum + review.rating, 0);
        result.averageRating = (totalRating / result.reviews.length).toFixed(2);
    } else {
        result.averageRating = 0;
    }
    res.render('listings/show', { result });
}));

// Editing route for details of a destination
router.get('/:id/edit',isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id);
    res.render('listings/edit', { result });
}));

// PUT method to acquire the details obtained from the editing route
router.put('/:id/edit',isLoggedIn, validateSchema, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    console.log('Updation successful');
    req.flash("success","Updation for Stay is successful");
    res.redirect(`/listings/${id}`);
}));

// DELETE method to delete a listing
router.delete('/:id/delete',isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log('Deletion successful');
    req.flash("success","Deletion of Stay is successful");
    res.redirect('/listings');
    //if we are deleting a particular destination then we must say that the reviews given for the destination are to be deleted
    //so the deletion process of reviews will be done in /models/listing.js
    //we use mongoDB techniques to delete all the reviews related to a stay
}));

module.exports = router;