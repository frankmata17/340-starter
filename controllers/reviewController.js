const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

const reviewController = {};

/* ***************************
 * Submit a Review
 * ************************** */
reviewController.submitReview = async function (req, res) {
  const { inv_id, account_id, review_text, review_rating } = req.body;
  const nav = await utilities.getNav();

  try {
    const result = await reviewModel.addReview(review_text, inv_id, account_id, review_rating);
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
 * Load review edit form
 * ************************** */
reviewController.editReviewForm = async function (req, res) {
  const review_id = parseInt(req.params.review_id);
  const nav = await utilities.getNav();

  try {
    const review = await reviewModel.getReviewById(review_id);
    if (!review) {
      req.flash("notice", "Review not found.");
      return res.redirect("/account");
    }

    res.render("reviews/edit-review", {
      title: "Edit Review",
      nav,
      review,
      flash: res.locals.flash
    });
  } catch (error) {
    console.error("Error loading review edit form:", error);
    req.flash("notice", "An error occurred.");
    res.redirect("/account");
  }
};

/* ***************************
 * Update a review
 * ************************** */
reviewController.updateReview = async function (req, res) {
  const { review_id, review_text, review_rating, inv_id } = req.body;
  const nav = await utilities.getNav();

  try {
    const result = await reviewModel.updateReview(review_id, review_text, review_rating);
    if (result) {
      req.flash("notice", "✅ Review updated successfully.");
    } else {
      req.flash("notice", "⚠️ Review update failed.");
    }
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("Review update error:", error);
    req.flash("notice", "❌ Error updating review.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
};

/* ***************************
 * Delete a review
 * ************************** */
reviewController.deleteReview = async function (req, res) {
  const review_id = parseInt(req.body.review_id);
  const inv_id = parseInt(req.body.inv_id); // ✅ Needed for redirect
  const nav = await utilities.getNav();

  try {
    const result = await reviewModel.deleteReview(review_id);

    if (result) {
      req.flash("notice", "✅ Review deleted successfully.");
    } else {
      req.flash("notice", "❌ Failed to delete the review.");
    }

    res.redirect(`/inv/detail/${inv_id}`); // ✅ Redirects to vehicle detail page
  } catch (error) {
    console.error("Delete review error:", error);
    req.flash("notice", "An error occurred while deleting the review.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
};

// Show Edit Form
reviewController.editReviewView = async function (req, res) {
  const review_id = parseInt(req.params.review_id);
  const nav = await utilities.getNav();

  try {
    const review = await reviewModel.getReviewById(review_id);

    if (!review) {
      req.flash("notice", "Review not found.");
      return res.redirect("/");
    }

    res.render("reviews/edit-review", {
      title: "Edit Review",
      nav,
      review,
      flash: res.locals.flash
    });
  } catch (error) {
    console.error("Edit review error:", error);
    req.flash("notice", "Error loading the review.");
    res.redirect("/");
  }
};

// Handle Review Update
reviewController.updateReview = async function (req, res) {
  const { review_id, review_text, review_rating, inv_id } = req.body;
  const nav = await utilities.getNav();

  try {
    const result = await reviewModel.updateReview(
      parseInt(review_id),
      review_text,
      parseInt(review_rating)
    );

    if (result) {
      req.flash("notice", "✅ Review updated successfully!");
    } else {
      req.flash("notice", "❌ Review update failed.");
    }

    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("Update review error:", error);
    req.flash("notice", "An error occurred while updating the review.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
};

// Confirm delete view
reviewController.confirmDeleteReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id);
  const nav = await utilities.getNav();

  try {
    const review = await reviewModel.getReviewById(review_id);

    if (!review) {
      req.flash("notice", "Review not found.");
      return res.redirect("/");
    }

    res.render("reviews/delete-review", {
      title: "Delete Review",
      nav,
      review,
      flash: res.locals.flash
    });
  } catch (error) {
    console.error("Error loading delete view:", error);
    req.flash("notice", "Could not load the delete page.");
    res.redirect("/");
  }
};

// Handle delete review
reviewController.deleteReview = async function (req, res) {
  const review_id = parseInt(req.body.review_id);
  const inv_id = parseInt(req.body.inv_id);
  const nav = await utilities.getNav();

  try {
    const result = await reviewModel.deleteReview(review_id);

    if (result) {
      req.flash("notice", "✅ Review deleted successfully.");
    } else {
      req.flash("notice", "❌ Failed to delete the review.");
    }

    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("Delete review error:", error);
    req.flash("notice", "An error occurred while deleting the review.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
};


module.exports = reviewController;
