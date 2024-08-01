const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utilities/Errors/wrapAsync');
//used for joi validation purposes
const {ListingSchema}=require("./schema.js");
// Set up view engine and directories
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
});

// Connect to MongoDB
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust')
}

main()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Require model created in models folder
const Listing = require('./models/listing');
const ExpressError = require('./utilities/Errors/ExpressError');
const Review=require("./models/review.js");

// Root route
app.get('/', (req, res) => {
    res.redirect("/listings");
});

// Listings route - list of all available destinations
app.get('/listings', wrapAsync(async (req, res) => {
    const l = await Listing.find();
    if(!l)
    {
        throw new ExpressError(404,"DB not working");
    }
    res.render('listings/index', { l });
}));

//writing the server side validation schema for post methods like create and edit route
//using Joi we are creating a seperate function which checks for error objects inside result object
//so each and every error will be thrown on server side as it is done on client side
//it is important to validate data on server side because we need to be aware of hoppscotch and postman api testers 
///we need to create a robust and secure api
const validateSchema=(req,res,next)=>
{
    //we will be receiving the validtaion details as request parameter
    let {error}=ListingSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(msg);
        throw new ExpressError(404,msg);
    }
    else
    {
        next();
    }
}


// Create a new stay destination
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
});

// Acquire the details of stay place
app.post('/listings/new',validateSchema, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log('Inserted successfully');
    console.log(newListing);
    res.redirect('/listings');
}));

// See the details of a destination in detail using object id and anchor tags
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id);
    if(!result)
    {
        throw new ExpressError(404,"Unable to process the request at the moment.\nTry again refreshing the page and esnsure network connectivity.")
    }
    res.render('listings/show', { result });
}));

// Editing route for details of a destination
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id);
    res.render('listings/edit', { result });
}));

// PUT method to acquire the details obtained from the editing route
app.put('/listings/:id/edit', validateSchema,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    console.log('Updation successful:', updatedListing);
    res.redirect('/listings');
}));

//post route to update reviews for listing
app.post("/listings/:id/reviews",wrapAsync(
    async(req,res)=>{
        const { id } = req.params;
        let stay=await Listing.findById(id);
        let newReview=new Review(req.body.review);
        await newReview.save();
        console.log("Review Saved")
        stay.reviews.push(newReview);
        await stay.save();
        console.log("Destination Reviews Updated")
        res.redirect(`/listings/${id}`);
    }
))

// DELETE method to delete a listing
app.delete('/listings/:id/delete', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log('Deletion successful');
    res.redirect('/listings');
}));

//express error class error handling
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"Page not Found!!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack.split('\n')[1]);
    const error = {
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
        firstLine: err.stack.split('\n')[1] || 'No stack trace available'
    };
    res.status(error.status);
    res.render('listings/error', { error });
});