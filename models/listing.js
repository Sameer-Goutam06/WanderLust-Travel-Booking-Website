const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");
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
    }
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        console.log(listing);
        await Review.deleteMany({_id:{$in:listing.reviews}});
        console.log("Reviews for "+listing.title+" deleted successfully");
    }
});

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;