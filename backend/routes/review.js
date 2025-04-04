// routes/product.js
const express = require("express");
const { getreview, submitReview } = require("../controllers/review");
const router = express.Router();

router.get("/:id", getreview);
router.post("/add", submitReview);

module.exports = router;
