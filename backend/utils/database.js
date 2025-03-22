const mysql = require("mysql2");

//Create a pool of connections to allow multiple query happen at the same time
const pool = mysql.createPool({
  host: "marketplace-db.cpkkqmq065sx.ca-central-1.rds.amazonaws.com",
  user: "admin",
  password: "qizsYh-movpub-wuhdo2",
  database: "Marketplace",
  port: "3306",
});

//Export a promise for promise-based query
module.exports = pool.promise();
