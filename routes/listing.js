const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

// New create route 
router.route("/new")
    .get(isLoggedIn, listingController.renderFormToCreateNewListing)
    .post(isLoggedIn, upload.single('listing[image]'), listingController.createNewListing)
    
//Index route
router.get("/", listingController.index);

//Show route
router.get("/show/:id", listingController.showListingInDetail);

//Update route
router.route("/edit/:id")
    .get(isLoggedIn, isOwner, listingController.renderFormToEditListing)
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), listingController.updateListing)

// Delete route
router.delete("/delete/:id", isLoggedIn, isOwner, listingController.deleteListing);

module.exports = router;