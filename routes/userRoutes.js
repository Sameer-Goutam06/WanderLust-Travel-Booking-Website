const express=require("express");
const router=express.Router();
const wrapAsync=require("../utilities/Errors/wrapAsync.js");
const User=require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");


router.get("/signup",wrapAsync(async(req,res)=>{
    res.render("user/signup");
}));

router.post("/signup",saveRedirectUrl,wrapAsync(async(req,res)=>{
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
}));

router.get("/login",wrapAsync(async(req,res)=>{
    res.render("user/login");
}));

router.post("/login",saveRedirectUrl,
    passport.authenticate('local',
        {failureRedirect:"/user/login",
        failureFlash:true}),
    wrapAsync(async(req,res)=>{
        req.flash("success","Welcome Back! You are Logged in");
        return res.redirect(res.locals.redirectUrl);
}));

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
        {
            next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });
})

module.exports=router;