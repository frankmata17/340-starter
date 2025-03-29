const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

const accountController = {};

// My Account dashboard
accountController.buildAccountHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("account/account", {
    title: "My Account",
    nav,
    errors: null,
  });
};

// login form
accountController.showLogin = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
};

// registration form
accountController.showRegister = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null, // ✅ Prevents EJS from breaking when no validation errors yet
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
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
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Process Login
 * *************************************** */
accountController.loginAccount = async function (req, res) {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "No account found with that email.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);

    if (passwordMatch) {
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`);
      res.status(200).render("account/account", {
        title: "My Account",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Incorrect password.");
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
};

module.exports = accountController;
