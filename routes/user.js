const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport =require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usersController = require("../controllers/users.js");

router.route("/signup")
.get( usersController.renderSignupForm)
.post( wrapAsync(usersController.signup));


router
.route("/login")
.get(usersController.renderloginForm)
.post(
    saveRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login',
        failureFlash:true,
     }), usersController.afterLogin);



router.get("/logout",usersController.logout);

module.exports = router;


// router.get("/signup", usersController.renderSignupForm);
// router.post("/signup", 
    // wrapAsync(usersController.signup));

    // router.get("/login",usersController.renderloginForm);
    // .post("/login",
    //     saveRedirectUrl,
    //     passport.authenticate('local', { 
    //         failureRedirect: '/login',
    //         failureFlash:true,
    //      }), usersController.afterLogin);
    