const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

const accountValidate = {};

/* **************
 * Registration Rules
 ************** */
accountValidate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email");
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

accountValidate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* **************
 * Login Rules
 ************** */
accountValidate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

accountValidate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    });
    return;
  }
  next();
};

/* **************
 * Update Account Info Rules
 ************** */
accountValidate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail().withMessage("A valid email is required.")
      .normalizeEmail(),
  ];
};

accountValidate.checkUpdatedData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  if (!errors.isEmpty()) {
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
  next();
};

/* **************
 * Password Update Rules
 ************** */
accountValidate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password must be at least 12 characters long and include uppercase, lowercase, number, and symbol."),
  ];
};

accountValidate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const { account_id } = req.body;

  if (!errors.isEmpty()) {
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
    });
  }
  next();
};

module.exports = accountValidate;
