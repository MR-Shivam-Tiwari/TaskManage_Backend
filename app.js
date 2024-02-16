const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "8080",
  host: "localhost",
  port: 5432,
  database: "TaskManage",
});

app.use(cors());
app.use(express.json());

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Task");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new task
app.post("/api/tasks", async (req, res) => {
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

// Establish the database connection
pool.connect(function (err) {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connected successfully!");
  }
});
// Update the task completion status
app.patch("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Task SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Internal Server Error");
  }
});

//Delete Task
app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM Task WHERE id = $1 RETURNING *", [taskId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update a task
// Update the task
app.put("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title, description, completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Task SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *",
      [title, description, completed, taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Internal Server Error");
  }
});




const port = 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
