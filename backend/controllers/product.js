const db = require("../utils/database");

exports.addToFavorite = async (req, res) => {
  const { userID, productsID } = req.body;

  try {
    // Use parameterized query to prevent SQL injection
    const [result] = await db.execute(
      "INSERT INTO Favorites (UserID, ProductID) VALUES (?, ?)",
      [userID, productsID]
    );

    res.json({
      success: true,
      message: "Product added to favorites successfully",
    });
  } catch (error) {
    console.error("Error adding favorite product:", error);
    return res.json({ error: "Could not add favorite product" });
  }
};

//Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const [data, fields] = await db.execute("SELECT * FROM Product");

    res.json({
      success: true,
      message: "Product added to favorites successfully",
      data,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({
      found: false,
      error: "Database error occurred",
    });
  }
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
