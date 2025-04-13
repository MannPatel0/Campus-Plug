// routes/product.js
const express = require("express");
const {
  HistoryByUserId,
  DelHistory,
  AddHistory,
} = require("../controllers/history");
const router = express.Router();

router.post("/getHistory", HistoryByUserId);
router.post("/delHistory", DelHistory);
router.post("/addHistory", AddHistory);

module.exports = router;
