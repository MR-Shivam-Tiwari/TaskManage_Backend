const express = require("express");
const router = express.Router();
const pool = require("../db/database"); // Adjust the path accordingly

router.get("/test-database-connection", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Task LIMIT 1");
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
