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

const session = require("express-session")
const pool = require('./database/')

const static = require("./routes/static");
const baseController = require("./controllers/baseControllers");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities");
const bodyParser = require("body-parser")

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


app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * Routes
 *************************/

// Static assets route
app.use(static);

// Index route (Home page)
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes (prefix is '/inv')
app.use("/inv", inventoryRoute);

app.use("/account", accountRoute);


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
    nav
  });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message = (err.status == 404)
    ? err.message
    : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500; // Default fallback for port
const host = process.env.HOST || "localhost";

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
