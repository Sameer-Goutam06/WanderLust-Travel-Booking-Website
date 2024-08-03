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

module.exports.createReview=async (req, res) => {
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
}

module.exports.deleteReview=async (req, res) => {
    let { id, rid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    console.log("Review deleted from that destination");
    await Review.findByIdAndDelete(rid);
    console.log("Review Deleted");
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}