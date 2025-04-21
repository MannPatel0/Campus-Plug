const db = require("../utils/database");

// TODO: Get the recommondaed product given the userID
exports.RecommondationByUserId = async (req, res) => {
  const { id } = req.body;

  try {
    const [recommendation] = await db.execute(
      "select * from Recommendation where UserID = ? limit 1", [id]
    );
    if (recommendation.length === 0) {
      const [data] = await db.execute(
        `
    SELECT
      P.ProductID,
      P.Name AS ProductName,
      P.Price,
      P.Date AS DateUploaded,
      U.Name AS SellerName,
      I.URL AS ProductImage,
      C.Name AS Category
    FROM Product P
    JOIN Image_URL I ON P.ProductID = I.ProductID
    JOIN User U ON P.UserID = U.UserID
    JOIN Category C ON P.CategoryID = C.CategoryID
    JOIN (
      SELECT ProductID
      FROM Product
      ORDER BY RAND()
      LIMIT 5
    ) RandomProducts ON P.ProductID = RandomProducts.ProductID
    WHERE I.URL IS NOT NULL;
    `
      );

      console.log("Random products for new user:", data);
      return res.json({
        success: true,
        message: "Random products fetched for new user",
        data,
      });
    } else{
    const [data, fields] = await db.execute(
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
          JOIN Recommendation R ON P.ProductID = R.RecommendedProductID
          WHERE R.UserID = ?
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
  }
  } catch (error) {
    console.error("Error finding products:", error);
    return res.status(500).json({
      found: false,
      error: "Database error occurred",
    });
  }
};
