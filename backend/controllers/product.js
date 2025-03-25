const db = require("../utils/database");

exports.addToFavorite = async (req, res) => {
  const { userID, productsID } = req.body;

  try {
    // Use parameterized query to prevent SQL injection
    const [result] = await db.execute(
      "INSERT INTO Favorites (UserID, ProductID) VALUES (?, ?)",
      [userID, productsID],
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

// Get all products along with their image URLs
exports.getAllProducts = async (req, res) => {
  try {
    const [data, fields] = await db.execute(`
      SELECT p.*, i.URL
      FROM Product p
      LEFT JOIN Image_URL i ON p.ProductID = i.ProductID
    `);

    res.json({
      success: true,
      message: "Products fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error finding products:", error);
    return res.status(500).json({
      found: false,
      error: "Database error occurred",
    });
  }
};

// Get a single product by ID along with image URLs
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const [data] = await db.execute(
      `
      SELECT p.*, i.URL AS image_url
      FROM Product p
      LEFT JOIN Image_URL i ON p.ProductID = i.ProductID
      WHERE p.ProductID = ?
    `,
      [id],
    );

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Assuming that `data` contains product information and the image URLs
    const product = {
      ...data[0], // First product found in the query
      images: data.map((image) => image.image_url), // Collect all image URLs into an array
    };

    res.json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
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
