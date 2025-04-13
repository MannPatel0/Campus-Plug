const db = require("../utils/database");

exports.HistoryByUserId = async (req, res) => {
  const { id } = req.body;
  try {
    const [data] = await db.execute(
      `
      WITH RankedImages AS (
          SELECT
              P.ProductID,
              P.Name AS ProductName,
              P.Price,
              P.Date AS DateUploaded,
              U.Name AS SellerName,
              I.URL AS ProductImage,
              C.Name AS Category,
              ROW_NUMBER() OVER (PARTITION BY P.ProductID ORDER BY I.URL) AS RowNum
          FROM Product P
          JOIN Image_URL I ON P.ProductID = I.ProductID
          JOIN User U ON P.UserID = U.UserID
          JOIN Category C ON P.CategoryID = C.CategoryID
          JOIN History H ON H.ProductID = P.ProductID
          WHERE H.UserID = ?
      )
      SELECT
          ProductID,
          ProductName,
          Price,
          DateUploaded,
          SellerName,
          ProductImage,
          Category
      FROM RankedImages
      WHERE RowNum = 1;
      `,
      [id],
    );

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

exports.AddHistory = async (req, res) => {
  const { userID, productID } = req.body;
  console.log(userID);
  try {
    // Use parameterized query to prevent SQL injection
    const [result] = await db.execute(
      `INSERT INTO History (UserID, ProductID) VALUES (?, ?)`,
      [userID, productID],
    );

    res.json({
      success: true,
      message: "Product added to history successfully",
    });
  } catch (error) {
    console.error("Error adding favorite product:", error);
    return res.json({ error: "Could not add favorite product" });
  }
};

exports.DelHistory = async (req, res) => {
  const { userID, productID } = req.body;
  console.log(userID);
  try {
    // Use parameterized query to prevent SQL injection
    const [result] = await db.execute(`DELETE FROM History WHERE UserID=?`, [
      userID,
    ]);

    res.json({
      success: true,
      message: "Product deleted from History successfully",
    });
  } catch (error) {
    console.error("Error adding favorite product:", error);
    return res.json({ error: "Could not add favorite product" });
  }
};
