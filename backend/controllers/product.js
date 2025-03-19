const db = require("../utils/database");

exports.addToFavorite = (req, res) => {
  const { userID, productsID } = req.body;

  // Use parameterized query to prevent SQL injection
  db.execute(
    "INSERT INTO Favorites (UserID, ProductID) VALUES (?, ?)",
    [userID, productsID],
    (err, result) => {
      if (err) {
        console.error("Error adding favorite product:", err);
        return res.json({ error: "Could not add favorite product" });
      }
      res.json({
        success: true,
        message: "Product added to favorites successfully",
      });
    }
  );
};

//Get all products
exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM Product";
  db.execute(query, (err, data) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({
        found: false,
        error: "Database error occurred",
      });
    }
    res.json({
      success: true,
      message: "Product added to favorites successfully",
      data,
    });
  });
};

// db_con.query(
//   "SELECT ProductID FROM product WHERE ProductID = ?",
//   [productID],
//   (err, results) => {
//     if (err) {
//       console.error("Error checking product:", err);
//       return res.json({ error: "Database error" });
//     }

//     if (results.length === 0) {
//       return res.json({ error: "Product does not exist" });
//     }
//   },
// );

// db_con.query(
//   "INSERT INTO Favorites (UserID, ProductID) VALUES (?, ?)",
//   [userID, productID],
//   (err, result) => {
//     if (err) {
//       console.error("Error adding favorite product:", err);
//       return res.json({ error: "Could not add favorite product" });
//     }
//     res.json({
//       success: true,
//       message: "Product added to favorites successfully",
//     });
//   },
// );
