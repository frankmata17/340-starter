const utilities = require("../utilities");

const vehicleController = {};

// Buy Now Handler
vehicleController.handleBuyNow = async function (req, res) {
  const { inv_id, account_id } = req.body;
  const nav = await utilities.getNav();

  req.flash("notice", "🚗 Thanks for your interest! Our sales team will contact you shortly about your purchase.");
  res.redirect(`/inv/detail/${inv_id}`);
};

// Schedule Test Drive Handler
vehicleController.handleTestDrive = async function (req, res) {
  const { inv_id, account_id } = req.body;
  const nav = await utilities.getNav();

  req.flash("notice", "📅 Your test drive request has been submitted. We'll follow up with scheduling info.");
  res.redirect(`/inv/detail/${inv_id}`);
};

module.exports = vehicleController;
