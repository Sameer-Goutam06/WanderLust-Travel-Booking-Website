const express = require('express');
const router = express.Router({ mergeParams: true }); // Use mergeParams to access :id in nested routes
//Acquiring error middleware
const wrapAsync = require('../utilities/Errors/wrapAsync.js');
const ExpressError = require('../utilities/Errors/ExpressError.js');
//Acquiring joi schema and
const { ReviewSchema } = require("../schema.js");
// Require model created in models folder
const Listing = require('../models/listing.js');
const Review = require("../models/review.js");
//middlewares
const {isLoggedIn,isReviewAuthor,validateReview}=require("../middleware.js");
//controllers
const {createReview,deleteReview}=require("../controllers/reviewController.js");

// Post route to update reviews for listing or to add a review
router.post("/",isLoggedIn, validateReview, wrapAsync(createReview));

// DELETE method to delete a review
router.delete("/:rid/delete",isLoggedIn,isReviewAuthor, wrapAsync(deleteReview));

module.exports=router;