const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(`
      SELECT * FROM public.classification
      ORDER BY classification_name
    `);
    return data;
  } catch (error) {
    console.error("getClassifications error:", error);
    throw error;
  }
}

/* ***************************
 *  Get inventory by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(`
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
    `, [classification_id]);

    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    throw error;
  }
}

/* ***************************
 *  Get vehicle details by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(`
      SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `, [inv_id]);

    return data.rows[0]; // Returns single vehicle or undefined
  } catch (error) {
    console.error("getVehicleById error:", error);
    throw error;
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount;
  } catch (error) {
    console.error("Error inserting classification:", error);
    return null;
  }
}

async function addInventoryItem(
  classification_id, inv_make, inv_model, inv_year,
  inv_description, inv_image, inv_thumbnail, inv_price,
  inv_miles, inv_color
) {
  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, inv_year,
        inv_description, inv_image, inv_thumbnail, inv_price,
        inv_miles, inv_color
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `;
    const data = await pool.query(sql, [
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail, inv_price,
      inv_miles, inv_color
    ]);
    return data.rowCount;
  } catch (error) {
    console.error("insert inventory error:", error);
    return null;
  }
}

/* ***************************
 * Get inventory item by ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = "SELECT * FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0]; // Return the single row (object)
  } catch (error) {
    console.error("getInventoryById error:", error);
    throw error;
  }
}

async function updateInventoryItem(
  inv_id, classification_id, inv_make, inv_model, inv_year,
  inv_description, inv_image, inv_thumbnail, inv_price,
  inv_miles, inv_color
) {
  try {
    const sql = `
      UPDATE inventory
      SET classification_id = $1,
          inv_make = $2,
          inv_model = $3,
          inv_year = $4,
          inv_description = $5,
          inv_image = $6,
          inv_thumbnail = $7,
          inv_price = $8,
          inv_miles = $9,
          inv_color = $10
      WHERE inv_id = $11
    `;
    const data = await pool.query(sql, [
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail, inv_price,
      inv_miles, inv_color, inv_id
    ]);
    return data.rowCount;
  } catch (error) {
    console.error("updateInventoryItem error:", error);
    throw error;
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventoryItem,
  getInventoryById,
  updateInventoryItem
};
