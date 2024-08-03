const express = require('express');
//to access the parameters even with partial routing
const router = express.Router({ mergeParams: true });
//Acquiring error middleware
const wrapAsync = require('../utilities/Errors/wrapAsync.js');
const ExpressError = require('../utilities/Errors/ExpressError.js');
// Require model created in models folder
const Listing = require('../models/listing.js');
const {isLoggedIn,isOwner,validateSchema}=require("../middleware.js");


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
router.get('/:id',wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}});
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
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id);
    res.render('listings/edit', { result });
}));

// PUT method to acquire the details obtained from the editing route
router.put('/:id/edit',isLoggedIn,isOwner, validateSchema, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updationData = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, updationData, { new: true });
    console.log('Updation successful');
    req.flash("success","Updation for Stay is successful");
    return res.redirect(`/listings/${id}`);
}));

// DELETE method to delete a listing
router.delete('/:id/delete',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
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