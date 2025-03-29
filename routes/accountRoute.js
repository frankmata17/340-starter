const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Show account dashboard
router.get("/", utilities.handleErrors(accountController.buildAccountHome));

// Show login view
router.get("/login", utilities.handleErrors(accountController.showLogin));

// Show registration view
router.get("/register", utilities.handleErrors(accountController.showRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process login data (already implemented)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
);

module.exports = router;
