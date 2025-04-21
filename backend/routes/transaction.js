// // routes/transaction.js
// const express = require("express");
// const txCtrl = require("../controllers/transaction");  // <— grab the module
// const router = express.Router();

// // logging middleware
// router.use((req, res, next) => {
//   console.log(`Incoming ${req.method} ${req.originalUrl}`);
//   next();
// });

// // Create a new transaction
// router.post("/createTransaction", txCtrl.createTransaction);

// // Get all transactions for a specific product
// router.get("/getTransactionsByProduct/:productID", txCtrl.getTransactionsByProduct);

// // Get all transactions for a specific user
// router.post("/getTransactionsByUser", txCtrl.getTransactionsByUser);

// // Get all transactions in the system
// router.post("/getAllTransactions", txCtrl.getAllTransactions);

// // Update payment status on a transaction
// router.patch("/updatePaymentStatus", txCtrl.updatePaymentStatus);

// // Delete a transaction
// router.delete("/deleteTransaction", txCtrl.deleteTransaction);

// module.exports = router;


// routes/transaction.js
const express = require("express");
const {
  createTransaction,
  getTransactionsByProduct,
  getTransactionsByUser,
  getAllTransactions,
  updatePaymentStatus,
  deleteTransaction,
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

module.exports = router;
