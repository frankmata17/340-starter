const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");

// ✅ Correct POST route to submit a review
router.post(
  "/add", // 🔁 Change "/submit" to "/add" to match your form action
  utilities.checkLogin,
  utilities.handleErrors(reviewController.submitReview)
);

module.exports = router;
