const pool = require("../database");

/* ***************************
 *  Add a new review (with star rating)
 * ************************** */
async function addReview(inv_id, account_id, review_text, review_rating) {
  try {
    const sql = `
      INSERT INTO review (inv_id, account_id, review_text, review_rating)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const data = await pool.query(sql, [inv_id, account_id, review_text, review_rating]);
    return data.rows[0];
  } catch (error) {
    console.error("addReview error:", error);
    throw error;
  }
}

/* ***************************
 *  Get reviews for a specific vehicle
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_text, r.review_rating, r.review_date, a.account_firstname, a.account_lastname
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC;
    `;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("getReviewsByInvId error:", error);
    throw error;
  }
}

/* ***************************
 *  Get all reviews by an account
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model
      FROM review r
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC;
    `;
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    console.error("getReviewsByAccountId error:", error);
    throw error;
  }
}

/* ***************************
 *  Get reviews by vehicle ID
 * ************************** */
async function getReviewsByVehicleId(inv_id) {
  try {
    const sql = `
      SELECT r.review_text, r.review_rating, r.review_date, a.account_firstname
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC;
    `;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("getReviewsByVehicleId error:", error);
    throw error;
  }
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getReviewsByAccountId,
  getReviewsByVehicleId
};
