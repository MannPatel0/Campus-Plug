const db = require("../utils/database");

// TODO: Get the recommondaed product given the userID
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
          WHERE U.UserID = ?
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

    console.log(data);
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
