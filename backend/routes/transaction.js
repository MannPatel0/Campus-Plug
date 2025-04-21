// routes/transaction.js
const express = require("express");
const {
  createTransaction,
  getTransactionsByProduct,
  getTransactionsByUser,
  getAllTransactions,
  updatePaymentStatus,
  deleteTransaction,
  getTransactionWithPagination,
  removeTransation,
} = require("../controllers/transaction");
const router = express.Router();

// logging middleware
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.originalUrl}`);
  next();
});

// Create a new transaction
router.post("/createTransaction", createTransaction);

// Get all transactions for a specific product
router.get("/getTransactionsByProduct/:productID", getTransactionsByProduct);

// Get all transactions for a specific user
router.post("/getTransactionsByUser", getTransactionsByUser);

// Get all transactions in the system
router.post("/getAllTransactions", getAllTransactions);

// Update payment status on a transaction
router.patch("/updatePaymentStatus", updatePaymentStatus);

// Delete a transaction
router.delete("/deleteTransaction", deleteTransaction);

router.get("/getTransactions", getTransactionWithPagination);
router.delete("/:id", removeTransation);

module.exports = router;
