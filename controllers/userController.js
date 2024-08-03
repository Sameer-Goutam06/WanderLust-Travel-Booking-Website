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
        let {username,email,password,confirmPassword}=req.body;
        if(password!=confirmPassword)
        {
            throw new ExpressError("Passwords do not match");
        }
        const newUser= new User({email,username});
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