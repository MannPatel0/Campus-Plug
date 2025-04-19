// routes/product.js
const express = require("express");
const { getReviews, submitReview } = require("../controllers/review");
const router = express.Router();

router.get("/:id", getReviews);
router.post("/addReview", submitReview);

module.exports = router;
