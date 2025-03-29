const { body, validationResult } = require("express-validator");
const utilities = require(".");

const invValidate = {};

invValidate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
    body("inv_description").trim().notEmpty().withMessage("Description required."),
    body("inv_image").trim().notEmpty().withMessage("Image path required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Enter valid price."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Enter valid mileage."),
    body("inv_color").trim().notEmpty().withMessage("Color required."),
    body("classification_id").isInt().withMessage("Classification is required.")
  ];
};

invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body
    });
  }
  next();
};

module.exports = invValidate;
