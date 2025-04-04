const db = require("../utils/database");

// TODO: Get the recommondaed product given the userID
exports.RecommondationByUserId = async (req, res) => {
  const { id } = req.body;
  try {
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
  } catch (error) {
    console.error("Error finding products:", error);
    return res.status(500).json({
      found: false,
      error: "Database error occurred",
    });
  }
};

// Add this to your existing controller file
exports.submitReview = async (req, res) => {
  const { productId, reviewerName, rating, comment } = req.body;

  // Validate required fields
  if (!productId || !reviewerName || !rating || !comment) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Insert the review into the database
    const [result] = await db.execute(
      `
      INSERT INTO Review (
        ProductID,
        ReviewerName,
        Rating,
        Comment,
        ReviewDate
      ) VALUES (?, ?, ?, ?, NOW())
      `,
      [productId, reviewerName, rating, comment],
    );

    // Get the inserted review id
    const reviewId = result.insertId;

    // Fetch the newly created review to return to client
    const [newReview] = await db.execute(
      `
      SELECT
        ReviewID as id,
        ProductID,
        ReviewerName,
        Rating,
        Comment,
        ReviewDate
      FROM Review
      WHERE ReviewID = ?
      `,
      [reviewId],
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: newReview[0],
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({
      success: false,
      message: "Database error occurred",
      error: error.message,
    });
  }
};
