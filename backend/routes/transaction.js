const express = require("express");
const {
  getTransactionWithPagination,
  removeTransation,
} = require("../controllers/transaction");

const router = express.Router();

router.get("/getTransactions", getTransactionWithPagination);
router.delete("/:id", removeTransation);

module.exports = router;
