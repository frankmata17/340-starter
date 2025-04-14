/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* **********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();

const session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");
const pool = require("./database/");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const static = require("./routes/static");
const baseController = require("./controllers/baseControllers");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities");
const reviewRoute = require("./routes/reviewRoute");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Middleware
 *************************/

// Middleware to log all incoming requests (for debugging purposes)
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Flash middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = {
    notice: req.flash("notice"),
    error: req.flash("error"),
  };
  next();
});


// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());


// Set login status and account info for views
app.use(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.locals.loggedin = true;
      res.locals.accountData = decoded;
    } catch (err) {
      res.locals.loggedin = false;
      res.locals.accountData = null;
    }
  } else {
    res.locals.loggedin = false;
    res.locals.accountData = null;
  }
  next();
});

// ✅ JWT token validation middleware
app.use(utilities.checkJWTToken);

/* ***********************
 * Routes
 *************************/

// Static assets route
app.use(static);

// Index route (Home page)
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes (prefix is '/inv')
app.use("/inv", inventoryRoute);

// Account routes (prefix is '/account')
app.use("/account", accountRoute);

// Reviews
const reviewsRoute = require("./routes/reviewRoute");
app.use("/reviews", reviewRoute);

// Vehicle Route
const vehicleRoute = require("./routes/vehicleRoute");
app.use("/vehicles", vehicleRoute);

// Test Drive Route
const testDriveRoute = require("./routes/testDriveRoute");
app.use("/test-drive", testDriveRoute);

// Reviews
app.use("/reviews", reviewRoute);

/* ***********************
 * 404 Error Route
 *************************/
app.use(async (req, res, next) => {
  let nav = await utilities.getNav();
  const error = new Error("Oops! The page you're looking for doesn't exist.");
  error.status = 404;

  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: error.message,
    nav,
  });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
