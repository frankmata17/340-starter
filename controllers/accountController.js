const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountController = {};

/* ***************************
 * Account Dashboard
 * ************************** */
accountController.buildAccountHome = async function (req, res) {
  const nav = await utilities.getNav();
  const accountData = res.locals.accountData;
  res.render("account/account", {
    title: "My Account",
    nav,
    errors: null,
    accountData,
  });
};

/* ***************************
 * Login View
 * ************************** */
accountController.showLogin = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
  });
};

/* ***************************
 * Registration View
 * ************************** */
accountController.showRegister = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
};

/* ***************************
 * Process Registration
 * ************************** */
accountController.registerAccount = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `🎉 Congratulations, you're registered ${account_firstname}!`);
      return res.redirect("/account/login"); // ✅ Redirect so flash message is shown
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
};


/* ***************************
 * Process Login
 * ************************** */
accountController.loginAccount = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);

    if (passwordMatch) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600,
      });

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000,
        secure: process.env.NODE_ENV !== "development"
      });

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Incorrect password.");
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
};

/* ***************************
 * Logout and Clear Cookie
 * ************************** */
accountController.logoutAccount = async function (req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have successfully logged out.");
  res.redirect("/");
};

/* ***************************
 * Build Update View
 * ************************** */
accountController.buildUpdateView = async function (req, res) {
  const account_id = parseInt(req.params.accountId);
  const nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  });
};

/* ***************************
 * Process Account Info Update
 * ************************** */
accountController.updateAccount = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accountModel.updateAccountInfo(
    account_id, account_firstname, account_lastname, account_email
  );

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.");
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/account", {
      title: "Account Management",
      nav,
      accountData,
    });
  } else {
    req.flash("notice", "Update failed.");
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }
};

/* ***************************
 * Process Password Update
 * ************************** */
accountController.updatePassword = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  const hashedPassword = await bcrypt.hash(account_password, 10);
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("notice", "Password updated successfully.");
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/account", {
      title: "Account Management",
      nav,
      accountData,
    });
  } else {
    req.flash("notice", "Password update failed.");
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id
    });
  }
};

module.exports = accountController;
