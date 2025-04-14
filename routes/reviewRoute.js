const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");

// Submit a review
router.post(
  "/submit",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.submitReview)
);

// GET review edit form
router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.editReviewForm)
);

// Confirm delete review page (optional if using modal or inline)
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.confirmDeleteReview)
);

// POST to update review
router.post(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.updateReview)
);

// ✅ POST to delete review (keep just this one)
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;
