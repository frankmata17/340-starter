const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const classValidate = require("../utilities/classification-validation");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display a specific vehicle detail view
router.get("/detail/:vehicleId", invController.renderVehicleDetail);

// 500 error
router.get("/trigger-error", invController.triggerError);

// Route to deliver the add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// GET form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to handle form submission
router.post(
  "/add-classification",
  classValidate.classificationRules(),
  classValidate.checkClassData,
  utilities.handleErrors(invController.insertClassification)
);

// POST form
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.insertInventory)
  );

module.exports = router;
