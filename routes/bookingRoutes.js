const express=require("express");
const router=express.Router();

//Acquiring error middleware
const wrapAsync = require('../utilities/Errors/wrapAsync.js');

//Acquiring models
const Booking=require("../models/bookings.js");
const User=require("../models/user.js");
const Listing=require("../models/listing.js");

//middlewares and error handlers
const{isLoggedIn,validateBooking,isSameUser}=require("../middleware.js");
const ExpressError = require("../utilities/Errors/ExpressError.js");

//controllers
const {getBookingForm,postBookingForm,getBookingSummary}=require("../controllers/bookingsController.js")

router.route("/book/:id")
    .get(isLoggedIn,wrapAsync(getBookingForm))
    .post( isLoggedIn, validateBooking, wrapAsync(postBookingForm));


router.get('/bookingSummary/:bookingId',isLoggedIn,wrapAsync(isSameUser),wrapAsync(getBookingSummary));

module.exports=router;