const db = require("../utils/database");

exports.getreview = async (req, res) => {
  const { id } = req.params;
  console.log("Received Product ID:", id);

  try {
    const [data] = await db.execute(
      `
      SELECT
          R.ReviewID,
          R.UserID,
          R.ProductID,
          R.Comment,
          R.Rating,
          R.Date AS ReviewDate,
          U.Name AS ReviewerName,
          P.Name AS ProductName
      FROM Review R
      JOIN User U ON R.UserID = U.UserID
      JOIN Product P ON R.ProductID = P.ProductID
      WHERE R.ProductID = ?

      UNION

      SELECT
          R.ReviewID,
          R.UserID,
          R.ProductID,
          R.Comment,
          R.Rating,
          R.Date AS ReviewDate,
          U.Name AS ReviewerName,
          P.Name AS ProductName
      FROM Review R
      JOIN User U ON R.UserID = U.UserID
      JOIN Product P ON R.ProductID = P.ProductID
      WHERE P.UserID = (
          SELECT UserID
          FROM Product
          WHERE ProductID = ?
      )
        AND R.UserID != P.UserID;
    `,
      [id, id],
    );

    // Log raw data for debugging
    console.log("Raw Database Result:", data);

    console.log(data);
    res.json({
      success: true,
      message: "Products fetched successfully",
      data,
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

// Add this to your existing controller file
exports.submitReview = async (req, res) => {
  const { productId, userId, rating, comment } = req.body;

  // Validate required fields
  if (!productId || !userId || !rating || !comment) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // Validate rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    });
  }

  try {
    // Insert the review into the database
    const [result] = await db.execute(
      `
      INSERT INTO Review (
        ProductID,
        UserID,
        Rating,
        Comment
      ) VALUES (?, ?, ?, ?)
      `,
      [productId, userId, rating, comment],
    );

    // Get the inserted review id
    const reviewId = result.insertId;

    // Fetch the newly created review to return to client
    const [newReview] = await db.execute(
      `
      SELECT
        ReviewID as id,
        ProductID,
        UserID,
        Rating,
        Comment,
        Date as ReviewDate
      FROM Review
      WHERE ReviewID = ?
      `,
      [reviewId],
    );

    res.status(201).json({
      success: false,
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
