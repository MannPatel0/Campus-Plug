// routes/transaction.js
const express = require("express");
const {
  createTransaction,
  getTransactionsByProduct,
  getTransactionsByUser,
  getAllTransactions,
  deleteTransaction,
  getTransactionWithPagination,
  removeTransation,
  updateTransactionStatus,
} = require("../controllers/transaction");
const router = express.Router();

// logging middleware
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/createTransaction", createTransaction);
router.get("/getTransactionsByProduct/:productID", getTransactionsByProduct);
router.post("/getTransactionsByUser", getTransactionsByUser);
router.post("/updateStatus", updateTransactionStatus);
router.post("/getAllTransactions", getAllTransactions);
router.delete("/deleteTransaction", deleteTransaction);
router.get("/getTransactions", getTransactionWithPagination);
router.delete("/:id", removeTransation);

module.exports = router;
