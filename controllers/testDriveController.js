// controllers/testDriveController.js
const utilities = require("../utilities");
const invModel = require("../models/inventory-model");

const testDriveController = {};

// Show the form
testDriveController.showForm = async (req, res) => {
  const nav = await utilities.getNav();
  const inv_id = req.params.inv_id;

  try {
    const vehicle = await invModel.getInventoryById(inv_id);
    if (!vehicle) {
      req.flash("notice", "Vehicle not found.");
      return res.redirect("/");
    }

    res.render("testdrive/form", {
      title: `Schedule Test Drive - ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      flash: res.locals.flash,
    });
  } catch (error) {
    console.error("Error loading test drive form:", error);
    req.flash("notice", "An unexpected error occurred.");
    res.redirect("/");
  }
};

// Handle form submission
testDriveController.submitForm = async (req, res) => {
  const { inv_id } = req.body;
  req.flash("notice", "✅ Thank you! We’ll reach out to you soon to schedule your test drive.");
  res.redirect(`/inv/detail/${inv_id}`);
};

module.exports = testDriveController;
