const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const classValidate = require("../utilities/classification-validation");
const invValidate = require("../utilities/inventory-validation");
const checkAccountType = require("../middleware/checkAccountType");

// Public Routes
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:vehicleId", invController.renderVehicleDetail);

// Protected Routes (Admin or Employee)
router.get(
  "/add-classification",
  utilities.checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

router.get(
  "/add-inventory",
  utilities.checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
);

router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/",
  utilities.checkLogin,
  checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
);

// POST: Add Classification
router.post(
  "/add-classification",
  utilities.checkLogin,
  checkAccountType,
  classValidate.classificationRules(),
  classValidate.checkClassData,
  utilities.handleErrors(invController.insertClassification)
);

// POST: Add Inventory
router.post(
  "/add-inventory",
  utilities.checkLogin,
  checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.insertInventory)
);

// POST: Update Inventory
router.post(
  "/update",
  utilities.checkLogin,
  checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventoryItem)
);

module.exports = router;
