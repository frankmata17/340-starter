const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data.length) {
      return res.status(404).render("error", { title: "Not Found", message: "No vehicles found for this classification." });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Render vehicle detail view
 * ************************** */
invCont.renderVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.vehicleId; // This matches /detail/:vehicleId in the route
    console.log("Vehicle ID requested:", inv_id);

    const vehicle = await invModel.getVehicleById(inv_id);

    if (!vehicle) {
      return res.status(404).render("error", { title: "Not Found", message: "Vehicle not found." });
    }

    let nav = await utilities.getNav();
    const vehicleHtml = utilities.buildVehicleDetail(vehicle);

    res.render("./inventory/vehicleDetail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
    });
  } catch (error) {
    console.error("Error rendering vehicle detail:", error);
    next(error);
  }
};

/* ***************************
 * Trigger Intentional Error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  try {
    // Throwing an intentional error
    throw new Error("Intentional Server Error! Testing error handling.");
  } catch (error) {
    next(error);
  }
};

// Deliver add-classification view
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  });
};

// Handle POST and insert into DB
invCont.insertClassification = async function (req, res) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("notice", `Classification "${classification_name}" added successfully.`);
    const newNav = await utilities.getNav(); // Refresh nav
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      errors: null
    });
  } else {
    req.flash("notice", "Failed to add classification.");
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    });
  }
};

// Show add-inventory form
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  });
};

// Handle inventory insertion
invCont.insertInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);
  const {
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_miles, inv_color
  } = req.body;

  const result = await invModel.addInventoryItem(
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_miles, inv_color
  );

  if (result) {
    req.flash("notice", `Inventory item "${inv_make} ${inv_model}" added successfully.`);
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    });
  } else {
    req.flash("notice", "Failed to add inventory item.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...req.body // sticky values
    });
  }
};

module.exports = invCont;
