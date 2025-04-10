const utilities = require("../utilities");
const inventoryModel = require("../models/inventory-model");

const testDriveController = {};

testDriveController.showForm = async (req, res) => {
  const inv_id = parseInt(req.params.inv_id);
  const vehicle = await inventoryModel.getInventoryById(inv_id);
  const nav = await utilities.getNav();

  res.render("test-drive/form", {
    title: "Schedule Test Drive",
    nav,
    vehicle,
  });
};

testDriveController.submitForm = async (req, res) => {
  // Just log or flash success for now
  req.flash("notice", "✅ Test drive scheduled successfully!");
  res.redirect("/");
};

module.exports = testDriveController;
