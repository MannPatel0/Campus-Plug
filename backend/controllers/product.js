const db = require("../utils/database");

exports.addProduct = async (req, res) => {
  const { userID, name, price, qty, description, category, images } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO Product (Name, Price, StockQuantity, UserID, Description, CategoryID) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, price, qty, userID, description, category]
    );

    const productID = result.insertId;
    if (images && images.length > 0) {
      const imageInsertPromises = images.map((imagePath) =>
        db.execute(`INSERT INTO Image_URL (URL, ProductID) VALUES (?, ?)`, [
          imagePath,
          productID,
        ])
      );

      await Promise.all(imageInsertPromises); //perallel
    }

    res.json({
      success: true,
      message: "Product and images added successfully",
    });
  } catch (error) {
    console.error("Error adding product or images:", error);
    console.log(error);
    return res.json({ error: "Could not add product or images" });
  }
};

exports.addFavorite = async (req, res) => {
  const { userID, productID } = req.body;
  console.log(userID);
  try {
    // Use parameterized query to prevent SQL injection
    const [result] = await db.execute(
      `INSERT INTO Favorites (UserID, ProductID) VALUES (?, ?)`,
      [userID, productID]
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

exports.removeFavorite = async (req, res) => {
  const { userID, productID } = req.body;
  console.log(userID);
  try {
    // Use parameterized query to prevent SQL injection
    const [result] = await db.execute(
      `DELETE FROM Favorites WHERE UserID = ? AND ProductID = ?`,
      [userID, productID]
    );

    res.json({
      success: true,
      message: "Product removed from favorites successfully",
    });
  } catch (error) {
    console.error("Error removing favorite product:", error);
    return res.json({ error: "Could not remove favorite product" });
  }
};

exports.getFavorites = async (req, res) => {
  const { userID } = req.body;

  try {
    const [favorites] = await db.execute(
      `
      SELECT
      p.ProductID,
      p.Name,
      p.Description,
      p.Price,
      p.CategoryID,
      p.UserID,
      p.Date,
      u.Name AS SellerName,
      MIN(i.URL) AS image_url
  FROM Favorites f
  JOIN Product p ON f.ProductID = p.ProductID
  JOIN User u ON p.UserID = u.UserID
  LEFT JOIN Image_URL i ON p.ProductID = i.ProductID
  WHERE f.UserID = ?
  GROUP BY
      p.ProductID,
      p.Name,
      p.Description,
      p.Price,
      p.CategoryID,
      p.UserID,
      p.Date,
      u.Name;
      `,
      [userID]
    );

    res.json({
      success: true,
      favorites: favorites,
    });
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).json({ error: "Could not retrieve favorite products" });
  }
};

// Get all products along with their image URLs
exports.getAllProducts = async (req, res) => {
  try {
    const [data, fields] = await db.execute(`
      SELECT
    P.ProductID,
    P.Name AS ProductName,
    P.Price,
    P.Date AS DateUploaded,
    U.Name AS SellerName,
    MIN(I.URL) AS ProductImage,
    C.Name AS Category
FROM Product P
JOIN Image_URL I ON P.ProductID = I.ProductID
JOIN User U ON P.UserID = U.UserID
JOIN Category C ON P.CategoryID = C.CategoryID
GROUP BY
    P.ProductID,
    P.Name,
    P.Price,
    P.Date,
    U.Name,
    C.Name;
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

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  console.log("Received Product ID:", id);

  try {
    const [data] = await db.execute(
      `
      SELECT p.*,U.Name AS SellerName,U.Email as SellerEmail,U.Phone as SellerPhone, i.URL AS image_url
      FROM Product p
      LEFT JOIN Image_URL i ON p.ProductID = i.ProductID
      JOIN User U ON p.UserID = U.UserID
      WHERE p.ProductID = ?
    `,
      [id]
    );

    // Log raw data for debugging
    console.log("Raw Database Result:", data);

    if (data.length === 0) {
      console.log("No product found with ID:", id);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Collect all image URLs
    const images = data
      .map((row) => row.image_url)
      .filter((url) => url !== null);

    // Create product object with all details from first row and collected images
    const product = {
      ...data[0], // Base product details
      images: images, // Collected image URLs
    };

    // Log processed product for debugging
    console.log("Processed Product:", product);

    res.json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Full Error Details:", error);
    return res.status(500).json({
      success: false,
      message: "Database error occurred",
      error: error.message,
    });
  }
};

exports.getProductWithPagination = async (req, res) => {
  const limit = +req.query.limit;
  const page = +req.query.page;

  const offset = (page - 1) * limit;

  try {
    const [data, fields] = await db.execute(
      `
          SELECT
        P.ProductID,
        P.Name AS ProductName,
        P.Price,
        P.Date AS DateUploaded,
        U.Name AS SellerName,
        MIN(I.URL) AS ProductImage,
        C.Name AS Category
      FROM Product P
      LEFT JOIN Image_URL I ON P.ProductID = I.ProductID
      LEFT JOIN User U ON P.UserID = U.UserID
      LEFT JOIN Category C ON P.CategoryID = C.CategoryID
      GROUP BY
        P.ProductID,
        P.Name,
        P.Price,
        P.Date,
        U.Name,
        C.Name
      ORDER BY P.ProductID ASC
      LIMIT ? OFFSET ?
    `,
      [limit.toString(), offset.toString()]
    );

    const [result] = await db.execute(
      `SELECT COUNT(*) AS totalProd FROM Product`
    );
    const { totalProd } = result[0];

    return res.json({ totalProd, products: data });
  } catch (error) {
    res.json({ error: "Error fetching products!" });
  }
};

exports.removeProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      `DELETE FROM Product WHERE ProductID = ?`,
      [id]
    );
    res.json({ message: "Delete product successfully!" });
  } catch (error) {
    res.json({ error: "Cannot remove product from database!" });
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
