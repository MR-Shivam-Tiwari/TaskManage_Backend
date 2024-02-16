const express = require("express");
const router = express.Router();
const pool = require("../db/database");





// Get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Task");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/tasks", async (req, res) => {
    const { title, description, completed } = req.body;
    console.log("Received data:", { title, description, completed });
  
    try {
      const result = await pool.query(
        "INSERT INTO Task (title, description, completed) VALUES ($1, $2, $3) RETURNING *",
        [title, description, completed]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  

// Add more routes for updating and deleting tasks if needed

module.exports = router;
