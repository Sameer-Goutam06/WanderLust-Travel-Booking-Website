const express=require("express");
const router=express.Router();
const wrapAsync=require("../utilities/Errors/wrapAsync.js");
const User=require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const {getSignUp,postSignUp,getLogin,postLogin,logout,getProfile}=require("../controllers/userController.js")
const {isLoggedIn,isUser}=require("../middleware.js");

router.route("/signup")
    .get(wrapAsync(getSignUp))
    .post(saveRedirectUrl,wrapAsync(postSignUp));


router.route("/login")
    .get(wrapAsync(getLogin))
    .post(saveRedirectUrl,
        passport.authenticate('local',
            {failureRedirect:"/user/login",
            failureFlash:true}),
        wrapAsync(postLogin));

router.get("/logout",logout)

router.get("/profile/:id", isLoggedIn, isUser, wrapAsync(getProfile));


module.exports=router;