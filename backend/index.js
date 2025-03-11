import express, { json } from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(json());

//TODO: Connect with the database:
const db_con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "marketplace",
  enableKeepAlive: true, // false by default.
});

db_con.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

//TODO: Create a users:
app.post("/create_users", (req, res) => {
  const data = req.body;
  db_con.query(
    `INSERT INTO Users (Name, Email, UCID, Password, Phone, Address)
    VALUES ('${data.name}', '${data.email}', '${data.UCID}', '${data.password}', '${data.phone}', '${data.address}');`,
  );
  db_con.query(
    `INSERT INTO UserRole (Role)
    VALUES ('${data.role}');`,
  );
  console.log(data);
  res.send();
});

//TODO: Fetch all users data:
app.get("/fetch_all_users", (req, res) => {
  db_con.query("SELECT * FROM Users;", (err, data) => {
    if (err) {
      console.error("Errors: ", err);
      return res.status(500).json({ error: "\nCould not fetch users!" });
    }
    res.json({ Users: data });
  });
});

//TODO: Fetch One user Data:
//TODO: Update A uses Data:
//TODO: Delete A uses Data:

app.listen(3030, () => {
  console.log("Running Backend on http://localhost:3030/");
});
