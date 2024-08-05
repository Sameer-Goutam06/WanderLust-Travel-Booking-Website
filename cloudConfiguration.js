const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const listingStorage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"WanderLust/Listings",
        allowed_formats:["png","jpg","jpeg","webp"]
    }
});

module.exports={cloudinary,listingStorage};