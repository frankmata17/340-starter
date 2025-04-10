const express = require("express");
const router = new express.Router();
const testDriveController = require("../controllers/testDriveController");
const utilities = require("../utilities");

router.get("/:inv_id", utilities.checkLogin, testDriveController.showForm);
router.post("/submit", utilities.checkLogin, testDriveController.submitForm);

module.exports = router;
