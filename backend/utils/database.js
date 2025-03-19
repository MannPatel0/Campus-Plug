const mysql = require("mysql2");

//Create a pool of connection to allow multiple query happen at the same time
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "marketplace",
  password: "12345678",
});

module.exports = pool.promise();
