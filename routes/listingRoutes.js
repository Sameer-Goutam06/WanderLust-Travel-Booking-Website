const express = require('express');
//to access the parameters even with partial routing
const router = express.Router({ mergeParams: true });
//Acquiring error middleware
const wrapAsync = require('../utilities/Errors/wrapAsync.js');
const ExpressError = require('../utilities/Errors/ExpressError.js');
// Require model created in models folder
const Listing = require('../models/listing.js');
const {isLoggedIn,isOwner,validateSchema}=require("../middleware.js");
const{getListings,
    getNewListings,
    postNewListings,
    getListingsById,
    getEditListings,
    putEditListings,
    deleteListings}=require("../controllers/listingController.js");


//path to export methods

// Listings route - list of all available destinations
router.get('/', wrapAsync(getListings));

// Create a new stay destination
router.route("/new")
    .get('/new',isLoggedIn, getNewListings)
    .post('/new',isLoggedIn, validateSchema, wrapAsync(postNewListings));// Acquire the details of stay place



// See the details of a destination in detail using object id and anchor tags
router.get('/:id',wrapAsync(getListingsById));

router.route('/:id/edit')
    .get(isLoggedIn,isOwner, wrapAsync(getEditListings))// Editing route for details of a destination
    .put(isLoggedIn,isOwner, validateSchema, wrapAsync(putEditListings));// PUT method to acquire the details obtained from the editing route

// DELETE method to delete a listing
router.delete('/:id/delete',isLoggedIn,isOwner, wrapAsync(deleteListings));

module.exports = router;