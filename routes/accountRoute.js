const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");

// =============================
// GET Routes
// =============================

// Account dashboard
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountHome)
);

// Login view
router.get("/login", 
  utilities.handleErrors(accountController.showLogin)
);

// Registration view
router.get("/register", 
  utilities.handleErrors(accountController.showRegister)
);

// Account update view
router.get("/update/:accountId", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateView)
);

// Logout process
router.get("/logout", 
  utilities.handleErrors(accountController.logoutAccount)
);

// =============================
// POST Routes
// =============================

// Process registration
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process login
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
);

// Process account information update
router.post(
  "/update",
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdatedData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password update
router.post(
  "/update-password",
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
