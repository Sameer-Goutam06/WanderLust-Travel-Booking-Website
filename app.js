//admin user id and password {Admin, admin@gmail.com, admin@123}
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
//acquiring session and many more models
const session=require("express-session");
const flash=require("connect-flash");
//acquiring error modules
const wrapAsync = require('./utilities/Errors/wrapAsync');
const ExpressError = require('./utilities/Errors/ExpressError');
//acquiring models
const User=require("./models/user.js");
const Listing = require('./models/listing');
const Review = require("./models/review.js");
//acquiring passport modules for authentication and authorization
const passport=require("passport")
const LocalStrategy=require("passport-local")

// Setting Up Things.....

// Set up view engine and directories
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Connect to MongoDB
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}
main()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));


//express-seeion settings and usage
const sessionOptions={
    secret:"MySecretKey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true,
    }
}

//express-session usage
app.use(session(sessionOptions));
//connect-flash usage
app.use(flash());
//passport middlware is used for sessions so we need to initialize it fresh for every session
app.use(passport.initialize());
app.use(passport.session())
//authentication method using LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
//serialize and deserialize user -> to store a users info acquired in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Root route
app.get('/', (req, res) => {
    res.redirect("/listings");
});

//middleware to acquire flash data
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});

// Acquire listing routes
const listingRoutes = require("./routes/listingRoutes.js");
app.use("/listings", listingRoutes);

//acquire review routes
const reviewRoutes=require("./routes/reviewRoutes.js");
app.use("/listings/:id/reviews",reviewRoutes);

//acquire user routes
const userRoutes=require("./routes/userRoutes.js");
app.use("/user",userRoutes);

//acquire booking routes
const bookingRoutes=require("./routes/bookingRoutes.js")
app.use("/bookings",bookingRoutes);

// Error handling middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!!"));
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

// Starting to listen to port
const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on: http://localhost:${port}`);
});