const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");
const Category=require("./category.js");
const Booking=require("./bookings.js");
const User=require("./user.js");
const ListingSchema=new Schema
({
    title:
    {
        type:String,
        required:true
    },
    description:String,
    image:
    {
        filename: 
        {
            type: String,
            default: 'default-filename.jpg'
        },
        url: 
        {
        type: String,
        default: 'https://cff2.earth.com/uploads/2017/09/31200356/Nature-imagery-has-a-calming-effects-on-prisoners-850x500.jpg'
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    averageRating:Number,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',  // References the Category model
    }],
});

ListingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        console.log(listing);

        // Find and delete associated bookings
        const bookings = await Booking.find({ listing: listing._id });

        // Update users' bookings to remove references
        const userIds = bookings.map(booking => booking.user);
        await User.updateMany(
            { _id: { $in: userIds } },
            { $pull: { bookings: { $in: bookings.map(booking => booking._id) } } }
        );
        console.log("Users' bookings updated successfully");

        // Delete associated bookings
        await Booking.deleteMany({ listing: listing._id });
        console.log("Bookings for " + listing.title + " deleted successfully");

        // Delete associated reviews
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        console.log("Reviews for " + listing.title + " deleted successfully");
    }
});


const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;