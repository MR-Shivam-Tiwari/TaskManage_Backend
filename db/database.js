const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "8080",
  host: "localhost",
  port: 5432,
  database: "TaskManage",
});

module.exports = pool;
