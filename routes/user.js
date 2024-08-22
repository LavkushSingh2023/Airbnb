const express = require("express");
const router = express.Router();
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

//SignUp-
router.route("/signup")
    .get(userController.renderFormToSignUp)
    .post(userController.signUp)

//Login-
router.route("/login")
    .get(userController.renderFormToLogIn)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.logIn)

// LogOut-
router.get("/logout", userController.logOut);

module.exports = router;