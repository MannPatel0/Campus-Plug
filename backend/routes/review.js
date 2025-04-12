// routes/product.js
const express = require("express");
const { getReviews, submitReview } = require("../controllers/review");
const router = express.Router();

router.get("/:id", getReviews);
router.post("/add", submitReview);

module.exports = router;
