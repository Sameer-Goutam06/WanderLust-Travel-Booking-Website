const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejs_mate = require('ejs-mate');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejs_mate);

// Mongoose connection
let main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
};

main()
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

// Require model created in models folder
const Listing = require('./models/listing.js');

// Listening to port number
let port = 8080;
app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
});

// Root route
app.get('/', (req, res) => {
    res.redirect("/listings");
});

// Listings route - list of all available destinations
app.get('/listings', async (req, res) => {
    try {
        const l = await Listing.find();
        res.render('listings/index.ejs', { l });
    } catch (e) {
        next(e);
    }
});

// Create a new stay destination
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
});

// Acquire the details of stay place
app.post('/listings/new', async (req, res) => {
    try {
        let newlisting = new Listing(req.body.listing);
        await newlisting.save();
        console.log('Inserted successfully');
        res.redirect('/listings');
    } catch (e) {
        console.log(e);
        next(e);
    }
});

// See the details of a destination in detail using object id and anchor tags
app.get('/listings/:id', async (req, res) => {
    try {
        let { id } = req.params;
        const result = await Listing.findById(id);
        res.render('listings/show', { result });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

// Editing route for details of a destination
app.get('/listings/:id/edit', async (req, res) => {
    try {
        let { id } = req.params;
        const result = await Listing.findById(id);
        res.render('listings/edit', { result });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

// PUT method to acquire the details obtained from the editing route
app.put('/listings/:id/edit', async (req, res) => {
    try {
        let { id } = req.params;
        let updateData = req.body.listing;
        // Ensure the price is a number
        updateData.price = Number(updateData.price);
        // Ensure the image object is present
        if (!updateData.image) {
            updateData.image = {
                filename: 'default-image.jpg', // Or any default value
                url: 'https://default-image-url.jpg' // Default URL
            };
        }
        const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
        console.log('Updation successful:', updatedListing);
        res.redirect('/listings');
    } catch (e) {
        console.log('Updation unsuccessful:', e);
        next(e);
    }
});



// DELETE method to delete a listing
app.delete('/listings/:id/delete', async (req, res) => {
    try 
    {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        console.log('Deletion successful');
        res.redirect('/listings');
    } catch (e) {
        console.log('Deletion unsuccessful: ' + e);
        next(e);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const error = 
    {
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
        firstLine: err.stack.split('\n')[1] || 'No stack trace available'
    };
    res.status(error.status);
    res.render('listings/error', { error });
});