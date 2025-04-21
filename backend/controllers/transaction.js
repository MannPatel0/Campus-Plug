const db = require("../utils/database");

exports.getTransactionWithPagination = async (req, res) => {
  const limit = +req.query?.limit;
  const page = +req.query?.page;
  const offset = (page - 1) * limit;
  try {
    const [data, _] = await db.execute(
      `SELECT T.TransactionID, DATE_FORMAT(T.Date, '%b-%d-%Y %h:%i %p') as Date, T.PaymentStatus, U.Name as UserName, P.Name as ProductName
			      FROM Transaction T
			      LEFT JOIN User U ON T.UserID = U.UserID
            LEFT JOIN Product P ON T.ProductID = P.ProductID
            ORDER BY T.TransactionID ASC LIMIT ? OFFSET ?`,
      [limit.toString(), offset.toString()],
    );

    const [result] = await db.execute(
      "SELECT COUNT(*) AS count FROM Transaction",
    );
    const { count: total } = result[0];
    return res.json({ data, total });
  } catch (error) {
    res.json({ error: "Cannot fetch transactions from database!" });
  }
};

exports.removeTransation = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      "DELETE FROM Transaction WHERE TransactionID = ?;",
      [id.toString()],
    );
    return res.json({ message: "Remove transaction successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Cannot remove transactions from database!" });
  }
};
// Create a new transaction
exports.createTransaction = async (req, res) => {
  const { userID, productID, date, paymentStatus } = req.body;

  try {
    // Check if the transaction already exists for the same user and product
    const [existingTransaction] = await db.execute(
      `SELECT TransactionID FROM Transaction WHERE UserID = ? AND ProductID = ?`,
      [userID, productID],
    );

    if (existingTransaction.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Transaction already exists for this user and product",
      });
    }

    // Format the date
    const formattedDate = new Date(date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Insert the new transaction
    const [result] = await db.execute(
      `INSERT INTO Transaction (UserID, ProductID, Date, PaymentStatus)
       VALUES (?, ?, ?, ?)`,
      [userID, productID, formattedDate, paymentStatus],
    );

    res.json({
      success: true,
      message: "Transaction created successfully",
      transactionID: result.insertId,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Could not create transaction" });
  }
};

// Get all transactions for a given product
exports.getTransactionsByProduct = async (req, res) => {
  const { productID } = req.params;

  try {
    const [transactions] = await db.execute(
      `SELECT
         T.TransactionID,
         T.UserID,
         T.ProductID,
         T.Date,
         T.PaymentStatus,
         P.Name AS ProductName,
         MIN(I.URL) AS Image_URL
       FROM Transaction T
       JOIN Product P ON T.ProductID = P.ProductID
       LEFT JOIN Image_URL I ON P.ProductID = I.ProductID
       GROUP BY T.TransactionID, T.UserID, T.ProductID, T.Date, T.PaymentStatus, P.Name`,
    );

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions by product:", error);
    res.status(500).json({ error: "Could not retrieve transactions" });
  }
};

// Get all transactions for a given user
exports.getTransactionsByUser = async (req, res) => {
  const { userID } = req.body;

  try {
    const [transactions] = await db.execute(
      `SELECT
         T.TransactionID,
         T.UserID,
         T.ProductID,
         T.Date,
         T.PaymentStatus,
         P.Name AS ProductName,
         I.URL AS Image_URL
       FROM Transaction T
       JOIN Product P ON T.ProductID = P.ProductID
       LEFT JOIN Image_URL I ON P.ProductID = I.ProductID
       WHERE T.UserID = ?`,
      [userID],
    );

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions by user:", error);
    res.status(500).json({ error: "Could not retrieve transactions" });
  }
};

// Get all transactions in the system
exports.getAllTransactions = async (req, res) => {
  try {
    const [transactions] = await db.execute(
      `SELECT
         T.TransactionID,
         T.UserID,
         T.ProductID,
         T.Date,
         T.PaymentStatus,
         P.Name AS ProductName,
         MIN(I.URL) AS Image_URL
       FROM Transaction T
       JOIN Product P ON T.ProductID = P.ProductID
       LEFT JOIN Image_URL I ON P.ProductID = I.ProductID
       GROUP BY T.TransactionID, T.UserID, T.ProductID, T.Date, T.PaymentStatus, P.Name`,
    );

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(500).json({ error: "Could not retrieve transactions" });
  }
};

// Update the payment status of a transaction
exports.updatePaymentStatus = async (req, res) => {
  const { transactionID, paymentStatus } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE Transaction
       SET PaymentStatus = ?
       WHERE TransactionID = ?`,
      [paymentStatus, transactionID],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    res.json({
      success: true,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Could not update payment status" });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { transactionID } = req.body;

  try {
    const [result] = await db.execute(
      `DELETE FROM Transaction
       WHERE TransactionID = ?`,
      [transactionID],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Could not delete transaction" });
  }
};
