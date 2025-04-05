const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *`;
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Get account by email (secure select)
 * *************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT 
        account_id, 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_type, 
        account_password 
      FROM account 
      WHERE account_email = $1`,
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 *   Check for existing email
 * *************************** */
async function checkExistingEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rowCount;
  } catch (error) {
    console.error("checkExistingEmail error:", error);
    return new Error("Error checking for existing email");
  }
}

async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1";
    const data = await pool.query(sql, [account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getAccountById error:", error);
    throw error;
  }
}

async function updateAccountInfo(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4`;
    const data = await pool.query(sql, [firstname, lastname, email, account_id]);
    return data.rowCount;
  } catch (error) {
    console.error("updateAccountInfo error:", error);
    throw error;
  }
}

async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2`;
    const data = await pool.query(sql, [hashedPassword, account_id]);
    return data.rowCount;
  } catch (error) {
    console.error("updatePassword error:", error);
    throw error;
  }
}


module.exports = {
  registerAccount,
  getAccountByEmail,
  checkExistingEmail,
  getAccountById,
  updateAccountInfo,
  updatePassword
};
