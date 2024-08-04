//given this controller to include asynchronous middleware for booking route
//no commits can be made till then
//Acquiring models
const Booking=require("../models/bookings.js");
const User=require("../models/user.js");
const Listing=require("../models/listing.js");

const ExpressError = require("../utilities/Errors/ExpressError.js");

module.exports.getBookingForm=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error","Place not found")
        throw new ExpressError(404, "Place not found.");
    }
    res.render("bookings/bookingForm",{listing});
}

module.exports.postBookingForm=async (req, res) => {
    const { id } = req.params;
    const { name, count, date } = req.body;
    const listingDetails = await Listing.findById(id);

    if (!listingDetails) {
        req.flash('error', 'Listing not found.');
        return res.redirect('/listings');
    }

    // Calculate the number of days based on startDate and endDate
    const startDate = new Date(date.startDate);
    const endDate = new Date(date.endDate);
    const timeDiff = Math.abs(endDate - startDate);
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    // Calculate price and save booking
    const price = listingDetails.price * count * days;
    const newBooking = new Booking({
        name,
        count,
        price,
        date: {
            startDate: date.startDate,
            endDate: date.endDate
        },
        days, // Include days in the booking
        user: res.locals.currentUser._id,
        listing: id
    });
    const savedBooking = await newBooking.save();

    const user = await User.findById(res.locals.currentUser._id);
    user.bookings.push(savedBooking._id);
    await user.save();

    req.flash('success', 'Booking confirmed successfully!');
    res.redirect(`/bookings/bookingSummary/${savedBooking._id}`);
}

module.exports.getBookingSummary=async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('user').populate('listing');
    if (!booking) {
        throw new ExpressError(404, "Booking not found.");
    }
    if (booking.user._id.toString() !== res.locals.currentUser._id.toString() && req.user.username !== "Admin") {
        throw new ExpressError(403, "You are not authorized to view this booking.");
    }
    res.render('bookings/bookingSummary', { booking, user: booking.user, listing: booking.listing });
}