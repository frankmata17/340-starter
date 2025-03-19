const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * Determines whether to use SSL based on environment
 * *************** */

let pool;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });

  pool.on("connect", () => {
    console.log("✅ Connected to the database successfully!");
  });

  pool.on("error", (err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1); // Stop the app if database connection fails
  });

} catch (error) {
  console.error("❌ Error initializing database connection:", error);
  process.exit(1);
}

// Exporting query function for executing SQL commands
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("✅ Executed query:", text);
      return res;
    } catch (error) {
      console.error("❌ Query execution error:", { text, error });
      throw error;
    }
  },
};
