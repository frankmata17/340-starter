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

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById
};
