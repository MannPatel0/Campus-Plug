// routes/product.js
const express = require("express");
const { HistoryByUserId } = require("../controllers/history");
const router = express.Router();

router.post("/getHistory", HistoryByUserId);

module.exports = router;
