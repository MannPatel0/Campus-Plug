const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "Marketplace",
  password: "12345678",
});

// const pool = mysql.createPool(
//   "singlestore://mann-619d0:<mann-619d0 Password>@svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com:3333/db_mann_48ba9?ssl={}",
// );

module.exports = pool.promise();
