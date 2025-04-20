const db = require("../utils/database");

/**
 * Get reviews for a specific product
 * Returns both reviews for the product and reviews by the product owner for other products
 */
exports.getReviews = async (req, res) => {
  const { id } = req.params;
  console.log("Received Product ID:", id);

  try {
    // First query: Get reviews for this specific product
    const [productReviews] = await db.execute(
      `SELECT
          R.ReviewID,
          R.UserID,
          R.ProductID,
          R.Comment,
          R.Rating,
          R.Date AS ReviewDate,
          U.Name AS ReviewerName,
          P.Name AS ProductName,
          'product' AS ReviewType
      FROM Review R
      JOIN User U ON R.UserID = U.UserID
      JOIN Product P ON R.ProductID = P.ProductID
      WHERE R.ProductID = ?`,
      [id],
    );

    // // Second query: Get reviews written by the product owner for other products
    // const [sellerReviews] = await db.execute(
    //   `SELECT
    //       R.ReviewID,
    //       R.UserID,
    //       R.ProductID,
    //       R.Comment,
    //       R.Rating,
    //       R.Date AS ReviewDate,
    //       U.Name AS ReviewerName,
    //       P.Name AS ProductName,
    //       'seller' AS ReviewType
    //   FROM Review R
    //   JOIN User U ON R.UserID = U.UserID
    //   JOIN Product P ON R.ProductID = P.ProductID
    //   WHERE R.UserID = (
    //       SELECT UserID
    //       FROM Product
    //       WHERE ProductID = ?
    //   )
    //   AND R.ProductID != ?`,
    //   [id, id],
    // );

    // Combine the results
    const combinedReviews = [...productReviews];

    // Log data for debugging
    console.log("Combined Reviews:", combinedReviews);

    res.json({
      success: true,
      message: "Reviews fetched successfully",
      data: combinedReviews,
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

/**
 * Submit a new review for a product
 */
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
    // Check if user has already reviewed this product
    const [existingReview] = await db.execute(
      `SELECT ReviewID FROM Review WHERE ProductID = ? AND UserID = ?`,
      [productId, userId],
    );

    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Check if user is trying to review their own product
    const [productOwner] = await db.execute(
      `SELECT UserID FROM Product WHERE ProductID = ?`,
      [productId],
    );

    if (productOwner.length > 0 && productOwner[0].UserID === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot review your own product",
      });
    }

    // Insert the review into the database
    const [result] = await db.execute(
      `INSERT INTO Review (
        ProductID,
        UserID,
        Rating,
        Comment,
        Date
      ) VALUES (?, ?, ?, ?, NOW())`,
      [productId, userId, rating, comment],
    );

    // Get the inserted review id
    const reviewId = result.insertId;

    // Fetch the newly created review to return to client
    const [newReview] = await db.execute(
      `SELECT
        R.ReviewID,
        R.ProductID,
        R.UserID,
        R.Rating,
        R.Comment,
        R.Date AS ReviewDate,
        U.Name AS ReviewerName,
        P.Name AS ProductName
      FROM Review R
      JOIN User U ON R.UserID = U.UserID
      JOIN Product P ON R.ProductID = P.ProductID
      WHERE R.ReviewID = ?`,
      [reviewId],
    );

    res.status(201).json({
      success: true, // Fixed from false to true
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

// /**
//  * Update an existing review
//  */
// exports.updateReview = async (req, res) => {
//   const { reviewId } = req.params;
//   const { rating, comment } = req.body;
//   const userId = req.body.userId; // Assuming you have middleware that validates the user

//   // Validate required fields
//   if (!reviewId || !rating || !comment) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required fields",
//     });
//   }

//   // Validate rating is between 1 and 5
//   if (rating < 1 || rating > 5) {
//     return res.status(400).json({
//       success: false,
//       message: "Rating must be between 1 and 5",
//     });
//   }

//   try {
//     // Check if review exists and belongs to the user
//     const [existingReview] = await db.execute(
//       `SELECT ReviewID, UserID FROM Review WHERE ReviewID = ?`,
//       [reviewId],
//     );

//     if (existingReview.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found",
//       });
//     }

//     if (existingReview[0].UserID !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: "You can only update your own reviews",
//       });
//     }

//     // Update the review
//     await db.execute(
//       `UPDATE Review
//        SET Rating = ?, Comment = ?, Date = NOW()
//        WHERE ReviewID = ?`,
//       [rating, comment, reviewId],
//     );

//     // Fetch the updated review
//     const [updatedReview] = await db.execute(
//       `SELECT
//         R.ReviewID,
//         R.ProductID,
//         R.UserID,
//         R.Rating,
//         R.Comment,
//         R.Date AS ReviewDate,
//         U.Name AS ReviewerName,
//         P.Name AS ProductName
//       FROM Review R
//       JOIN User U ON R.UserID = U.UserID
//       JOIN Product P ON R.ProductID = P.ProductID
//       WHERE R.ReviewID = ?`,
//       [reviewId],
//     );

//     res.json({
//       success: true,
//       message: "Review updated successfully",
//       data: updatedReview[0],
//     });
//   } catch (error) {
//     console.error("Error updating review:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Database error occurred",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Delete a review
//  */
// exports.deleteReview = async (req, res) => {
//   const { reviewId } = req.params;
//   const userId = req.body.userId; // Assuming you have middleware that validates the user

//   try {
//     // Check if review exists and belongs to the user
//     const [existingReview] = await db.execute(
//       `SELECT ReviewID, UserID FROM Review WHERE ReviewID = ?`,
//       [reviewId],
//     );

//     if (existingReview.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Review not found",
//       });
//     }

//     if (existingReview[0].UserID !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: "You can only delete your own reviews",
//       });
//     }

//     // Delete the review
//     await db.execute(`DELETE FROM Review WHERE ReviewID = ?`, [reviewId]);

//     res.json({
//       success: true,
//       message: "Review deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting review:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Database error occurred",
//       error: error.message,
//     });
//   }
// };
