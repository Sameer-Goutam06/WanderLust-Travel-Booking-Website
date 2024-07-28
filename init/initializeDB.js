const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');
let main=async()=>
{
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}
    
main()
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));

const initDB=async()=>
{
    await Listing.deleteMany();
    await Listing.insertMany(initData.data);
    console.log("DB initialized");
}

// initDB();