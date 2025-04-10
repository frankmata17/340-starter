const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const utilities = require("../utilities");

// Ensure logged-in
router.post("/buy", utilities.checkLogin, utilities.handleErrors(vehicleController.handleBuyNow));
router.post("/test-drive", utilities.checkLogin, utilities.handleErrors(vehicleController.handleTestDrive));

module.exports = router;
