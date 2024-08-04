const wrapAsync = require('../utilities/Errors/wrapAsync.js');
const ExpressError = require('../utilities/Errors/ExpressError.js');
// Require model created in models folder
const Listing = require('../models/listing.js');

module.exports.getListings=async (req, res) => {
    const l = await Listing.find();
    if (!l) {
        throw new ExpressError(404, "DB not working");
    }
    res.render('listings/index', { l });
}

module.exports.getNewListings=(req, res) => {
    console.log(res.locals.currentUser.username);
    if(((res.locals.currentUser.username)!=="Admin"))
    {
        throw new ExpressError(404,"Only the developer of this website is authorized to create a new listing");
    }
    res.render('listings/new');
}

module.exports.postNewListings=async(req, res) => {
    const newListing = new Listing(req.body.listing);
    if(((res.locals.currentUser.username)!=="Admin"))
    {
        throw new ExpressError(404,"Only the developer of this website is authorized to create a new listing");
    }
    newListing.owner=req.user._id;
    await newListing.save();
    console.log('Inserted successfully');
    console.log(newListing);
    req.flash("success","New Stay Created");
    res.redirect('/listings');
}

module.exports.getListingsById=async (req, res) => {
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
}

module.exports.getEditListings=async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id);
    res.render('listings/edit', { result });
}

module.exports.putEditListings=async (req, res) => {
    const { id } = req.params;
    const updationData = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, updationData, { new: true });
    console.log('Updation successful');
    req.flash("success","Updation for Stay is successful");
    return res.redirect(`/listings/${id}`);
}

module.exports.deleteListings=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log('Deletion successful');
    req.flash("success","Deletion of Stay is successful");
    res.redirect('/listings');
    //if we are deleting a particular destination then we must say that the reviews given for the destination are to be deleted
    //so the deletion process of reviews will be done in /models/listing.js
    //we use mongoDB techniques to delete all the reviews related to a stay
}