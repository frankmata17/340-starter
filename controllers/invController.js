const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const reviewModel = require("../models/review-model");

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
    const inv_id = req.params.vehicleId;
    const vehicle = await invModel.getInventoryById(inv_id);
    const reviews = await reviewModel.getReviewsByVehicleId(inv_id); // <-- new line

    if (!vehicle) {
      return res.status(404).render("error", { title: "Not Found", message: "Vehicle not found." });
    }

    let nav = await utilities.getNav();
    res.render("./inventory/vehicleDetail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      reviews,
      loggedin: res.locals.loggedin,
      account_id: res.locals.accountData?.account_id,
    });
  } catch (error) {
    console.error("Error rendering vehicle detail:", error);
    next(error);
  }
};

/* ***************************
 *  Deliver add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  });
};

/* ***************************
 *  Handle POST to insert classification
 * ************************** */
invCont.insertClassification = async function (req, res) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();
  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("notice", `Classification "${classification_name}" added successfully.`);
    const classificationList = await utilities.buildClassificationList();
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationList,
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

/* ***************************
 *  Show add-inventory form
 * ************************** */
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

/* ***************************
 *  Handle POST to insert inventory
 * ************************** */
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
    const updatedClassificationList = await utilities.buildClassificationList();
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationList: updatedClassificationList,
      errors: null
    });
  } else {
    req.flash("notice", "Failed to add inventory item.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...req.body
    });
  }
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const messages = req.flash();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    errors: null,
    messages: req.flash(),
  });
};

/* ***************************
 *  Return inventory by classification as JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData.length > 0 && invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationList = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

/* ***************************
 *  Process inventory update
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;

  const updateResult = await invModel.updateInventoryItem(
    inv_id, classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_miles, inv_color
  );

  if (updateResult) {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};

/* ***************************
 *  Trigger intentional error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  try {
    throw new Error("Intentional Server Error! Testing error handling.");
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
