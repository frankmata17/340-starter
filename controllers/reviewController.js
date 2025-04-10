const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

const reviewController = {};

/* ***************************
 * Submit a Review (with Rating)
 * ************************** */
reviewController.submitReview = async function (req, res) {
  const inv_id = parseInt(req.body.inv_id);
  const account_id = parseInt(req.body.account_id);
  const review_text = req.body.review_text;
  const review_rating = parseInt(req.body.review_rating);
  const nav = await utilities.getNav();

  try {
    const result = await reviewModel.addReview(inv_id, account_id, review_text, review_rating);
    if (result) {
      req.flash("notice", "✅ Review submitted successfully!");
    } else {
      req.flash("notice", "⚠️ Review submission failed. Please try again.");
    }
  } catch (error) {
    console.error("Submit review error:", error);
    req.flash("notice", "❌ An error occurred while submitting the review.");
  }

  res.redirect(`/inv/detail/${inv_id}`);
};

/* ***************************
 * Get Reviews for a Vehicle
 * (Used to fetch reviews for a vehicle detail view)
 * ************************** */
reviewController.getReviewsByVehicle = async function (inv_id) {
  try {
    const reviews = await reviewModel.getReviewsByVehicleId(inv_id);
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

module.exports = reviewController;
