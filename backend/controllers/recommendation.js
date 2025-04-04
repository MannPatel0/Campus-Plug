const db = require("../utils/database");

// TODO: Get the recommondaed product given the userID
exports.RecommondationByUserId = async (req, res) => {
  const { id } = req.body;
  try {
    const [data, fields] = await db.execute(
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
      JOIN Recommendation R  ON P.ProductID = R.RecommendedProductID
      Where R.UserID = ?;`,
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
