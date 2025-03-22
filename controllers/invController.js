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

module.exports = invCont;
