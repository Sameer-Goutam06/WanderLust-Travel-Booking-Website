const express = require('express');
const router = express.Router({ mergeParams: true }); // Use mergeParams to access :id in nested routes
//Acquiring error middleware
const wrapAsync = require('../utilities/Errors/wrapAsync.js');
const ExpressError = require('../utilities/Errors/ExpressError.js');
//Acquiring joi schema
const { ReviewSchema } = require("../schema.js");
// Require model created in models folder
const Listing = require('../models/listing.js');
const Review = require("../models/review.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");


// Validate Review Schema
const validateReview = (req, res, next) => {
    let { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new ExpressError(404, msg);
    } else {
        next();
    }
};

// Post route to update reviews for listing or to add a review
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let stay = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    let res1=await newReview.save();
    console.log(res1);
    stay.reviews.push(newReview);
    let res2=await stay.save();
    console.log(res2);
    req.flash("success","New Review Added");
    res.redirect(`/listings/${id}`);
}));

// DELETE method to delete a review
router.delete("/:rid/delete",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, rid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    console.log("Review deleted from that destination");
    await Review.findByIdAndDelete(rid);
    console.log("Review Deleted");
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;