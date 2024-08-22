const express = require("express");
const { route } = require("./listing.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review.js");

// Post Review Routes
router.post("/", isLoggedIn, reviewController.createReview);

// Delete Review Route -
router.delete("/:reviewId", isLoggedIn, isAuthor, reviewController.destroyReview);

module.exports = router;