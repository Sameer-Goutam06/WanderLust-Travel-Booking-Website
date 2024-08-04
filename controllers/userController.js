const wrapAsync=require("../utilities/Errors/wrapAsync.js");
const User=require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

module.exports.getSignUp=async(req,res)=>{
    res.render("user/signup");
}

module.exports.postSignUp=async(req,res)=>{
    try
    {
        let {username,email,fullName,password,confirmPassword}=req.body;
        if(password!=confirmPassword)
        {
            throw new ExpressError("Passwords do not match");
        }
        const newUser= new User({username,email,fullName});
        console.log(newUser);
        let result=await User.register(newUser,password);
        console.log(result);
        req.login(result,(err)=>{
            if (err)
            {
                next(err);
            }
            req.flash("success","Welcome to WanderLust");
            return res.redirect(res.locals.redirectUrl);
        });
    }
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/user/signup");
    }
}

module.exports.getLogin=async(req,res)=>{
    res.render("user/login");
}

module.exports.postLogin=async(req,res)=>{
    req.flash("success","Welcome Back! You are Logged in");
    return res.redirect(res.locals.redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
        {
            next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });
}

module.exports.getProfile=async (req, res) => {
    const { id } = req.params;
    
    // Fetch the user by ID and populate the bookings
    const user = await User.findById(id).populate({
            path: 'bookings',
            populate: {
                path: 'listing',
            }
        });
    
    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/listings");
    }
    
    // Render the profile page with the user data
    res.render("user/profile", { user });
}